import TimeMeter from 'src/time_meter'
import Metric from 'src/metric.js'

export default class Exporter {
  constructor (registry) {
    this._registry = registry.config
    this._runtimeMetric = Metric.newOfType(
      'counter',
      'export_flush_runtime_seconds',
      'Time spent printing metrics to stdout'
    )
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
    if (metric.help) {
      print(`# HELP ${metric.name} ${metric.help}`)
    }

    print(`# TYPE ${metric.name} ${metric.type}`)

    for (const serie of metric.series) {
      if (serie.value === undefined) continue
      print(`${metric.name}${serie.stringLabels} ${serie.value}`)
    }
  }
}
