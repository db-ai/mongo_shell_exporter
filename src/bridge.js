import { DefaultBridgeConfig } from 'src/bridge/default_bridge_config'

export default class Bridge {
  constructor (config = DefaultBridgeConfig) {
    this.config = config
  }

  parse (object, registry, context) {
    for (const rule of this.config) {
      if (Object.keys(object).length === 0) {
        break
      }

      const ActionClass = rule.action
      const action = new ActionClass(object, rule, registry, context)
      action.matchAndCall()
    }

    this.recordRemaining(object, registry, context)
  }

  recordRemaining (object, registry, context, path = []) {
    for (const key in object) {
      const currentPath = path.concat(key)
      const value = object[key]

      if (value.constructor === Object) {
        this.recordRemaining(value, registry, context, currentPath)
      } else {
        this.recordUnknownMetric(currentPath, value.constructor.name, registry, context)
      }
    }
  }

  recordUnknownMetric (path, type, registry, context) {
    const fullPath = path.join('.')
    const labels = Object.merge(context, { path: fullPath, type: type })

    registry.add('gauge', 'unknown_metric', 'Metrics from Mongo that are not known to exporter', labels, 1)
  }
}
