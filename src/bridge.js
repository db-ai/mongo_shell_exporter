import { DefaultBridgeConfig } from "src/bridge/default_bridge_config";

export default class Bridge {
  constructor(config = DefaultBridgeConfig) {
    this.config = config;
  }

  parse(object, registry, context) {
    let ruleCount = 0;

    for (const rule of this.config) {
      if (Object.keys(object).length == 0) {
        break;
      }

      const actionClass = rule.action;
      const action = new actionClass(object, rule, registry, context);
      action.matchAndCall();
    }

    this.recordRemaining(object, registry, context);
  }

  recordRemaining(object, registry, context, path = []) {
    for (const key in object) {
      let currentPath = path.concat(key);
      let value = object[key];

      if (value.constructor == Object) {
        this.recordRemaining(value, registry, context, currentPath);
      } else {
        this.recordUnknownMetric(currentPath, value.constructor.name, registry, context);
      }
    }

    return;
  }

  recordUnknownMetric(path, type, registry, context) {
    const fullPath = path.join(".");
    const labels = Object.merge(context, { path: fullPath, type: type });

    registry.add("gauge", "unknown_metric", "Metrics from Mongo that are not known to exporter", labels, 1);
  }
}