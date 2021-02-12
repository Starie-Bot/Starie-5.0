const Command = require("../src/CommandSystem/Command");

class PingCommand extends Command 
{
    constructor(commandSystem, client)
    {
        super({
            memberName: "ping",
            description: "Check the connection between your shard and Discord."
        }, client, commandSystem);
    }

    Run(msg, args)
    {
        msg.reply(`Pong \`${this.client.ws.ping}ms\``);
    }
}

module.exports = PingCommand;