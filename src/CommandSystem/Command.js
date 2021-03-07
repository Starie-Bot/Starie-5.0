/**
 * @typedef  {Object}     Option
 * @property {OptionType} type
 * @property {String}     name
 * @property {String}     description
 * @property {boolean}    required
 * @property {String[]}   choices
 * @property {Option[]}   options
 */
class Command {
  /**
     * @typedef  {Object}   CommandData
     * @property {String}   name
     * @property {String}   description
     * @property {Option[]} args
     *
     * @param {CommandData} data
     * @param {Client}      client
     */
  constructor (data, client) {
    if (!data || !client) { return }

    /**
         * The command's name, defaults to the member name;
         * @type {String}
         */
    this.name = data.memberName

    /**
         * The command's description
         * @type {String}
         */
    this.description = data.description || 'No description'

    /**
         * The arguments.
         * @type {Option}
         */
    this.options = data.args || []
  }

  /**
      * Check whether or not the user has specific permissions.
      * @param {import("discord.js").GuildMember} member
      * @param {import("discord.js").PermissionFlags} permission
      */
  async HasPermission (message) {}

  /**
     * The function to be executed on command run.
     * @param {import("../SlashCommands/Message")} message
     * @abstract
     */
  async Run (message) {
    return console.error('Run not defined for command.')
  }
}

module.exports = Command
