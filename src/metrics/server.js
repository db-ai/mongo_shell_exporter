import Registry from 'src/registry.js'

Registry.createMetric(require('src/metrics/server/server_info.json'))
Registry.createMetric(require('src/metrics/server/server_time.json'))
Registry.createMetric(require('src/metrics/server/server_uptime.json'))

Registry.createMetric(
  require('src/metrics/server/net/server_net_requests_total.json')
)
Registry.createMetric(
  require('src/metrics/server/net/server_net_recieved_bytes_total.json')
)
Registry.createMetric(
  require('src/metrics/server/net/server_net_sent_bytes_total.json')
)
