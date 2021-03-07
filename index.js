const { Client } = require('discord.js')
const config = require('./config/config.json')
const client = new Client();

new (require('./src/SlashCommands/SlashCommands'))(client, config)

const OWNERS = []

client.on('ready', async _ => {
  for (const ownerID of config.OWNERS) {
    const owner = await client.users.fetch(ownerID)

    if (!owner) {
      continue
    }

    OWNERS.push(owner)
  }
})

client.login(config.TOKEN)
