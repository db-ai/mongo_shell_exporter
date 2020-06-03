import Rule from 'src/rule.js'
export default class RemapKeysAsMetrics extends Rule {
  match () {
    const foundValue = this.getKey(this.rule.path)
    if (foundValue !== undefined) return true
  }

  call () {
    const globalMap = this.rule.map
    const globalPath = this.rule.path

    for (const key in globalMap) {
      const map = globalMap[key]

      const currentPath = globalPath.concat(key)
      const rawValue = this.cutKey(currentPath)

      if (rawValue === undefined) continue
      if (map.ignore) continue

      let [, value] = this.normalizedValue(rawValue)
      if (map.transform) {
        value = map.transform.call(value)
      }
      const labels = Object.merge(this.rule.labels, map.labels)

      // TODO: This is dangerous, addMetric perhaps should accept type instead
      this.rule.type = map.type || this.rule.default_type
      this.addMetricWithSuffix(map.name, value, labels)
    }
  }
};
