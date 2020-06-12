import Registry from 'src/registry.js'

Registry.createMetric(
  require('src/metrics/server/transactions/server_transactions_collection_writes.json')
)
Registry.createMetric(
  require('src/metrics/server/transactions/server_transactions_current.json')
)
Registry.createMetric(
  require('src/metrics/server/transactions/server_transactions_retried.json')
)
Registry.createMetric(
  require('src/metrics/server/transactions/server_transactions_total.json')
)
