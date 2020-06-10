import AbstractValue from 'src/metric/abstract_value.js'

export default class Gauge extends AbstractValue {
  get value () {
    return this._value
  }

  set value (newValue) {
    this._value = newValue
  }

  inc (incrementBy = 1, initialValue = 0) {
    this._value = (this._value || initialValue) + incrementBy

    return this._value
  }
}
