export default class TimeMeter {
  constructor (autoMode = true) {
    this.autoMode = autoMode
    this._running = false
    this._runTime = 0

    if (this.autoMode) this.start()
  }

  start () {
    if (this._running) return

    this._running = true
    this._startTime = this.getCurrentTime()
  }

  stop () {
    if (!this._running) return

    this._endTime = this.getCurrentTime()

    this._running = false
    this._runTime += this.timeDiff()
  }

  get runtime () {
    if (this.autoMode) {
      this.stop()
      return this._runTime
    }

    return this.timeDiff(undefined, this.getCurrentTime())
  }

  get runtimeSeconds () {
    return this.runtime / 1000.0
  }

  getCurrentTime () {
    return new Date().getTime()
  }

  timeDiff (start = this._startTime, end = this._endTime) {
    return (end - start)
  }
}
