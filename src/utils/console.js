class Console {
  constructor (level = 'info') {
    this._level = 'info'
  }

  log () {
    let buffer

    if (arguments.length === 1) {
      buffer = this.fixNewlines(arguments[0])
    } else {
      buffer = this.fixNewlines(JSON.stringify(arguments))
    }

    print(`# ${buffer}`)
  }

  debug () {
    if (this._level === 'debug') {
      this.log.apply(this, arguments)
    }
  }

  fixNewlines (line) {
    if (typeof line !== 'string') {
      return line
    }

    const allLines = line.split('\n')
    return allLines.join('\n #')
  }
}

export default new Console()
