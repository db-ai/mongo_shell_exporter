import Registry from 'src/registry.js'

Registry.createMetric(require('src/metrics/db/db_average_document_size.json'))
Registry.createMetric(require('src/metrics/db/db_collections_count.json'))
Registry.createMetric(require('src/metrics/db/db_data_size.json'))
Registry.createMetric(require('src/metrics/db/db_disk_size.json'))
Registry.createMetric(require('src/metrics/db/db_disk_used.json'))
Registry.createMetric(require('src/metrics/db/db_indexes_count.json'))
Registry.createMetric(require('src/metrics/db/db_index_size.json'))
Registry.createMetric(require('src/metrics/db/db_num_extents.json'))
Registry.createMetric(require('src/metrics/db/db_objects_count.json'))
Registry.createMetric(require('src/metrics/db/db_scale_factor.json'))
Registry.createMetric(require('src/metrics/db/db_storage_size.json'))
Registry.createMetric(require('src/metrics/db/db_views_count.json'))
