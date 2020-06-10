import Registry from 'src/registry.js'

Registry.createMetric(require('src/metrics/wt/cursor/wt_cursor_ops_restarted.json'))
Registry.createMetric(require('src/metrics/wt/cursor/wt_cursor_inserted_key_value_bytes.json'))
Registry.createMetric(require('src/metrics/wt/cursor/wt_cursor_removed_key_bytes.json'))
Registry.createMetric(require('src/metrics/wt/cursor/wt_cursor_updated_value_bytes.json'))
Registry.createMetric(require('src/metrics/wt/cursor/wt_cursor_reused_from_cache.json'))
Registry.createMetric(require('src/metrics/wt/cursor/wt_cursor_open.json'))
