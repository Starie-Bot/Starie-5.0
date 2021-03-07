const Command = require('../../src/CommandSystem/Command')

class PingCommand extends Command {
  constructor (client) {
    super({
      memberName: 'kick',
      description: 'Remove a user from the server.',
      args: [{ name: 'user', description: 'The user to kick from the server.', type: 6, required: true }, { name: 'reason', description: 'Reason of user-ban, used for audit logs and sent to user.', type: 3, required: false }]
    }, client)
  }

  async HasPermission (message) {
    return (await message.getMember()).hasPermission('KICK_MEMBERS')
  }

  async Run (message) {
    const target = await (await message.getMember()).members.fetch(message._arguments[0].value)

    target.kick({ reason: this.GetArgument('reason', message._arguments) ? this.GetArgument('reason', message._arguments).value : '' })

    message.Acknowledge()
  }
}

module.exports = PingCommand
