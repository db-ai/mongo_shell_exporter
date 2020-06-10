import Registry from 'src/registry.js'

Registry.createMetric(require('src/metrics/exporter/probe_runtime_seconds.json'))
Registry.createMetric(require('src/metrics/exporter/probe_runs_total.json'))

Registry.createMetric(require('src/metrics/exporter/bridge_runtime_seconds.json'))
Registry.createMetric(require('src/metrics/exporter/bridge_runs_total.json'))
Registry.createMetric(require('src/metrics/exporter/bridge_keys_seen_total.json'))
Registry.createMetric(require('src/metrics/exporter/bridge_keys_exported_total.json'))

Registry.createMetric(require('src/metrics/exporter/bridge_keys_missed_total.json'))
Registry.createMetric(require('src/metrics/exporter/bridge_keys_unknown_total.json'))

Registry.createMetric(require('src/metrics/exporter/registry_compile_time_seconds.json'))
