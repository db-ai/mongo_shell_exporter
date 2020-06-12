import Registry from 'src/registry.js'

require('src/metrics/server/net')
require('src/metrics/server/transactions')

Registry.createMetric(require('src/metrics/server/server_info.json'))
Registry.createMetric(require('src/metrics/server/server_log_asserts.json'))
Registry.createMetric(require('src/metrics/server/server_time.json'))
Registry.createMetric(require('src/metrics/server/server_uptime.json'))
