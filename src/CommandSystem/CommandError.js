const {MessageEmbed} = require("discord.js");

class CommandError
{
    constructor(description, expected, hint)
    {
        this.embed = new MessageEmbed();
        this.embed.setTitle("Error");
        this.embed.setDescription(description);
        this.embed.addField("Expected", (Array.isArray(expected)==true ? expected.join("\n") : expected) + ", or closest partial");
        this.embed.addField("Error At", hint+"<----- Here"||"An error has occured while rendering this");
    }
}

module.exports = CommandError;