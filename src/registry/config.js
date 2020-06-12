import RuleMap from 'src/registry/rule_map'

const defaultConfig = require('src/registry/default_config_map.json')

export default class Config {
  constructor (theirConfigMap) {
    this.configMap = this.mergeDeep(defaultConfig, theirConfigMap)

    this.prefix = this.configMap.prefix || ''
    this.metricsRules = new RuleMap(this.configMap.metrics)
    this.namespacesRules = new RuleMap(this.configMap.namespaces)
  }

  metricEnabled (name) {
    const isEnabled = this.metricsRules.match(name)
    return isEnabled
  }

  metricDisabled (name) {
    return !this.metricEnabled(name)
  }

  namespaceEnabled (name) {
    const isEnabled = this.namespacesRules.match(name)
    return isEnabled
  }

  isObject (item) {
    return item && typeof item === 'object' && !Array.isArray(item)
  }

  mergeDeep (fromObject, toObject) {
    const output = Object.assign({}, fromObject)

    if (this.isObject(fromObject) && this.isObject(toObject)) {
      Object.keys(toObject).forEach(key => {
        if (this.isObject(toObject[key])) {
          if (!(key in fromObject)) {
            Object.assign(output, { [key]: toObject[key] })
          } else output[key] = this.mergeDeep(fromObject[key], toObject[key])
        } else {
          Object.assign(output, { [key]: toObject[key] })
        }
      })
    }

    return output
  }
}
