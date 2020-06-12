import Probe from 'src/probe.js'
import CollectionStatsProbe from 'src/probes/collection_stats.js'

export default class ListCollectionsProbe extends Probe {
  static config (databaseName) {
    return { databaseName: databaseName }
  }

  execute () {
    const colletionNames = this.getDatabase(
      this.config.databaseName
    ).getCollectionNames()

    for (const collection of colletionNames) {
      const namespace = [this.config.databaseName, collection].join('.')

      if (this.bridge.registry.config.namespaceEnabled(namespace)) {
        this.queueProbe(
          CollectionStatsProbe,
          CollectionStatsProbe.config(this.config.databaseName, collection)
        )
      }
    }
  }
}

Probe.register(ListCollectionsProbe)
