import console from 'src/utils/console.js'

import Collector from 'src/collector.js'
import Bridge from 'src/bridge.js'
import Exporter from 'src/exporter.js'
import Registry from 'src/registry.js'
const exporterPackage = require('../package.json')

require('src/metrics/all.js')
require('src/probes/server_status.js')

try {
  const registry = new Registry()
  const bridge = new Bridge(registry)
  const exporter = new Exporter(registry)
  const collector = new Collector(db.getMongo(), bridge)

  registry.compileTree()
  console.debug('Registry tree OK')

  collector.collect()
  console.debug('Collector OK')

  exporter.export()
  console.debug('Exporter OK')

  print('# TYPE mongo_shell_exporter_info gauge')
  print(`mongo_shell_exporter_info{version="${exporterPackage.version}", shell="${version()}"} 1`)

  print('# TYPE mongo_shell_exporter_ok gauge')
  print('mongo_shell_exporter_ok 1')

  quit(0)
} catch (err) {
  const message = err.message.replace(/"/g, '')
  const stack = err.stack.replace(/\n/g, ';')

  print('# HELP mongo_shell_exporter_error_info Add information about error happened in exporter')
  print('# TYPE mongo_shell_exporter_error_info gauge')
  print(`mongo_shell_exporter_error_info{error="${err.name}", message="${message}", stack="${stack}"} 1`)

  print('# TYPE mongo_shell_exporter_ok gauge')
  print('mongo_shell_exporter_ok 0')

  quit(1)
}
