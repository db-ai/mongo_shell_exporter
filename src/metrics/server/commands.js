import Registry from 'src/registry.js'

Registry.createMetric(
  require('src/metrics/server/commands/server_commands_failed.json')
)
Registry.createMetric(
  require('src/metrics/server/commands/server_commands_total.json')
)
