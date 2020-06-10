import Registry from 'src/registry.js'

Registry.createMetric(require('src/metrics/wt/compression/wt_compresssion_read_pages.json'))
Registry.createMetric(require('src/metrics/wt/compression/wt_compresssion_written_pages.json'))
Registry.createMetric(require('src/metrics/wt/compression/wt_compresssion_written_failed_to_compress_pages.json'))
Registry.createMetric(require('src/metrics/wt/compression/wt_compresssion_written_too_small_to_compress_pages.json'))
Registry.createMetric(require('src/metrics/wt/compression/wt_compresssion_page_size_before_bytes_max.json'))
