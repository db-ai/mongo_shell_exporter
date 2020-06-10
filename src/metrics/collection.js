import Registry from 'src/registry.js'

Registry.createMetric(require('src/metrics/collection/collection_document_size_avg_bytes.json'))
Registry.createMetric(require('src/metrics/collection/collection_documents_count.json'))
Registry.createMetric(require('src/metrics/collection/collection_size_bytes.json'))
Registry.createMetric(require('src/metrics/collection/collection_storage_size_bytes.json'))
Registry.createMetric(require('src/metrics/collection/collection_index_size_bytes.json'))
Registry.createMetric(require('src/metrics/collection/collection_capped_max_count.json'))
Registry.createMetric(require('src/metrics/collection/collection_capped_max_size_bytes.json'))
