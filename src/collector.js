const serverStatusCommand = { serverStatus: 1 }
const databaseStatusCommand = { dbStats: 1 }
const listDatabaseCommand = { listDatabases: 1 }

const collectionStatusPipeline = [{
  $collStats: {
    storageStats: {},
    latencyStats: {
      histograms: true
    }
  }
}]

export default class Collector {
  constructor (mongo, exporter) {
    this.mongo = mongo
    this.exporter = exporter
  }

  collect () {
    this.exporter.beginProbe()

    this.exporter.exportServerStatus(function () {
      return this.getServerStatus()
    }.bind(this))

    const databasesList = this.exporter.databaseListProbe(function () {
      return this.listDatabases()
    }.bind(this))

    for (const database of databasesList) {
      const currentDatabase = this.getDatabase(database.name)

      this.exporter.exportDatabaseStatus(database.name, function () {
        return this.getDatabaseStatus(currentDatabase)
      }.bind(this))

      const databaseCollections = this.exporter.collectionListProbe(database.name, function () {
        return this.getCollectionNames(currentDatabase)
      }.bind(this))

      for (const collectionName of databaseCollections) {
        this.exporter.exportCollectionStatus(database.name, collectionName, function () {
          return this.getCollectionStatus(currentDatabase, collectionName)
        }.bind(this))
      };
    };

    this.exporter.finishProbe()
  };

  getServerStatus () {
    return this.mongo.adminCommand(serverStatusCommand)
  };

  getCollectionNames (currentDatabase) {
    return currentDatabase.getCollectionNames()
  };

  listDatabases () {
    const databasesList = this.mongo.adminCommand(listDatabaseCommand)

    return databasesList.databases
  };

  getDatabase (databaseName) {
    return this.mongo.getDB(databaseName)
  };

  getDatabaseStatus (database) {
    const dbStat = database.runCommand(databaseStatusCommand)

    return dbStat
  };

  getCollectionStatus (database, collectionName) {
    const currentCollection = database.getCollection(collectionName)
    const collStatCursor = currentCollection.aggregate(collectionStatusPipeline)

    return collStatCursor.toArray()
  };
}
