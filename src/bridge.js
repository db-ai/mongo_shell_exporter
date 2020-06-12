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
    const runtime = new TimeMeter()

    const tree = this.parseTree[source]
    const ourLabels = Object.assign({}, labels)

    if (tree === undefined) {
      const availableKeys = Object.keys(this.parseTree)
      console.debug(`No parse tree for source: ${source} (${availableKeys})`)
      return
    }

    const levelMetrics = {
      keysSeen: this.getSourceMetric('bridge_keys_seen_total', source),
      keysExported: this.getSourceMetric('bridge_keys_exported_total', source)
    }

    const meta = {
      labels: ourLabels,
      metrics: levelMetrics,
      source: source
    }

    this.processLevel(tree, object, meta)

    runtime.stop()
    const runtimeSeconds = runtime.runtimeSeconds

    this.getSourceMetric('bridge_runtime_seconds', source).inc(runtimeSeconds)
    this.getSourceMetric('bridge_runs_total', source).inc()
  }

  getSourceMetric (name, source) {
    const labels = { source: source }
    return this.registry.getMetric(name, labels)
  }

  processLevel (tree, object, meta, path = []) {
    const visitedKeys = []

    for (const key in object) {
      this.processKey(tree, object, meta, key, path, visitedKeys)
    }

    this.exportUnprocessed(meta, path, object, tree, visitedKeys)
  }

  processKey (tree, object, meta, key, path, visitedKeys) {
    meta.metrics.keysSeen.inc()

    const hasKey = Object.prototype.hasOwnProperty
    if (!hasKey.call(object, key) || !hasKey.call(tree, key)) {
      return
    }

    const value = object[key]
    const treeValue = tree[key] || {}
    let visited = false

    if (value.constructor.name === 'Object') {
      this.processLevel(treeValue, value, meta, path.concat(key))

      // Consider [Object] keys as visited
      visited = true
    }

    if (typeof treeValue.callback === 'function') {
      const [, metricValue] = this.normalizedValue(value)
      const labels = Object.assign({}, meta.labels)
      treeValue.callback(metricValue, labels)

      meta.metrics.keysExported.inc()
      visited = true
    }

    if (visited) {
      visitedKeys.push(key)
      delete object[key]
    }
  }

  exportUnprocessed (meta, path, object, tree, treeVisits) {
    const source = meta.source

    const objectKeys = Object.keys(object)
    const treeKeys = Object.keys(tree)

    const unvisitedObjectKeys = objectKeys.filter(x => !treeVisits.includes(x))
    const unvisitedTreeKeys = treeKeys.filter(x => !treeVisits.includes(x))

    for (const key of unvisitedObjectKeys) {
      this.countUnvisited('bridge_keys_unknown_total', path, source, key)
    }

    for (const key of unvisitedTreeKeys) {
      const labels = { metric: tree[key].name }
      this.countUnvisited('bridge_keys_missed_total', path, source, key, labels)
    }
  }

  countUnvisited (metric, path, source, key, labels = {}) {
    const unknownPath = path.concat(key).join('.')
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
          case Date:
            returnValue = value.getTime()
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
