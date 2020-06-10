import console from 'src/utils/console.js'
import TimeMeter from 'src/time_meter.js'

export default class Bridge {
  constructor (registry) {
    this._registry = registry
    this.parseTree = this._registry.parseTree
  }

  get registry () {
    return this._registry
  }

  getMetric (metricName, labels) {
    return this.registry.getMertic(metricName, labels)
  }

  consume (source, object, labels = {}) {
    const bridgeRuntime = new TimeMeter()

    const tree = this.parseTree[source]

    if (tree === undefined) {
      const availableKeys = Object.keys(this.parseTree)
      console.debug(`No parse tree for source: ${source} (${availableKeys})`)
      return
    }

    const metricKeysSeen = this.getMetric('bridge_keys_seen_total', { source: source })
    this.processLevel(tree, object, labels, metricKeysSeen)

    bridgeRuntime.stop()

    this.getMetric('bridge_runtime_seconds', { source: source }).inc(
      bridgeRuntime.runtimeSeconds
    )
    this.getMetric('bridge_runs_total', { source: source }).inc()
  }

  processLevel (currentTree, currentObject, labels, metricKeysSeen) {
    // if (currentTree === undefined) return

    for (const key in currentObject) {
      metricKeysSeen.inc()

      if (Object.prototype.hasOwnProperty.call(currentObject, key)) {
        if (Object.prototype.hasOwnProperty.call(currentTree, key)) {
          const currentValue = currentObject[key]
          const currentTreeValue = currentTree[key]

          if (currentValue.constructor.name === 'Object') {
            this.processLevel(currentTreeValue, currentValue, labels, metricKeysSeen)
            delete currentObject[key]
            continue
          }

          if (typeof currentTreeValue === 'function') {
            const [, value] = this.normalizedValue(currentValue)
            //  function (sourceValue, sourceLabels = {})
            currentTreeValue(value, labels)
            continue
          }
        }
      }
    }
  }

  normalizedValue (value) {
    const currentType = typeof value
    let returnValue
    let unsupported

    switch (currentType) {
      case 'string':
        unsupported = true
        returnValue = value
        break
      case 'number':
        returnValue = value
        break
      case 'boolean':
        returnValue = Number(value)
        break
      case 'object':
        switch (value.constructor) {
          case NumberLong:
            returnValue = Number(value)
            break
        }

        unsupported = true
        break
      default:
        unsupported = true
        break
    }

    return [unsupported, returnValue]
  }
}
