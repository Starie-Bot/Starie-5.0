const Command = require('../../src/CommandSystem/Command')
const permittedRoles = ['683171264315129876', '742134494471127122', '742178276558241822']

class PingCommand extends Command {
  constructor (client) {
    super({
      memberName: 'opt',
      description: 'Opt in or out to certain roles.',
      args: [{ name: 'in', description: 'Opt into specified roles.', type: 1, options: [{ name: 'role', description: 'Role to opt-into.', type: 8, required: true }] }, { name: 'out', description: 'Opt out of specified roles', type: 1, options: [{ name: 'role', description: 'Role to opt-out of.', type: 8, required: true }] }]
    }, client)
  }

  async Run (message) {
    const member = await message.getMember()
    const role = await (await message.getGuild()).roles.fetch(message._arguments[0].value)

    console.log(role)
    console.log(message._arguments)

    if (!permittedRoles.includes(role.id)) { return message.Reply({ content: 'Invalid role provided to opt to.', flags: 64 }) }

    switch (message._arguments[0].name) {
      case 'in':
        member.roles.add(role)
        break

      case 'out':
        member.roles.remove(role)
        break
    }

    message.Reply({
      content: `You successfully opted ${message._arguments[0].name} to ${role.name}`,
      flags: 64
    })
  }
}

module.exports = PingCommand
