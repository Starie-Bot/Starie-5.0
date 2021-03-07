const Command = require('../../src/CommandSystem/Command')
const {
  InteractionResponseType
} = require('discord-interactions')

class PingCommand extends Command {
  constructor (client) {
    super({
      memberName: 'ping',
      description: 'Check the connection between your shard and Discord.'
    }, client)
  }

  Run (client, message, res) {
    res.send({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: `Pong! **${client.ws.ping}**ms!`
      }
    })
  }
}

module.exports = PingCommand
