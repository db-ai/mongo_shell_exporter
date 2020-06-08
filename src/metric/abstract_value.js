export default class AbstractValue {
  constructor (labels) {
    this._labels = labels || {}
    this._value = undefined
  }

  get labels () {
    return this._labels
  }

  get stringLabels () {
    const buffer = []

    for (const key in this.labels) {
      if (Object.prototype.hasOwnProperty.call(this.labels, key)) {
        const element = this.labels[key]
        // element = element.replace(/"/g, '\\\"');
        buffer.push(`${key}="${element}"`)
      }
    }

    if (buffer.length === 0) {
      return ''
    } else {
      const allLabels = buffer.join(', ')

      return `{${allLabels}}`
    }
  }

  get value () {
    return this._value
  }

  set value (newValue) {
    this._value = newValue
  }

  setLabel (key, value) {
    this._labels[key] = value
  }
}
