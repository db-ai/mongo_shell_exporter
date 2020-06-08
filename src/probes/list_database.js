import Probe from 'src/probe.js'
import DatabaseStatsProbe from 'src/probes/database_stats.js'
const _listDatabaseCommand = { listDatabases: 1 }

export default class ListDatabaseProbe extends Probe {
  execute () {
    const response = this.runAdminCommand(_listDatabaseCommand)

    for (const database of response.databases) {
      this.queueProbe(DatabaseStatsProbe, DatabaseStatsProbe.config(database.name))
    }
  }
}

Probe.register(ListDatabaseProbe)
