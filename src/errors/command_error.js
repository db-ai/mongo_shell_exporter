export default class CommandError extends Error {
  constructor (response, command) {
    super(response.message)

    this.name = 'CommandError'

    this.code = response.code
    this.codeName = response.codeName
    this.command = command
  }
}
