import Registry from 'src/registry.js'

Registry.createMetric(require('src/metrics/wt/lsm/wt_lsm_chunks_count.json'))
Registry.createMetric(require('src/metrics/wt/lsm/wt_lsm_filters_count.json'))
Registry.createMetric(require('src/metrics/wt/lsm/wt_lsm_filter_false_positive.json'))
Registry.createMetric(require('src/metrics/wt/lsm/wt_lsm_filter_hits.json'))
Registry.createMetric(require('src/metrics/wt/lsm/wt_lsm_filter_misses.json'))
Registry.createMetric(require('src/metrics/wt/lsm/wt_lsm_evicted_pages_total.json'))
Registry.createMetric(require('src/metrics/wt/lsm/wt_lsm_read_from_cache_pages.json'))
Registry.createMetric(require('src/metrics/wt/lsm/wt_lsm_filter_size.json'))
Registry.createMetric(require('src/metrics/wt/lsm/wt_lsm_sleep_throttle.json'))
Registry.createMetric(require('src/metrics/wt/lsm/wt_lsm_merge_generation.json'))
Registry.createMetric(require('src/metrics/wt/lsm/wt_lsm_queires_couldve_use_filters_but_havent.json'))
