import Counter from 'src/metric/counter.js'
import Gauge from 'src/metric/gauge.js'
import Histogram from 'src/metric/histogram.js'

export default class Metric {
  static newOfType (config) {
    const typeName = config.type.toLowerCase()
    let metricType

    switch (typeName) {
      case 'counter':
        metricType = Counter
        break
      case 'gauge':
        metricType = Gauge
        break
      case 'histogram':
        metricType = Histogram
        break
      default:
        throw new Error(`Unsupported metric type '${typeName}'`)
    }

    const metric = new Metric(metricType, typeName, config.name, config.help, config)

    return metric
  }

  constructor (TypeClassName, typeName, name, help, config) {
    this.TypeClassName = TypeClassName
    this._name = name
    this._help = help
    this._typeName = typeName
    this._config = config

    // As for 4.2.7 this is not ES6 Map, but mongo own weird Polyfill ¯\_(ツ)_/¯
    // https://github.com/mongodb/mongo/blob/6bcda378bfa25ae70ac15508c171e5eeb2269958/src/mongo/shell/types.js#L531
    this.labeledValues = new Map()
    this.onwValue = new TypeClassName({})

    this.labeledValues.put({}, this.onwValue)
  }

  get config () {
    return this._config
  }

  get name () {
    return this._name
  }

  get help () {
    return this._help
  }

  get type () {
    return this._typeName
  }

  get series () {
    return this.labeledValues.values()
  }

  setValue (seriesLabels, newValue) {
    const serie = this.findOrCreateSerie(seriesLabels)
    serie.value = newValue
  }

  setLabelValue (seriesLabels, seriesValue, labelKey, labelValue) {
    const serie = this.findOrCreateSerie(seriesLabels)
    serie.setLabel(labelKey, labelValue)

    if (seriesValue !== undefined) {
      serie.value = seriesValue
    }
  }

  findOrCreateSerie (labels) {
    let serie = this.labeledValues.get(labels)
    if (serie !== null) return serie

    serie = new this.TypeClassName(labels)
    this.labeledValues.put(labels, serie)

    return serie
  }
}
