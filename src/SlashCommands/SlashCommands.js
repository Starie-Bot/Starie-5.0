const request = require("request");
const express = require("express");
const nacl = require('tweetnacl');
const app = express();
const port = 4949;

const PUBLIC_KEY = "db6ede77774ff4ae6f6c21a8469ebdcddf40bbfa59259f1a08a9f32276b3894e";

class SlashCommands
{
    constructor(client)
    {
        console.log("Loading and generating global command lists");
        this.AddGlobalCommand("Test", "Test");
        
        app.get("/api/interactions", (req, res) => {
            const signature = req.get('X-Signature-Ed25519');
            const timestamp = req.get('X-Signature-Timestamp');

            let isVerified = nacl.sign.detached.verify(
                Buffer.from(timestamp+req.body),
                Buffer.from(signature, 'hex'),
                Buffer.from(PUBLIC_KEY, 'hex')
            );

            if (!isVerified)
              res.status(401).end('invalid request signature')
        });

        app.listen(port);
    }

    AddGlobalCommand(name, description)
    {
        request.post({url: `https://discord.com/api/v8/applications/279451341909262337/guilds/606926504424767488/commands`, headers: {"Content-Type": "application/json","Authorization": "Bot Mjc5NDUxMzQxOTA5MjYyMzM3.WJ0xVw.Y8ep0-LhdFCBfug8gwhmH6xrUUU"}, json: {
            name,
            description
        }}, (err, response, body) => {
            console.log(body);
        });
    }
}

module.exports = SlashCommands;