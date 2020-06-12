import Probe from 'src/probe.js'

const _collectionStatusPipeline = [
  {
    $collStats: {
      storageStats: {},
      latencyStats: {
        histograms: true
      }
    }
  }
]

export default class CollectionStatsProbe extends Probe {
  static config (databaseName, collectionName) {
    return { databaseName: databaseName, collectionName: collectionName }
  }

  execute () {
    const collStatCursor = this.getCollection(
      this.config.databaseName,
      this.config.collectionName
    ).aggregate(_collectionStatusPipeline)

    const collectionStats = collStatCursor.toArray()[0]

    const latencyStats = this.cutKey(collectionStats, 'latencyStats')
    const storageStats = this.cutKey(collectionStats, 'storageStats')
    const indexDetails = this.cutKey(storageStats, 'indexDetails')

    // TODO: Explicitly move to the `null` metric to terminate keys
    delete storageStats.indexSizes
    delete storageStats.indexBuilds
    delete storageStats.wiredTiger.creationString

    const labels = {
      db: this.config.databaseName,
      coll: this.config.collectionName
    }

    this.bridge.consume('collectionStats', collectionStats, labels)
    this.bridge.consume('collectionStats.latencyStats', latencyStats, labels)
    this.bridge.consume('collectionStats.storageStats', storageStats, labels)

    for (const indexName in indexDetails) {
      if (Object.prototype.hasOwnProperty.call(indexDetails, indexName)) {
        // TODO: Explicitly move to the `null` metric to terminate keys
        delete indexDetails[indexName].creationString
        delete indexDetails[indexName].metadata.infoObj

        const indexStat = { wiredTiger: indexDetails[indexName] }
        const indexLabels = Object.merge(labels, { idx: indexName })

        this.bridge.consume(
          'collectionStats.indexDetails',
          indexStat,
          indexLabels
        )
      }
    }
  }
}

Probe.register(CollectionStatsProbe)
