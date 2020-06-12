import TimeMeter from 'src/time_meter'
import Metric from 'src/metric.js'

export default class Exporter {
  constructor (registry) {
    this._registry = registry
    this._runtimeMetric = Metric.newOfType({
      type: 'counter',
      name: 'export_flush_runtime_seconds',
      help: 'Time spent printing metrics to stdout',
      internal: true
    })

    this._runtimeMetric.enabled = true

    this.prefix = registry.config.prefix || ''
  }

  export () {
    const exportRuntime = new TimeMeter()
    const allMetrics = this._registry.metrics

    for (const metricName in allMetrics) {
      if (Object.prototype.hasOwnProperty.call(allMetrics, metricName)) {
        const metric = allMetrics[metricName]

        this.outputMetric(metric)
      }
    }

    exportRuntime.stop()

    this._runtimeMetric.findOrCreateSerie({}).inc(exportRuntime.runtimeSeconds)
    this.outputMetric(this._runtimeMetric)
  }

  outputMetric (metric) {
    if (!metric.enabled) return

    if (metric.help) {
      print(`# HELP ${this.prefixedName(metric)} ${metric.help}`)
    }

    print(`# TYPE ${this.prefixedName(metric)} ${metric.type}`)

    for (const serie of metric.series) {
      if (serie.value === undefined) continue
      print(`${this.prefixedName(metric)}${serie.stringLabels} ${serie.value}`)
    }
  }

  prefixedName (metric) {
    return `${this.prefix}${metric.name}`
  }
}
