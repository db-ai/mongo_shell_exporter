import Metric from 'src/metric.js'

export default class Registry {
  constructor (bridge, prefix = '') {
    this.bridge = bridge
    this.all = {}
    this.prefix = prefix
  }

  writeProbe (probeName, runtime, isError, labels = {}) {
    const context = Object.merge({ probe: probeName }, labels)

    this.write('probe_duration_seconds', runtime, context)

    if (isError != null) {
      this.write('probe_ok', 0, context)
      return true
    }
  }

  parse (object, context = {}) {
    this.bridge.parse(object, this, context)
  }

  write (key, value, context = {}) {
    const object = {}
    object[key] = value

    this.parse(object, context)
  }

  add (type, metricName, help, labels = {}, value, timestamp) {
    const metric = this.fetch(type, metricName, help, labels)

    metric.value = value
    metric.timestamp = timestamp

    this.all[metric.identity] = metric
  }

  fetch (type, metricName, help, labels) {
    metricName = [this.prefix, metricName].join('')
    return new Metric(type, metricName, help, labels)
  }

  output () {
    const seenKeys = {}

    for (const key in this.all) {
      const element = this.all[key]
      const metricName = element.name

      if (seenKeys[metricName] === undefined) {
        seenKeys[metricName] = true
        print(element.banner) // eslint-disable-line no-undef
      }

      print(element.metric) // eslint-disable-line no-undef
    }
  }
}
