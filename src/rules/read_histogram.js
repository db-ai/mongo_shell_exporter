import Rule from "src/rule.js";
export default class ReadHistogram extends Rule {
  match() {
    this.rawValue = this.cutKey(this.rule.path);
    if (this.rawValue != undefined) return true;
  }

  call() {
    const [, latencyTotal] = this.normalizedValue(this.rawValue.latency);
    const [, opsTotal] = this.normalizedValue(this.rawValue.ops);

    const histogram = this.rawValue.histogram;

    for (const bucket of histogram) {
      const [, value] = this.normalizedValue(bucket.count);
      const [, bucketLevel] = this.normalizedValue(bucket.micros);

      this.addMetricWithSuffix("bucket", value, { le: bucketLevel });
    }

    this.addMetricWithSuffix("sum", latencyTotal);
    this.addMetricWithSuffix("count", opsTotal);
  }
}