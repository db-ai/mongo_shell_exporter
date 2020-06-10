import Registry from 'src/registry.js'

require('src/metrics/wt/wt_block_manager.js')
require('src/metrics/wt/wt_cache.js')
require('src/metrics/wt/wt_btree.js')
require('src/metrics/wt/wt_cache_walk.js')
require('src/metrics/wt/wt_compresssion.js')
require('src/metrics/wt/wt_cursor.js')
require('src/metrics/wt/wt_lsm.js')
require('src/metrics/wt/wt_reconciliation.js')

Registry.createMetric(require('src/metrics/wt/wt_info.json'))
Registry.createMetric(require('src/metrics/wt/wt_session_object_compactions.json'))
Registry.createMetric(require('src/metrics/wt/wt_transaction_update_conflicts.json'))
