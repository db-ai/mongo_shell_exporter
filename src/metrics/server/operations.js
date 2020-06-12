import Registry from 'src/registry.js'

Registry.createMetric(
  require('src/metrics/server/operations/server_operations.json')
)
Registry.createMetric(
  require('src/metrics/server/operations/server_operations_aggregate_stages.json')
)
Registry.createMetric(
  require('src/metrics/server/operations/server_operations_latency_count.json')
)
Registry.createMetric(
  require('src/metrics/server/operations/server_operations_latency_sum.json')
)
Registry.createMetric(
  require('src/metrics/server/operations/server_operations_read_concern.json')
)
Registry.createMetric(
  require('src/metrics/server/operations/server_operations_replicated.json')
)
