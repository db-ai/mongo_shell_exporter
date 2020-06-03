import CommandError from 'src/errors/command_error.js'

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

    // Allow running queries on secondaries. Slavery is bad.
    rs.slaveOk()

    this.exporter.exportServerStatus(function () {
      return this.getServerStatus()
    }.bind(this))

    const databasesList = this.exporter.databaseListProbe(function () {
      return this.listDatabases()
    }.bind(this))

    if (databasesList === undefined) return this.abortProbe('databaseList')

    for (const database of databasesList) {
      const currentDatabase = this.getDatabase(database.name)

      this.exporter.exportDatabaseStatus(database.name, function () {
        return this.getDatabaseStatus(currentDatabase)
      }.bind(this))

      const collectionList = this.exporter.collectionListProbe(database.name, function () {
        return this.getCollectionNames(currentDatabase)
      }.bind(this))

      if (collectionList === undefined) return this.abortProbe('collectionList')

      for (const collectionName of collectionList) {
        this.exporter.exportCollectionStatus(database.name, collectionName, function () {
          return this.getCollectionStatus(currentDatabase, collectionName)
        }.bind(this))
      };
    };

    this.exporter.finishProbe()
  };

  getServerStatus () {
    const response = this.mongo.adminCommand(serverStatusCommand)

    this.assertCommandOk(response, serverStatusCommand)

    return response
  };

  getCollectionNames (currentDatabase) {
    return currentDatabase.getCollectionNames()
  };

  listDatabases () {
    const databasesList = this.mongo.adminCommand(listDatabaseCommand)

    this.assertCommandOk(databasesList, listDatabaseCommand)

    return databasesList.databases
  };

  getDatabase (databaseName) {
    return this.mongo.getDB(databaseName)
  };

  getDatabaseStatus (database) {
    const dbStat = database.runCommand(databaseStatusCommand)

    this.assertCommandOk(dbStat, databaseStatusCommand)

    return dbStat
  };

  getCollectionStatus (database, collectionName) {
    const currentCollection = database.getCollection(collectionName)
    const collStatCursor = currentCollection.aggregate(collectionStatusPipeline)

    return collStatCursor.toArray()
  };

  assertCommandOk (response, command) {
    if (response.ok !== 1) {
      throw new CommandError(response, command)
    };
  }

  abortProbe (stageName) {
    this.exporter.finishProbe()
  };
}
