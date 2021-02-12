const fs = require("fs");
const {Collection} = require("discord.js");
const validators = new Collection();

class ArgValidator {
    constructor()
    {
        fs.readdirSync(__dirname + "/types").forEach((type) => {
            type = new (require(`${__dirname}/types/${type}`));
            console.log(`Argument Type Registrar: <${type.name}>`);
            validators.set(type.name, type);
        });
    }

    Get(type)
    {
        return validators.get(type);
    }

    Validate(arg, argtype, msg)
    {
        console.log("Pushed type:" + argtype);
        return validators.get(argtype).Validate(arg, msg);
    }
}

module.exports = ArgValidator;