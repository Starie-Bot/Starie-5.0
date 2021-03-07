const Command = require('../../src/CommandSystem/Command')

class PingCommand extends Command {
  constructor (client) {
    super({
      memberName: 'ping',
      description: 'Check the connection between your shard and Discord.'
    }, client)
  }

  Run (message) {
    message.Reply({
      content: `Pong! **${message.client.ws.ping}**ms!`,
      flags: 64
    })
  }
}

module.exports = PingCommand
