import Probe from 'src/probe.js'
import ListCollectionsProbe from 'src/probes/list_collections.js'

const _databaseStatsProbe = { dbStats: 1 }

export default class DatabaseStatsProbe extends Probe {
  static config (databaseName) {
    return { databaseName: databaseName }
  }

  execute () {
    this.runCommand(this.config.databaseName, _databaseStatsProbe)
    // dbStats
    this.queueProbe(ListCollectionsProbe, ListCollectionsProbe.config(this.config.databaseName))
  }
}

Probe.register(DatabaseStatsProbe)
