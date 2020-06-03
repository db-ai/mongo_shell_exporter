import Rule from "src/rule.js";
export default class Read extends Rule {
  match() {
    this.rawValue = this.cutKey(this.anyPath);
    if (this.rawValue != undefined) return true;
  }

  get anyPath() {
    return (this.rule.path || this.rule.metric_name);
  }

  call() {
    const [unsupported, value] = this.normalizedValue(this.rawValue);

    this.addMetric(value, this.rule.labels);
  }
}