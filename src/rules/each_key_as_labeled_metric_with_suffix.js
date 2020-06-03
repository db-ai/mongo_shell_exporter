import Rule from "src/rule.js";
export default class EachKeyAsLabeledMetricWithSuffix extends Rule {
  match() {
    this.rawObject = this.cutKey(this.rule.path);

    if (this.rawObject != undefined) return true;
  }

  call() {
    for (const key in this.rawObject) {
      const labels = {}
      const rawValue = this.rawObject[key];
      labels[this.rule.label_name] = key;

      for (const suffix in rawValue) {
        if (rawValue.hasOwnProperty(suffix)) {
          const rawSubvalue = rawValue[suffix];
          const [, value] = this.normalizedValue(rawSubvalue);

          this.addMetricWithSuffix(suffix, value, labels)
        }
      }
    }
  }
}
