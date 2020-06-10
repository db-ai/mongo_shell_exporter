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

  consume (source, object, labels = {}) {
    const bridgeRuntime = new TimeMeter()

    const tree = this.parseTree[source]

    if (tree === undefined) {
      const availableKeys = Object.keys(this.parseTree)
      console.debug(`No parse tree for source: ${source} (${availableKeys})`)
      return
    }

    const levelMetrics = {
      keysSeen: this.registry.getMetric('bridge_keys_seen_total', { source: source }),
      keysExported: this.registry.getMetric('bridge_keys_exported_total', { source: source })
    }

    this.processLevel(tree, object, labels, levelMetrics)

    bridgeRuntime.stop()

    this.registry.getMetric('bridge_runtime_seconds', { source: source }).inc(
      bridgeRuntime.runtimeSeconds
    )
    this.registry.getMetric('bridge_runs_total', { source: source }).inc()
  }

  processLevel (currentTree, currentObject, labels, levelMetrics) {
    // if (currentTree === undefined) return

    for (const key in currentObject) {
      levelMetrics.keysSeen.inc()

      if (Object.prototype.hasOwnProperty.call(currentObject, key)) {
        if (Object.prototype.hasOwnProperty.call(currentTree, key)) {
          const currentValue = currentObject[key]
          const currentTreeValue = currentTree[key]

          if (currentValue.constructor.name === 'Object') {
            this.processLevel(currentTreeValue, currentValue, labels, levelMetrics)
            delete currentObject[key]
            continue
          }

          if (typeof currentTreeValue === 'function') {
            const [, value] = this.normalizedValue(currentValue)
            //  function (sourceValue, sourceLabels = {})
            currentTreeValue(value, labels)
            levelMetrics.keysExported.inc()
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
