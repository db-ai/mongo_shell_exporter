import Registry from 'src/registry.js'

Registry.createMetric(require('src/metrics/wt/reconciliation/wt_reconciliation_dictionary_mateches.json'))
Registry.createMetric(require('src/metrics/wt/reconciliation/wt_reconciliation_checksum_matches.json'))
Registry.createMetric(require('src/metrics/wt/reconciliation/wt_reconciliation_multi_block_writes.json'))
Registry.createMetric(require('src/metrics/wt/reconciliation/wt_reconciliation_overflow_keys.json'))
Registry.createMetric(require('src/metrics/wt/reconciliation/wt_reconciliation_page_key_discarded_bytes.json'))
Registry.createMetric(require('src/metrics/wt/reconciliation/wt_reconciliation_blocks_required_for_page_max.json'))
Registry.createMetric(require('src/metrics/wt/reconciliation/wt_reconciliation_overflow_values_written.json'))
Registry.createMetric(require('src/metrics/wt/reconciliation/wt_reconciliation_calls.json'))
Registry.createMetric(require('src/metrics/wt/reconciliation/wt_reconciliation_calls_for_eviction.json'))
Registry.createMetric(require('src/metrics/wt/reconciliation/wt_reconciliation_deleted_pages.json'))
