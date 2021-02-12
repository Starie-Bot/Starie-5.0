const request = require("request");
const express = require("express");
const nacl = require('tweetnacl');
const {
    verifyKeyMiddleware,
    InteractionResponseType
} = require('discord-interactions')
const app = express();
const port = 4949;

const PUBLIC_KEY = "db6ede77774ff4ae6f6c21a8469ebdcddf40bbfa59259f1a08a9f32276b3894e";
const commands = new Map();
var cli;

class SlashCommands {
    constructor(client) {
        cli = client;

        require("require-all")({
            dirname: "/var/bots/commands",
            resolve: (command) => {
                let loaded = new command(cli);
                console.log(loaded.memberName);
                commands.set(loaded.memberName, loaded);
            }
        });

        console.log("Loading and generating global command lists");

        commands.forEach((command) => {
            this.AddGuildCommand(command.memberName, command.description, command.args)
        });

        app.post("/api/interactions", verifyKeyMiddleware(PUBLIC_KEY), async (req, res) => {
            const message = req.body;
            if (message.type === 2) {
                let command = commands.get(message.data.name);

                if (!command)
                    return;

                command.Run(cli, message, res);
            }
        });

        app.listen(port);
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

    ClearGlobals() {
      request.get({
        url: `https://discord.com/api/v8/applications/279451341909262337/commands`,
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bot Mjc5NDUxMzQxOTA5MjYyMzM3.WJ0xVw.Y8ep0-LhdFCBfug8gwhmH6xrUUU"
        }
    }, (err, response, body) => {
        for (let command of JSON.parse(body)) {
          request.delete({
            url: `https://discord.com/api/v8/applications/279451341909262337/commands/${command.id}`,
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bot Mjc5NDUxMzQxOTA5MjYyMzM3.WJ0xVw.Y8ep0-LhdFCBfug8gwhmH6xrUUU"
            }
        }, (err, response, body) => {
          console.log(body);
        });
        }
    });
    }

    ClearGuilds() {
      request.get({
        url: `https://discord.com/api/v8/applications/279451341909262337/guilds/606926504424767488/commands`,
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bot Mjc5NDUxMzQxOTA5MjYyMzM3.WJ0xVw.Y8ep0-LhdFCBfug8gwhmH6xrUUU"
        }
    }, (err, response, body) => {
        for (let command of JSON.parse(body)) {
          request.delete({
            url: `https://discord.com/api/v8/applications/279451341909262337/guilds/606926504424767488/commands/${command.id}`,
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bot Mjc5NDUxMzQxOTA5MjYyMzM3.WJ0xVw.Y8ep0-LhdFCBfug8gwhmH6xrUUU"
            }
        }, (err, response, body) => {
          console.log(body);
        });
        }
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