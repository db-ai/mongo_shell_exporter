import AbstractValue from 'src/metric/abstract_value.js'

export default class Gauge extends AbstractValue {
  get value () {
    return this._value
  }

  set value (newValue) {
    this._value = newValue
  }
}
