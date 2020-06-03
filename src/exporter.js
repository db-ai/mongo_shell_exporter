export default class Exporter {
  constructor(registy) {
    this.registry = registy;
  }

  exportServerStatus(callback) {
    const [serverStatus, runtime, error] = this.measureCallback(callback);

    if(this.registry.writeProbe("serverStatus", runtime, error)) return;

    this.registry.parse(serverStatus);

    return serverStatus;
  };

  exportDatabaseStatus(database, callback) {
    const context = {db: database};
    const [databaseStatus, runtime, error] = this.measureCallback(callback);

    if(this.registry.writeProbe("dbStats", runtime, error, context)) return;

    this.registry.parse(databaseStatus, context);

    return databaseStatus;
  };

  exportCollectionStatus(database, collection, callback) {
    const context = {db: database, coll: collection};
    const [collectionStatus, runtime, error] = this.measureCallback(callback);

    // TODO: Check cursor status
    const stats = collectionStatus[0];

    if(this.registry.writeProbe("$collStats", runtime, error, context)) return;

    const latencyStats = this.cutKey(stats, "latencyStats");
    const storageStats = this.cutKey(stats, "storageStats");
    const indexDetails = this.cutKey(storageStats, "indexDetails");
    this.cutKey(storageStats, "indexSizes");

    this.registry.parse(stats, context);
    this.registry.parse(latencyStats, context);
    this.registry.parse(storageStats, context);

    for (const key in indexDetails) {
      const indexStat = indexDetails[key];
      const currentIndex = {wiredTiger: indexStat};
      const currentContext = Object.merge(context, {idx: key});

      this.registry.parse(currentIndex, currentContext);
    }

    return collectionStatus;
  };

  databaseListProbe(callback) {
    const [databaseList, runtime, error] = this.measureCallback(callback);

    this.registry.writeProbe("listDatabases", runtime, error);

    return databaseList;
  }

  collectionListProbe(database, callback) {
    const [collectionList, runtime, error] = this.measureCallback(callback);

    this.registry.writeProbe("listCollections", runtime, error, {db: database});

    return collectionList;
  }

  measureCallback(callback) {
    const beforeClock = this.getCurrentTime();
    let result;
    let error = null;

    try {
      result = callback.call();
    } catch (err) {
      error = err;
    }

    const afterClock = this.getCurrentTime();
    const runtime = this.getRuntime(beforeClock, afterClock);

    return [result, runtime, error];
  }

  beginProbe() {
    this._startTime = this.getCurrentTime();
  }

  finishProbe() {
    this._endTime = this.getCurrentTime();
    const runtime = this.getRuntime(this._startTime, this._endTime);

    this.registry.write("probe_duration_seconds", runtime);
  }

  // TODO: Figure out how to get monotonic clock source. There is no perfomance object in
  // the Mongo js engine wrapper :|
  getCurrentTime() {
    return new Date().getTime();
  }

  getRuntime(start, end) {
    return (end - start) / 1000.0;
  }

  cutKey(object, key, deleteKey = true) {
    const value = object[key];

    if(deleteKey) delete object[key];

    return value;
  }
}