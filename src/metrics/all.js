import Registry from 'src/registry.js'

require('src/metrics/db.js')
require('src/metrics/wt.js')
require('src/metrics/collection.js')

Registry.createMetric(require('src/metrics/probe_runtime_seconds.json'))
Registry.createMetric(require('src/metrics/probe_runs_total.json'))

Registry.createMetric(require('src/metrics/bridge_runtime_seconds.json'))
Registry.createMetric(require('src/metrics/bridge_runs_total.json'))
Registry.createMetric(require('src/metrics/bridge_keys_seen_total.json'))

Registry.createMetric(require('src/metrics/server/server_info.json'))
Registry.createMetric(require('src/metrics/server/net/server_net_recieved_bytes_total.json'))
Registry.createMetric(require('src/metrics/server/net/server_net_sent_bytes_total.json'))
