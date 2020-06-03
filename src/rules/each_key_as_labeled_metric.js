import Rule from "src/rule.js";
export default class EachKeyAsLabeledMetric extends Rule {
  match() {
    this.rawObject = this.cutKey(this.rule.path);

    if (this.rawObject != undefined) return true;
  }

  call() {
    for (const key in this.rawObject) {
      if (this.rawObject.hasOwnProperty(key)) {
        const labels = {}
        const rawValue = this.rawObject[key];
        const [, value] = this.normalizedValue(rawValue);

        labels[this.rule.label_name] = key;

        this.addMetric(value, labels)
      }
    }
  }
}