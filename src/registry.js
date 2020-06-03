class Registry {
  constructor(bridge, prefix = "") {
    this.bridge = bridge;
    this.all = {};
    this.prefix = prefix;
  }

  writeProbe(probe_name, runtime, is_error, labels = {}) {
    const context = Object.merge({probe: probe_name}, labels);

    this.write("probe_duration_seconds", runtime, context);

    if(is_error != null) {
      this.write("probe_ok", 0, context);
      return true;
    }
  }

  parse(object, context = {}) {
    this.bridge.parse(object, this, context);
  }

  write(key, value, context = {}) {
    const object = {};
    object[key] = value;

    this.parse(object, context);
  }

  add(type, metric_name, help, labels = {}, value, timestamp) {
    const metric = this.fetch(type, metric_name, help, labels);

    metric.value = value;
    metric.timestamp = timestamp;

    this.all[metric.identity] = metric;
  }

  fetch(type, metric_name, help, labels) {
    metric_name = [this.prefix, metric_name].join("");
    return new Metric(type, metric_name, help, labels);
  }

  output() {
    const seen_keys = {};

    for (const key in this.all) {
      const element = this.all[key];
      const metric_name = element.name;

      if(seen_keys[metric_name] == undefined) {
        seen_keys[metric_name] = true;
        print(element.banner);
      }

      print(element.metric);
    }
  }
}