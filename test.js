const { Client } = require('discord.js')
const client = new Client()

const Slash = new (require('./src/SlashCommands/SlashCommands'))(client, { PUBLIC_KEY: '35cc880b9e14dcf36ca9579d65e7664273d4f5cfb74e19ed5dd432f7e3881428', UNIT_TESTS: true })

client.on('ready', async _ => {
  try {
    await Slash.FillRegisteredCommands()
    const command = await Slash.Add({ command: { name: 'test', description: 'test' }, local: true })
    Slash.Remove({ id: command.id, local: true })
    process.exit(0)
  } catch (e) {
    throw e
  }
})

client.login('ODEwNDEyNTczNDIxMzM4NjQ0.YCjRhg.SaYTrQVluAGeO5dyNzynFlvgCRI')
