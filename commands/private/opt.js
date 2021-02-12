const Command = require("../../src/CommandSystem/Command");
const {
    InteractionResponseType
} = require('discord-interactions')

const permittedRoles = ["683171264315129876", "742134494471127122","742178276558241822"];

class PingCommand extends Command 
{
    constructor(client)
    {
        super({
            memberName: "opt",
            description: "Opt in or out to certain roles.",
            args:[{name: "in", description: "Opt into specified roles.", type: 1, options: [{name: "role", description: "Role to opt-into.", type:8, required: true}]}, {name: "out", description:"Opt out of specified roles", type:1, options: [{name: "role", description: "Role to opt-out of.", type:8, required: true}]}]
        }, client);
    }

    async Run(client, message, res)
    {
        let member = await (await client.guilds.fetch(message.guild_id)).members.fetch(message.member.user.id);
        let role = await (await client.guilds.fetch(message.guild_id)).roles.fetch(message.data.options[0].options[0].value);

        if (!permittedRoles.includes(role.id))
            return res.send({type: InteractionResponseType.ACKNOWLEDGE});

        switch (message.data.options[0].name) {
            case "in":
                    member.roles.add(role);
                break;

            case "out": 
                    member.roles.remove(role);
                break;
        }

        return res.send({
            type: InteractionResponseType.ACKNOWLEDGE,
        });
    }
}

module.exports = PingCommand;

