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
            memberName: "ban",
            description: "Remove a user from the server, and prevent them from rejoining.",
            args:[{name: "user", description: "The user to ban from the server.", type: 6, required: true}, {name: "duration", description:"The duration as to which the ban lasts", type:4, required: false}, {name: "reason", description: "Reason of user-ban, used for audit logs and sent to user.", type: 3, required: false}]
        }, client);
    }

    async Run(client, message, res)
    {
        let member = await (await client.guilds.fetch(message.guild_id)).members.fetch(message.member.user.id);
        let target = await (await client.guilds.fetch(message.guild_id)).members.fetch(message.data.options[0].value);

        if (!member.hasPermission("BAN_MEMBERS"))
          return res.send({
            type: InteractionResponseType.ACKNOWLEDGE,
          });

        target.ban({days: this.GetArgument("duration", message.data.options)?this.GetArgument("duration", message.data.options).value:0, reason: this.GetArgument("reason", message.data.options)? this.GetArgument("reason", message.data.options).value:""});

        res.send({
          type: InteractionResponseType.ACKNOWLEDGE_WITH_SOURCE
        })
    }
}

module.exports = PingCommand;

