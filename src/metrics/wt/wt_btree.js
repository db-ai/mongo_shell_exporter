import Registry from 'src/registry.js'

Registry.createMetric(require('src/metrics/wt/btree/wt_btree_checkpoint_generation.json'))
Registry.createMetric(require('src/metrics/wt/btree/wt_btree_column_store_pages.json'))
Registry.createMetric(require('src/metrics/wt/btree/wt_btree_column_store_varsize_values.json'))
Registry.createMetric(require('src/metrics/wt/btree/wt_btree_fixed_record_size.json'))
Registry.createMetric(require('src/metrics/wt/btree/wt_btree_leaf_page_size_max_bytes.json'))
Registry.createMetric(require('src/metrics/wt/btree/wt_btree_depth.json'))
Registry.createMetric(require('src/metrics/wt/btree/wt_btree_kv_pairs.json'))
Registry.createMetric(require('src/metrics/wt/btree/wt_btree_overflow_pages.json'))
Registry.createMetric(require('src/metrics/wt/btree/wt_btree_paged_rewriten_by_compaction.json'))
Registry.createMetric(require('src/metrics/wt/btree/wt_btree_row_store_empty_values.json'))
Registry.createMetric(require('src/metrics/wt/btree/wt_btree_row_store_pages.json'))
