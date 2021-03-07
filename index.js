const { Client } = require('discord.js')
const Logger = new (require('./src/Logging/Logger'))()
const config = require('./config/config.json')
const client = new Client()

new (require('./src/SlashCommands/SlashCommands'))(client, config)

const OWNERS = []

client.on('ready', async _ => {
  for (const ownerID of config.OWNERS) { // Loop through the owners present in the config file.
    const owner = await client.users.fetch(ownerID) // Fetch the user-object using the ID.

    // If it fails to get an object, just ignore it completely.
    if (!owner) {
      Logger.Error(`Could not load an owner with the ID of [${ownerID}]`)
      continue
    }

    OWNERS.push(owner) // Push the newly found object into an array.
  }
})

client.login(config.TOKEN) // Log-in to Discord
