const Validator = require("../Validator");

class StringValidator extends Validator {
    constructor(arg)
    {
        super({
            name: "number",
            description: "Any Numerical (Not Including Decimals)"
        });
        
    }

    Validate(arg, msg)
    {
        if (/\D/g.test(arg))
            return null;

        return parseInt(arg);
    }
}

module.exports = StringValidator;