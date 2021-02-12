const Package = require("./Package");

const {
    MessageEmbed,
    Collection
} = require("discord.js");

const Validator = require("./ArgValidator");
const CommandError = require("./CommandError");
var clientl;
var commands = new Collection();

const ArgValidator = new Validator();

var owners;

class CommandSystem {
    constructor(client) {
        clientl = client;
    }

    PreLoad() {
        if (!require('fs').existsSync("commands"))
            require('fs').mkdirSync("commands");
    }

    Load(owner) {
        owners = owner;
        require('require-all')({
            dirname: require('fs').realpathSync("commands"),
            filter: ".js",
            recursive: true,
            resolve: (command) => {
                try {
                    this.LoadCommands([new command(this, clientl)]);
                } catch (e) {
                    console.log(e);
                }
            }
        });

        clientl.on("message", async (msg) => {
            // Change any mention of the bot to a prefix.
            msg.content = msg.content.replace(/<@(!|)279451341909262337>( |)/, "/");

            if (msg.author.bot || (msg.guild && msg.guild.id == "538361750651797504")) // Don't respond to bots.
                return;

            /**
             * Get the command requested from the command message.
             */
            let cmd = commands.get(msg.content.slice(1).split(" ")[0].trim());

            if (!cmd) 
                return;

            let executed = ((cmd.CheckPermission(msg) || owners.includes(msg.author))),
                failure_reasons = [];

            /**
             * Provide a reason for the failed execution.
             */
            if ((!executed&&!cmd.silentFail)) {

                if (!cmd.enabled)
                    failure_reasons.push("This command is not enabled.");

                if (failure_reasons.length > 1)
                    failure_reasons.map((reason) => {
                        if (failure_reasons.indexOf(reason) == 0)
                            return reason = `${reason}.`;
                        else 
                            return reason = reason.toLowerCase();
                    });

                msg.channel.send(new MessageEmbed()
                    .setTitle("Command Cannot be Executed")
                    .setColor("#FF0000")
                    .setDescription(failure_reasons.join(", additionally "))
                    .addField("Full Command", msg.content, true)
                    .setTimestamp(new Date()));
            }

            if (!executed)
                return;

            let regex = /[^\s"]+|"([^"]*)"/gi,
                string = msg.content.split(" ").slice(1).join(" ").trim(),
                args = {},
                argsArray = [];

            let i = 0;

            /**
             * Argument validation.
             */
            do {
                var match = regex.exec(string);
                var hintMessage = `/${msg.content.slice(1).split(" ")[0].trim()} ${argsArray.join(" ")}`;

                if (match != null) {
                    if (cmd.args[i] == undefined) {
                        msg.channel.send({embed: new CommandError(`Too many values were provided to the command!`, cmd.args.length).embed});
                        return;
                    }

                    if (cmd.args[i].restraints && !cmd.args[i].restraints.filter((t) => t.includes(match[0] || match[1])).includes(match[0] || match[1])) {
                        hintMessage+=` <${match[1] ? match[1] : match[0]}> `;
                        msg.channel.send({embed: new CommandError(`An unexpected value was provided in section ${i+1}!`, cmd.args[i].restraints.join("\n"), hintMessage).embed,});
                        return;
                    }

                    var type;

                    if (Array.isArray(cmd.args[i].type)) {
                        type = cmd.args[i].type[cmd.args[i-1].restraints.indexOf(args[cmd.args[i-1].name])];
                        console.log(type);
                    }

                    argsArray.push(match[1] ? ArgValidator.Validate(match[1], type||cmd.args[i].type, msg) : ArgValidator.Validate(match[0], type||cmd.args[i].type, msg));
                    args[cmd.args[i].name] = argsArray[i];

                    if (argsArray[i] == null || argsArray[i] == undefined) {
                        if (cmd.args[i] == undefined)
                            return;
                            
                        if ((!cmd.args[i].optional) || (typeof(cmd.args[i].optional) == "string" && args[cmd.args[i].optional])) {
                            hintMessage+=` <${match[1] ? match[1] : match[0]}> `;
                            msg.channel.send({embed: new CommandError(`Invalid value provided for section ${i+1}!`, ArgValidator.Get(type||cmd.args[i].type).description, hintMessage).embed});
                            return;
                        }
                    }
                } else {
                    if (cmd.args[i] != undefined) {
                        if (!cmd.args[i].optional) {
                            hintMessage+=" <expected> ";
                            msg.channel.send({embed: new CommandError(`Invalid value provided for section ${i+1}!`, ArgValidator.Get(cmd.args[i].type).description, hintMessage).embed});
                            return;
                        }
                    }
                }
                i++;
            } while (match != null);

            args["array"] = argsArray;

            try {
                cmd.Run(msg, args);
            } catch (e) {
                console.error(e);
            }
        });
    }

    /**
     * Load an array of commands.
     * @param {Command[]} commands 
     */
    LoadCommands(comms) {
        comms.forEach((command) => {
            commands.set(command.memberName.toLowerCase(), command);

            /**
             * Set the aliases defined in the command file.
             */
            command.aliases.forEach((alias) => {
                commands.set(alias.toLowerCase(), command);
            });

            console.log(`Command Loaded and Enabled: ${command.memberName}`);
        });
    }

    /**
     * Returns all of the commands.
     * @type {Collection[]}
     */
    GetCommands() {
        return commands;
    }

    /**
     * Get the command handler's Discord client.
     */
    GetClient()
    {
        return clientl;
    }

    /**
     * Get the EXP of a user.
     */
    async GetUserData(member)
    {
        let user = member;
        let guild = member.guild;
        
        if (!user.data) {
            user.data = {exp: 0, money: 0};
            global.MySQL.GetSession()
            .then((session) => {
                return session
                    .getSchema("starie")
                    .getTable("user_data")
                    .insert(["user_id", "guild_id"])
                    .values([user.id, guild.id])
                    .execute();
            })

            return user.data;
        }

        let data = (await (await global.MySQL.GetSession()).getSchema("starie").getTable("user_data").select(["user_id", "guild_id", "exp"]).where(`\`user_id\` = '${user.id}' && \`guild_id\` = '${guild.id}'`).execute()).fetchAll()[0];
        global.MySQL.GetSession().then((session) => {session.close()});

        return data;
    }

    /**
     * Get all owners.
     */
    GetOwners() {
        return owners;
    }
}

module.exports = CommandSystem;