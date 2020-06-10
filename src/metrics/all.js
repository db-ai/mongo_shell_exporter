import Registry from 'src/registry.js'

require('src/metrics/exporter.js')
require('src/metrics/db.js')
require('src/metrics/wt.js')
require('src/metrics/collection.js')

Registry.createMetric(require('src/metrics/server/server_info.json'))
Registry.createMetric(require('src/metrics/server/net/server_net_recieved_bytes_total.json'))
Registry.createMetric(require('src/metrics/server/net/server_net_sent_bytes_total.json'))
