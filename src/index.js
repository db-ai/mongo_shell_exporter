import Collector from './collector.js';
import Bridge from './bridge.js';
import Exporter from './exporter.js';
import Registry from './registry.js';
const exporter_package = require('../package.json');

try {
  const bridge = new Bridge();
  const registry = new Registry(bridge, "mongo_");
  const exporter = new Exporter(registry);
  const collector = new Collector(db.getMongo(), exporter);

  collector.collect();
  exporter.registry.output();

  print("# TYPE mongo_shell_exporter_info gauge")
  print(`mongo_shell_exporter_info{version="${exporter_package.version}", shell="${version()}"} 1`);

  print("# TYPE mongo_shell_exporter_ok gauge")
  print(`mongo_shell_exporter_ok 1`);

  quit(0);
} catch (err) {
  let message = err.message.replace(/"/g, '');
  let stack = err.stack.replace(/\n/g, ';')

  print("# HELP mongo_shell_exporter_error_info Add information about error happened in exporter");
  print("# TYPE mongo_shell_exporter_error_info gauge");
  print(`mongo_shell_exporter_error_info{error="${err.name}", message="${message}", stack="${stack}"} 1`);

  print("# TYPE mongo_shell_exporter_ok gauge")
  print(`mongo_shell_exporter_ok 0`);

  quit(1);
}
