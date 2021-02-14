const request = require("request"),
      express = require("express"),
      path    = require("path");

const Command = require("../CommandSystem/Command")
      Log     = new (require("../Logging/Logger"))();

const {ReadDirectory} = require("../Utilities/FileUtilities");

/**
 * @typedef  {Object}  SlashCommandOptions
 * @property {Boolean} local                Whether or not the command affects the local or global cache.
 * @property {Command} command              The command affected by this operation.
 * @property {String}  id                   The referenced ID, can be separate from the command. 
 */
const { verifyKeyMiddleware } = require('discord-interactions');
const { NETRETURN, CMDCALL, CMDEXECUTE }  = require("../Logging/LogTypes");
const app = express(); 

class SlashCommands {
    constructor(client, config) {
        ///
        /// Read from the configuration.
        ///
        this.client       = client;
        this.config       = config;
        this.PUBLIC_KEY   = config.PUBLIC_KEY;
        this.SERVER_PORT  = config.SERVER_PORT;
        this.BASE_URL     = `https://discord.com/api/v8/applications/${config.BOT_ID}`;

        this.HEADER = {
            "Content-Type" :  "application/json",
            "Authorization": `Bot ${config.TOKEN}`
        };

        // This is a maintained cache of every command present on the Discord servers
        this.REGISTERED_COMMANDS = {
            GLOBAL: [],
            LOCAL : []
        }

        // This is a cache containing only local files.
        this.COMMANDS = {
            GLOBAL : new Map(),
            LOCAL  : new Map()
        }

        // End here if this is created for the purpose of unit-testing.
        if (config.UNIT_TESTS)
            return;

        this.FillRegisteredCommands();

        /// Read from the global and local directory to determine local commands.
        ReadDirectory(path.join(__dirname, "../../commands/global"), resolved => {let command = new resolved(this.client);this.COMMANDS.GLOBAL.set(command.name, command)});
        ReadDirectory(path.join(__dirname, "../../commands/private"), resolved => {let command = new resolved(this.client);this.COMMANDS.LOCAL.set(command.name, command)});

        this.COMMANDS.LOCAL.forEach(command => this.Add({command, local: true})); // Add all of the commands present in the local cache.
        this.COMMANDS.GLOBAL.forEach(command => this.Add({command, local: false})); // Add all of the commands present in the global cache.

        app.post("/api/interactions", verifyKeyMiddleware(config.PUBLIC_KEY), async (req, res) => {
            const message = req.body;

            Log.Print(JSON.stringify(message), CMDCALL);

            switch (message.type) {
                case 2:
                    let command;

                    if (!(command = this.COMMANDS.LOCAL.get(message.data.name)))
                        return;
    
                    Log.Print(JSON.stringify(command), CMDEXECUTE);
                    return command.Run(this.client, message, res); 
            }
        });

        app.listen(this.SERVER_PORT);
    }

    /**
     * Fill the list of registered commands and perform any dependant tasks.
     */
    async FillRegisteredCommands() {
        d
        this.REGISTERED_COMMANDS.GLOBAL = await this.GetAll({local:false});
        this.REGISTERED_COMMANDS.LOCAL  = await this.GetAll({local:true});

        if (!this.config.UNIT_TESTS)
            this.Purge();
    }

    /**
     * Purge the Discord cache of unused local and global commands.
     * @param {SlashCommandOptions} options
     */
    async Purge() {
        this.REGISTERED_COMMANDS.LOCAL.forEach(command => {
            if (!this.COMMANDS.LOCAL.has(command.name))
                this.Remove({id: command.id, local: true});
        });

        this.REGISTERED_COMMANDS.GLOBAL.forEach(command => {
            if (!this.COMMANDS.GLOBAL.has(command.name))
                this.Remove({id: command.id, local: false});
        });
    }

    /**
     * Remove a command from Discord's server cache.
     * @param {SlashCommandOptions} options 
     */
    async Remove(options) {
        Log.Print(`[Remove] ${JSON.stringify(options)}`)
        return new Promise((resolve, reject) => {
            request.delete({
                url      : `${this.BASE_URL}/${(options.local||true)==true?"guilds/606926504424767488/":""}commands/${options.id}`,
                "headers": this.HEADER
            }, (err, _, body) => {
                Log.Print(JSON.stringify(body), NETRETURN);

                if (err)
                    return reject(err);

                resolve(body);
            });
        });
    }

    /**
     * Get every single command present within Discord's server cache.
     * @param {SlashCommandOptions} options
     * @returns {Command[]} 
     */
    async GetAll(options) {
        Log.Print(`[Get All] ${JSON.stringify(options)}`)

        return new Promise((resolve, reject) => {
            request.get({
                url    :  `${this.BASE_URL}/${(options.local)==true?"guilds/606926504424767488/":""}commands`,
                headers:  this.HEADER,
            }, (err, _, body) => {
                Log.Print(JSON.stringify(body), NETRETURN);

                if (err)
                    return reject(err);

                return resolve(JSON.parse(body));
            });
        });
    }

    /**
     * Add a command to Discord server cache.
     * @param {SlashCommandOptions} options 
     * @returns {Command[]}
     */
    Add(options) {
        Log.Print(`[Add] ${JSON.stringify(options)}`)

        return new Promise((resolve, reject) => {
            request.post({
                url    : `${this.BASE_URL}/${(options.local)==true?"guilds/606926504424767488/":""}commands`,
                headers: this.HEADER,
                json   : options.command
            }, (err, _, body) => {
                Log.Print(body, NETRETURN);

                if (err)
                    return reject(err);

                return resolve(body);
            });
        });
    }
}

module.exports = SlashCommands;