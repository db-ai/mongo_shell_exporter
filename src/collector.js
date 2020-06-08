import console from 'src/utils/console.js'

import TimeMeter from 'src/time_meter.js'
import CommandError from 'src/errors/command_error.js'

const _registredProbes = {}
const _autorunProbes = []

export default class Collector {
  static get probes () {
    return _registredProbes
  }

  static get autorunProbes () {
    return _autorunProbes
  }

  static registerProbe (probeClass, config = {}) {
    console.debug(`Register: ${probeClass.name}. Autorun ${probeClass.autorun}`)
    const queueItem = this.makeQueueItem(probeClass, config)
    this.probes[probeClass.name] = queueItem

    if (probeClass.autorun) this.autorunProbes.push(queueItem)
  }

  static makeQueueItem (probeClass, config) {
    return { Constructor: probeClass, config: config }
  }

  constructor (mongo, bridge) {
    this._mongo = mongo
    this._bridge = bridge

    this.queue = [].concat(Collector.autorunProbes)

    this._running = false

    this._collectorRuntime = new TimeMeter(false)
  }

  get mongo () {
    return this._mongo
  }

  get bridge () {
    return this._bridge
  }

  get running () {
    return this._running === true
  }

  get stopped () {
    return this._running === false
  }

  start () {
    this._running = true
  }

  stop () {
    if (this.stopped) return

    this._running = false
  }

  collect () {
    if (this.running) return

    // Allow running queries on secondaries. Slavery is bad.
    rs.slaveOk()

    this._collectorRuntime.start()
    this.start()

    while (this.queue.length > 0) {
      if (this.stopped) break

      this.consumeQueue()
    }

    this._collectorRuntime.stop()
  }

  addToQueue (probeClass, config) {
    console.debug(`Queued: ${probeClass.name}, config: ${JSON.stringify(config)}`)
    this.queue.push(Collector.makeQueueItem(probeClass, config))
  }

  consumeQueue () {
    if (this.stopped) return

    const probe = this.queue.shift()

    console.debug(
      `Queue size: ${this.queue.length} collector: ${this.mongo}, probe ${probe.Constructor.name}. `
    )

    const currentProbe = new probe.Constructor(this, probe.config)
    currentProbe.run()
  }

  assertCommandOk (response, command) {
    if (response.ok !== 1) {
      throw new CommandError(response, command)
    }
  }
}
