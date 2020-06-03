export default class Metric {
  constructor(type, name, help, labels = {}) {
    this._name = name;
    this._help = help;
    this._type = type;

    this._value = undefined;
    this._timestamp = undefined;

    this.labels = labels;
  }

  set value(new_value) {
    this._value = new_value;
  }

  set timestamp(new_timestamp) {
    this._timestamp = new_timestamp;
  }

  get name() {
    return this._name;
  }

  get banner() {
    const buffer = [];

    // if(this._help) {
    //   buffer.push(this.help);
    // }

    buffer.push(this.type);

    return buffer.join("\n");
  }

  get metric() {
    const buffer = [this.identity];

    if(this._value == undefined) {
      buffer.push("Nan");
    } else {
      buffer.push(this._value);
    }

    if(this._timestamp != undefined) {
      buffer.push(this._timestamp);
    }

    return buffer.join(" ");
  }

  get help() {
    return(`# HELP ${this._name} ${this._help}`);
  }

  get type() {
    return(`# TYPE ${this._name} ${this._type}`);
  }

  get identity() {
    return `${this._name}${this.stringLabels}`
  }

  get stringLabels() {
    const buffer = [];

    for (const key in this.labels) {
      let element = this.labels[key];
      //element = element.replace(/"/g, '\\\"');
      buffer.push(`${key}="${element}"`)
    }

    if(buffer.length == 0) {
      return '';
    } else {
      const allLabels = buffer.join(", ")

      return `\{${allLabels}\}`;
    }
  }
}