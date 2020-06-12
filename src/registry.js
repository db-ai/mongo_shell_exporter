import Metric from 'src/metric'
import TimeMeter from 'src/time_meter'
import ExporterConfig from 'src/registry/config'

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

  constructor (configMap = {}) {
    this.config = new ExporterConfig(configMap)
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
      if (!metric.isInternal && this.config.metricDisabled(metric.name)) {
        continue
      }

      metric.enabled = true

      if (metric.config.map_groups !== undefined) {
        const originalMap = metric.config.map
        this.parseMapGroups(metric.config.map_groups, metric)
        metric.config.map = originalMap
      }

      if (metric.config.sources !== undefined) {
        this.parseMultipleSources(metric.config.sources, metric)
      } else if (metric.config.source !== undefined) {
        this.parseMerticConfig(metric)
      }
    }

    compilationRuntime.stop()
    const compiledSeconds = compilationRuntime.runtimeSeconds

    this.getMetric('registry_compile_time_seconds').value = compiledSeconds
  }

  parseMapGroups (groups, metric) {
    for (const mapGroup of groups) {
      metric.config.map = mapGroup.map

      this.parseMultipleSources(mapGroup.sources, metric)
    }

    delete metric.config.source
  }

  parseMultipleSources (sources, metric) {
    for (const metricSource of sources) {
      metric.config.source = metricSource
      this.parseMerticConfig(metric)
    }

    delete metric.config.source
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
        this.addByValuePath(rootPath, rule, metric)
      } else if (rule.labels_paths) {
        this.addByLabelPath(rootPath, rule, metric)
      } else {
        throw new Error(
          `Rule #${ruleIndex} in '${config.name}' doesn't have nor value_path or labels_paths.`
        )
      }
    }
  }

  addByLabelPath (rootPath, rule, metric) {
    const value = rule.value

    for (const labelRule of rule.labels_paths) {
      const path = rootPath.concat(labelRule.value_path)
      const labelKey = labelRule.label

      const setValue = function (sourceValue, sourceLabels = {}) {
        metric.setLabelValue(sourceLabels, value, labelKey, sourceValue)
      }

      this.createSourceTreePath(metric.name, path, setValue)
    }
  }

  addByValuePath (rootPath, rule, metric) {
    const path = rootPath.concat(rule.value_path)

    const setValue = function (sourceValue, sourceLabels = {}) {
      const metricLabels = Object.merge(sourceLabels, rule.labels)
      metric.setValue(metricLabels, sourceValue)
    }

    this.createSourceTreePath(metric.name, path, setValue)
  }

  createSourceTreePath (metricName, path, callback) {
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

    treeLevel[targetKey] = { name: metricName, callback: callback }
    return true
  }
}
