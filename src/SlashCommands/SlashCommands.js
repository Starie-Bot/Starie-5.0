const request = require("request");
const express = require("express");
const path = require("path");

const {ReadDirectory} = require("../Utilities/FileUtilities");
const {Difference} = require("../Utilities/ArrayUtilities");


const nacl = require('tweetnacl');
const {
    verifyKeyMiddleware,
    InteractionResponseType
} = require('discord-interactions')
const app = express();

const commands = new Map();

class SlashCommands {
    constructor(client, config) {
        ///
        /// Read from the configuration.
        ///
        this.client = client;
        this.PUBLIC_KEY = config.PUBLIC_KEY;
        this.SERVER_PORT = config.SERVER_PORT;

        // This is a maintained cache of every command present on the Discord servers
        this.REGISTERED_COMMANDS = {
            GLOBAL:null,
            LOCAL:null
        }

        this.FetchSubmittedCommands();

        // This is a cache containing only local files.
        this.COMMANDS = {
            GLOBAL: new Map(),
            LOCAL: new Map()
        } 

        /// Read from the global and local directory to determine local commands.
        ReadDirectory(path.join(__dirname, "../../commands/global"), resolved => {let command = new resolved(this.client);this.COMMANDS.GLOBAL.set(command.memberName, command)});
        ReadDirectory(path.join(__dirname, "../../commands/private"), resolved => {let command = new resolved(this.client);this.COMMANDS.LOCAL.set(command.memberName, command)});

        commands.forEach(command => this.AddGuildCommand(command.memberName, command.description, command.args));

        app.post("/api/interactions", verifyKeyMiddleware(config.PUBLIC_KEY), async (req, res) => {
            const message = req.body;
            
            switch (message.type) {
                case 2:
                    if (!(command = commands.get(message.data.name)))
                        return;
    
                    return command.Run(cli, message, res); 
            }
        });

        app.listen(this.SERVER_PORT);
    }

    async FetchSubmittedCommands() {
        this.REGISTERED_COMMANDS.GLOBAL = await this.GetGlobals();
        this.REGISTERED_COMMANDS.LOCAL = await this.GetGuild();

        this.RemoveUnused();
    }

    async RemoveUnused() {
        this.REGISTERED_COMMANDS.LOCAL.forEach(command => {
            if (!this.COMMANDS.LOCAL.has(command.name))
                this.RemoveLocalCommand(command.id);
        });
    }

    async RemoveLocalCommand(id) {
        console.log("Removing");
        return new Promise((resolve, reject) => {
            request.delete({
                url: `https://discord.com/api/v8/applications/279451341909262337/guilds/606926504424767488/commands/${id}`,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bot Mjc5NDUxMzQxOTA5MjYyMzM3.WJ0xVw.Y8ep0-LhdFCBfug8gwhmH6xrUUU"
                }
            }, (err, response, body) => {
            });
        });
    }
    
    async GetGlobals() {
        return new Promise((resolve, reject) => {
            request.get({
                url: `https://discord.com/api/v8/applications/279451341909262337/commands`,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bot Mjc5NDUxMzQxOTA5MjYyMzM3.WJ0xVw.Y8ep0-LhdFCBfug8gwhmH6xrUUU"
                }
            }, (err, response, body) => {
                resolve(JSON.parse(body));
            });
        });
    }

    async GetGuild() {
        return new Promise((resolve, reject) => {
            request.get({
                url: `https://discord.com/api/v8/applications/279451341909262337/guilds/606926504424767488/commands`,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bot Mjc5NDUxMzQxOTA5MjYyMzM3.WJ0xVw.Y8ep0-LhdFCBfug8gwhmH6xrUUU"
                }
            }, (err, response, body) => {
                resolve(JSON.parse(body));
            });
        });
    }

    AddGlobalCommand(name, description, options) {
        request.post({
            url: `https://discord.com/api/v8/applications/279451341909262337/commands`,
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bot Mjc5NDUxMzQxOTA5MjYyMzM3.WJ0xVw.Y8ep0-LhdFCBfug8gwhmH6xrUUU"
            },
            json: {
                name,
                description,
                options
            }
        }, (err, response, body) => {
            console.log(body);
        });
    }

    AddGuildCommand(name, description, options) {
        request.post({
            url: `https://discord.com/api/v8/applications/279451341909262337/guilds/606926504424767488/commands`,
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bot Mjc5NDUxMzQxOTA5MjYyMzM3.WJ0xVw.Y8ep0-LhdFCBfug8gwhmH6xrUUU"
            },
            json: {
                name,
                description,
                options
            }
        }, (err, response, body) => {
            console.log(body);
        });
    }
}

module.exports = SlashCommands;