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
     * The function to be executed on command run.
     */
  Run (client, message, res) {
    return console.error('Run not defined for command.')
  }
}

module.exports = Command
