const Command = require('../../src/CommandSystem/Command')

class PingCommand extends Command {
  constructor (client) {
    super({
      memberName: 'ban',
      description: 'Remove a user from the server, and prevent them from rejoining.',
      args: [{ name: 'user', description: 'The user to ban from the server.', type: 6, required: true }, { name: 'duration', description: 'The duration as to which the ban lasts', type: 4, required: false }, { name: 'reason', description: 'Reason of user-ban, used for audit logs and sent to user.', type: 3, required: false }]
    }, client)
  }

  async HasPermission (message) {
    return (await message.getMember()).hasPermission('BAN_MEMBERS')
  }

  /**
   * @param {import('../../src/SlashCommands/Message')} message
   */
  async Run (message) {
    const target = await (await message.getMember()).members.fetch(message._arguments[0].value)

    target.ban({ days: this.GetArgument('duration', message._arguments) ? this.GetArgument('duration', message._arguments).value : 0, reason: this.GetArgument('reason', message._arguments) ? this.GetArgument('reason', message._arguments).value : '' })

    message.Acknowledge()
  }
}

module.exports = PingCommand
