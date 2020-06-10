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
      keysSeen: this.registry.getMetric('bridge_keys_seen_total', {
        source: source
      }),
      keysExported: this.registry.getMetric('bridge_keys_exported_total', {
        source: source
      })
    }

    this.processLevel(tree, object, labels, levelMetrics, source)

    bridgeRuntime.stop()

    this.registry
      .getMetric('bridge_runtime_seconds', { source: source })
      .inc(bridgeRuntime.runtimeSeconds)
    this.registry.getMetric('bridge_runs_total', { source: source }).inc()
  }

  processLevel (
    currentTree,
    currentObject,
    labels,
    levelMetrics,
    source,
    currentPath = []
  ) {
    // if (currentTree === undefined) return
    const treeVisitedKeys = []

    for (const key in currentObject) {
      levelMetrics.keysSeen.inc()

      if (Object.prototype.hasOwnProperty.call(currentObject, key)) {
        if (Object.prototype.hasOwnProperty.call(currentTree, key)) {
          const currentValue = currentObject[key]
          const currentTreeValue = currentTree[key]
          let visited = false

          if (currentValue.constructor.name === 'Object') {
            this.processLevel(
              currentTreeValue,
              currentValue,
              labels,
              levelMetrics,
              source,
              currentPath.concat(key)
            )

            // Consider [Object] keys as visited
            visited = true
          }

          if (
            currentTreeValue !== undefined &&
            typeof currentTreeValue.callback === 'function'
          ) {
            const [, value] = this.normalizedValue(currentValue)
            //  function (sourceValue, sourceLabels = {})
            currentTreeValue.callback(value, labels)

            levelMetrics.keysExported.inc()
            visited = true
          }

          if (visited) {
            treeVisitedKeys.push(key)
            delete currentObject[key]
          }
        }
      }
    }

    this.exportUnprocessed(
      source,
      currentPath,
      currentObject,
      currentTree,
      treeVisitedKeys
    )
  }

  exportUnprocessed (source, currentPath, object, tree, treeVisits) {
    const objectKeys = Object.keys(object)
    const treeKeys = Object.keys(tree)
    const unvisitedObjectKeys = objectKeys.filter(x => !treeVisits.includes(x))
    const unvisitedTreeKeys = treeKeys.filter(x => !treeVisits.includes(x))

    for (const objectKey of unvisitedObjectKeys) {
      this.countUnvisited(
        'bridge_keys_unknown_total',
        currentPath,
        source,
        objectKey
      )
    }

    for (const treeKey of unvisitedTreeKeys) {
      const metricName = tree[treeKey].name
      this.countUnvisited(
        'bridge_keys_missed_total',
        currentPath,
        source,
        treeKey,
        { metric: metricName }
      )
    }
  }

  countUnvisited (metric, currentPath, source, key, labels = {}) {
    const unknownPath = currentPath.concat(key).join('.')
    const defaultLabels = {
      source: source,
      path: unknownPath
    }
    const currentLabels = Object.merge(defaultLabels, labels)

    this.registry.getMetric(metric, currentLabels).inc()
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
