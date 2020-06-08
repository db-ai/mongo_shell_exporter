import Probe from 'src/probe.js'
import ListDatabaseProbe from 'src/probes/list_database.js'

const _serverStatusCommand = { serverStatus: 1 }

export default class ServerStatusProbe extends Probe {
  static get autorun () { return true }

  execute () {
    const serverStatus = this.runAdminCommand(_serverStatusCommand)

    this.bridge.consume('serverStatus', serverStatus)

    this.queueProbe(ListDatabaseProbe)
  }
}

Probe.register(ServerStatusProbe)
