///
/// SETUP PROCESS; CREATE COMMAND FOLDERS, COPY DEFAULT CONFIG
///

const fs = require('fs'); const readline = require('readline')
fs.copyFileSync('./config/config.default.json', './config/config.json')
const config = require('./config/config.json') // Load for the purpose of prompting to fill.

///
/// SETUP PART 2; PROMPT USERS TO INPUT INFORMATION
///
const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
rl.question('What is the token of the Discord Bot you wish to use?\n', token => {
  config.TOKEN = token

  rl.question('What is the public key of the Discord Bot you wish to use?\n', public_key => {
    config.PUBLIC_KEY = public_key

    rl.question('What port would you like internal validation server to run on? (Default: 4949)\n', port => {
      config.SERVER_PORT = port

      console.log('Configuration Complete')
      console.log('Writing File')

      fs.writeFileSync('./config/config.json', JSON.stringify(config, null, 1))

      console.log('Setup Complete')
      process.exit()
    })
  })
})
