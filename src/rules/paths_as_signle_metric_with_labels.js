import Rule from 'src/rule.js'
export default class PathsAsSingleMetricWithLabels extends Rule {
  match () {
    this.rawLabels = this.cutObject(this.rule.paths)
    if (this.rawLabels === undefined) return false

    const labelsCount = Object.keys(this.rawLabels).length
    if (labelsCount === this.rule.paths.length) return true
  }

  call () {
    for (const key in this.rawLabels) {
      const element = this.rawLabels[key]
      const [, returnValue] = this.normalizedValue(element)
      this.rawLabels[key] = returnValue
    }

    this.addMetric(1, this.rawLabels)
  }
}
