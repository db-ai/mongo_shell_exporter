export default class Rule {
  constructor(object, rule, registry, context) {
    this.object = object;
    this.rule = rule;
    this.registry = registry;
    this.context = context;
  }

  matchAndCall() {
    if (this.match()) this.call();
  }

  addMetric(value, labels = {}) {
    labels = this.mergeContext(labels);
    return this.registry.add(this.rule.type, this.rule.metric_name, this.rule.help, labels, value);
  }

  addMetricWithSuffix(suffix, value, labels = {}) {
    labels = this.mergeContext(labels);
    const metric_name = [this.rule.metric_name, suffix].join("_");
    return this.registry.add(this.rule.type, metric_name, this.rule.help, labels, value);
  }

  mergeContext(object) {
    return Object.merge(this.context, object);
  }

  getKey(key) {
    return this.cutKey(key, false);
  }

  cutKey(key, deleteKey = true) {
    let value = undefined;

    // We need to cut by path recursively
    if (key.constructor != Array) {
      value = this.object[key];

      if (deleteKey) delete this.object[key];
    } else {
      value = this.object;

      let lastLevel = this.object;
      let lastKey;

      for (const currentKey of key) {
        lastLevel = value;
        value = value[currentKey];
        if (value == undefined) break;
        lastKey = currentKey;
      }

      if (value != undefined && deleteKey == true) delete lastLevel[lastKey];
    }

    // TODO: Add not found check
    return value;
  }

  cutObject(keys) {
    const buffer = {};
    let any = false;

    for (let key of keys) {
      const value = this.cutKey(key);
      if (value == undefined) continue;

      if (key.constructor == Array) {
        key = key.join("_")
      }

      buffer[key] = value;
      any = true;
    }

    if (any == false) {
      return undefined;
    }

    return buffer;
  }

  normalizedValue(value) {
    const currentType = typeof (value);
    let returnValue;
    let unsupported = undefined;

    switch (currentType) {
      case "string":
        unsupported = true;
        returnValue = value;
        break;
      case "number":
        returnValue = value;
        break;
      case "boolean":
        returnValue = Number(value);
        break;
      case "object":
        switch (value.constructor) {
          case NumberLong:
            returnValue = Number(value);
            break;
        }

        unsupported = true;
        break;
      default:
        unsupported = true;
        break;
    };

    return [unsupported, returnValue];
  }
}