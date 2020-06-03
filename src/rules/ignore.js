import Rule from 'src/rule.js'
export default class Ignore extends Rule {
  match () {
    let anyMatch = false

    for (const keyPath of this.rule.paths) {
      const keyTarget = this.getKey(keyPath)

      if (keyTarget !== undefined) {
        anyMatch = true
        break
      }
    }

    return anyMatch
  }

  call () {
    this.cutObject(this.rule.paths)
  }
}
