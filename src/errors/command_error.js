export default class CommandError extends Error {
  constructor (response, command) {
    super(`Can't execute '${JSON.stringify(command)}', ${response.codeName}: ${response.errmsg} (${response.code})`)

    this.name = 'CommandError'

    this.code = response.code
    this.codeName = response.codeName
    this.command = command
  }
}
