import Metric from 'src/metric.js'

const _registredMetrics = {}
const _parseTree = {}

export default class Registry {
  static get metrics () {
    return _registredMetrics
  }

  static get parseTree () {
    return _parseTree
  }

  static getMertic (name, labels = {}) {
    const metric = Registry.metrics[name]

    if (metric) {
      const serie = metric.findOrCreateSerie(labels)
      if (serie) return serie

      Registry.missingMetric(name, labels)
    } else {
      Registry.missingMetricLabel(name, labels)
    }
  }

  static missingMetricLabel (name, labels) {
    throw new Error(`Can't get metric ${name}(${JSON.stringify(labels)}): metric doesn't exist`)
  }

  static missingMetric (name, labels) {
    throw new Error(`Can't get metric ${name}(${JSON.stringify(labels)}): labeled serie doesn't exist`)
  }

  static createMetric (config) {
    Registry.validateConfig(config)

    const rootPath = [config.source]
    if (config.root) rootPath.push(...config.root)

    const metric = Metric.newOfType(config.type, config.name, config.help)
    Registry.metrics[config.name] = metric

    if (config.map === undefined) return metric

    let ruleIndex = 0

    for (const rule of config.map) {
      ruleIndex = ruleIndex + 1

      if (rule.value_path) {
        const path = rootPath.concat(rule.value_path)

        Registry.createSourceTreePath(path, function (sourceValue, sourceLabels = {}) {
          const metricLabels = Object.merge(sourceLabels, rule.labels)
          metric.setValue(metricLabels, sourceValue)
        })
      } else if (rule.labels_paths) {
        const metricValue = rule.value

        for (const labelRule of rule.labels_paths) {
          const path = rootPath.concat(labelRule.value_path)

          Registry.createSourceTreePath(path, function (sourceValue, sourceLabels = {}) {
            metric.setLabelValue(sourceLabels, metricValue, labelRule.label, sourceValue)
          })
        }
      } else {
        throw new Error(
          `Rule #${ruleIndex} in '${config.name}' doesn't have nor value_path or labels_paths.`
        )
      }
    }

    return metric
  }

  static validateConfig (config) {
    const currentMetric = Registry.metrics[config.name]

    if (currentMetric !== undefined) {
      throw new Error(`Metric ${config.name} is already defined`)
    }
  }

  static createSourceTreePath (path, callback) {
    let treeLevel = Registry.parseTree
    const targetKey = path.pop()

    if (targetKey === undefined) {
      throw new Error('Attempted to bind to empty path')
    }

    for (const pathLevel of path) {
      const currentLevel = treeLevel[pathLevel]

      if (currentLevel === undefined) {
        treeLevel[pathLevel] = {}
      }

      treeLevel = treeLevel[pathLevel]
    }

    treeLevel[targetKey] = callback
    return true
  }

  constructor () {
    this.config = Registry
  }
}
