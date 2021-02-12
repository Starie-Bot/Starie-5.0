const Validator = require("../Validator");

class StringValidator extends Validator {
    constructor(arg)
    {
        super({
            name: "string",
            description: 'Single-Worded Text, Multi-Worded Message surrounded in quotes'
        });
        
    }

    Validate(arg, msg)
    {
        return arg.toString();
    }
}

module.exports = StringValidator;