import AbstractValue from 'src/metric/abstract_value.js'

export default class Counter extends AbstractValue {
  inc (incrementBy = 1, initialValue = 0) {
    this._value = (this._value || initialValue) + incrementBy

    return this._value
  }
}
