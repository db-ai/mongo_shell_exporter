import Probe from 'src/probe.js'
import CollectionStatsProbe from 'src/probes/collection_stats.js'

export default class ListCollectionsProbe extends Probe {
  static config (databaseName) {
    return { databaseName: databaseName }
  }

  execute () {
    const colletionNames = this.getDatabase(this.config.databaseName).getCollectionNames()

    for (const collection of colletionNames) {
      this.queueProbe(CollectionStatsProbe, CollectionStatsProbe.config(this.config.databaseName, collection))
    }
  }
}

Probe.register(ListCollectionsProbe)
