import Metric from 'src/metric'
import TimeMeter from 'src/time_meter'

const _registredMetrics = {}

export default class Registry {
  static get metrics () {
    return _registredMetrics
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
    throw new Error(
      `Can't get metric ${name}(${JSON.stringify(
        labels
      )}): metric doesn't exist`
    )
  }

  static missingMetric (name, labels) {
    throw new Error(
      `Can't get metric ${name}(${JSON.stringify(
        labels
      )}): labeled serie doesn't exist`
    )
  }

  static createMetric (config) {
    Registry.validateConfig(config)

    const metric = Metric.newOfType(config)
    Registry.metrics[config.name] = metric

    return metric
  }

  static validateConfig (config) {
    const currentMetric = Registry.metrics[config.name]

    if (currentMetric !== undefined) {
      throw new Error(`Metric ${config.name} is already defined`)
    }
  }

  constructor (config = {}) {
    this._config = config
    this._metrics = Registry.metrics
    this._parseTree = {}
  }

  get metrics () {
    return this._metrics
  }

  get parseTree () {
    return this._parseTree
  }

  getMetric () {
    return Registry.getMertic.apply(Registry, arguments)
  }

  compileTree () {
    const compilationRuntime = new TimeMeter()

    const values = Object.values(this.metrics)

    for (const metric of values) {
      if (metric.config.sources !== undefined) {
        for (const metricSource of metric.config.sources) {
          metric.config.source = metricSource
          this.parseMerticConfig(metric)
        }
      } else if (metric.config.source !== undefined) {
        this.parseMerticConfig(metric)
      }
    }

    compilationRuntime.stop()

    this.getMetric('registry_compile_time_seconds').value = compilationRuntime.runtimeSeconds
  }

  parseMerticConfig (metric) {
    const config = metric.config
    if (config.map === undefined) return

    const rootPath = [config.source]
    if (config.root) rootPath.push(...config.root)

    let ruleIndex = 0

    for (const rule of config.map) {
      ruleIndex = ruleIndex + 1

      if (rule.value_path) {
        const path = rootPath.concat(rule.value_path)

        this.createSourceTreePath(path, function (
          sourceValue,
          sourceLabels = {}
        ) {
          const metricLabels = Object.merge(sourceLabels, rule.labels)
          metric.setValue(metricLabels, sourceValue)
        })
      } else if (rule.labels_paths) {
        const metricValue = rule.value

        for (const labelRule of rule.labels_paths) {
          const path = rootPath.concat(labelRule.value_path)

          this.createSourceTreePath(path, function (
            sourceValue,
            sourceLabels = {}
          ) {
            metric.setLabelValue(
              sourceLabels,
              metricValue,
              labelRule.label,
              sourceValue
            )
          })
        }
      } else {
        throw new Error(
          `Rule #${ruleIndex} in '${config.name}' doesn't have nor value_path or labels_paths.`
        )
      }
    }
  }

  createSourceTreePath (path, callback) {
    let treeLevel = this.parseTree
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
}
