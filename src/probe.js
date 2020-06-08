import console from 'src/utils/console.js'

import Collector from 'src/collector.js'
import CommandError from 'src/errors/command_error.js'
import TimeMeter from 'src/time_meter.js'

export default class Probe {
  static register (className) {
    Collector.registerProbe(className)
  }

  constructor (collector, config = {}) {
    this.collector = collector
    this._config = config
    this._mongo = collector.mongo
    this._bridge = collector.bridge
    const _name = this.constructor.name

    this._probeMetrics = {
      runtime: this._bridge.getMetric('probe_runtime_seconds', {
        probe: _name
      }),
      runs_count: this._bridge.getMetric('probe_runs_total', {
        probe: _name
      })
    }
  }

  get mongo () {
    return this._mongo
  }

  get config () {
    return this._config
  }

  get bridge () {
    return this._bridge
  }

  run () {
    console.debug(
      `${this.constructor.name}, config: ${JSON.stringify(this.config)}`
    )

    const probeRuntime = new TimeMeter()

    this.execute()

    probeRuntime.stop()

    this._probeMetrics.runtime.inc(probeRuntime.runtimeSeconds)
    this._probeMetrics.runs_count.inc()
  }

  queueProbe (probeClass, config = {}) {
    this.collector.addToQueue(probeClass, config)
  }

  runAdminCommand (command) {
    return this.runCommand('admin', command)
  }

  runCommand (databaseName, command) {
    const currentDb = this.mongo.getDB(databaseName)
    const response = currentDb.runCommand(command)

    this.assertCommandOk(response, command)

    return response
  }

  getDatabase (databaseName) {
    return this.mongo.getDB(databaseName)
  }

  getCollection (databaseName, collectionName) {
    const database = this.getDatabase(databaseName)
    return database.getCollection(collectionName)
  }

  assertCommandOk (response, command) {
    if (response.ok !== 1) {
      throw new CommandError(response, command)
    }
  }

  abortQueue () {
    this.collector.abort()
  }
}
