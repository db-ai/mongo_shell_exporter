import AbstractValue from 'src/metric/abstract_value.js'

export default class Histogram extends AbstractValue {
  constructor () {
    super()

    this._buckets = {}
    this._observationsCount = 0
    this._observationsSum = 0
  }

  setBucketValue (bucketName, bucketValue) {
    // Set bucket value
    this._buckets[bucketName] = bucketValue

    // Increment bucket stats
    this._observationsCount++
    this._observationsSum += bucketValue
  }
}
