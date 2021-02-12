const Command = require("../src/CommandSystem/Command");
const {
    verifyKeyMiddleware,
    InteractionResponseType
} = require('discord-interactions')

class PingCommand extends Command 
{
    constructor(client)
    {
        super({
            memberName: "kick",
            description: "Remove a user from the server.",
            args:[{name: "user", description: "The user to kick from the server.", type: 6, required: true}, {name: "reason", description: "Reason of user-ban, used for audit logs and sent to user.", type: 3, required: false}]
        }, client);
    }

    async Run(client, message, res)
    {
        let member = await (await client.guilds.fetch(message.guild_id)).members.fetch(message.member.user.id);
        let target = await (await client.guilds.fetch(message.guild_id)).members.fetch(message.data.options[0].value);

        if (!member.hasPermission("KICK_MEMBERS"))
          return res.send({
            type: InteractionResponseType.ACKNOWLEDGE,
          });

        target.kick({reason: this.GetArgument("reason", message.data.options)? this.GetArgument("reason", message.data.options).value:""});

        res.send({
          type: InteractionResponseType.ACKNOWLEDGE_WITH_SOURCE
        })
    }
}

module.exports = PingCommand;

