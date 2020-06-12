const globChar = '*'

export default class RuleMap {
  constructor (ruleSet) {
    this.allow = []
    this.block = []
    this.allowPrefix = []
    this.blockPrefix = []

    this.extractSectionGlobs(ruleSet)
  }

  extractSectionGlobs (section, glob = globChar) {
    const [allow, allowPrefix] = this.extractPrefix(section.allow)
    this.allow = allow
    this.allowPrefix = allowPrefix

    const [block, blockPrefix] = this.extractPrefix(section.block)
    this.block = block
    this.blockPrefix = blockPrefix
  }

  extractPrefix (rules, glob = globChar) {
    const prefixRules = []
    const matchRules = []

    rules.forEach(rule => {
      if (rule === glob) {
        prefixRules.push('')
        return
      }

      const segments = rule.split(glob)
      if (segments[0] !== '' && segments[1] === '') {
        prefixRules.push(segments[0])
        return
      }

      matchRules.push(rule)
    })

    return [matchRules, prefixRules]
  }

  match (name) {
    if (this.block.includes(name)) return false
    if (this.blockPrefix.some(element => name.startsWith(element))) {
      return false
    }

    if (this.allow.includes(name)) return true
    if (this.allowPrefix.some(element => name.startsWith(element))) {
      return true
    }

    return false
  }
}
