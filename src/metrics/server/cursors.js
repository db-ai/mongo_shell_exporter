import Registry from 'src/registry.js'

Registry.createMetric(
  require('src/metrics/server/cursors/server_cursors_open.json')
)
Registry.createMetric(
  require('src/metrics/server/cursors/server_cursors_special_open.json')
)
Registry.createMetric(
  require('src/metrics/server/cursors/server_cursors_timedout.json')
)
