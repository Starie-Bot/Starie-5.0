const OptionType  = require("./OptionType");
/**
 * @typedef  {Object}     Option
 * @property {OptionType} type
 * @property {String}     name
 * @property {String}     description
 * @property {boolean}    required
 * @property {String[]}   choices
 * @property {Option[]}   options
 */
class Command 
{
    constructor(data, client)
    {
        if (!data || !client)
            return;

        /**
         * The command's name, defaults to the member name;
         * @type {String}
         */
        this.name = data.memberName;

        /**
         * The command's description
         * @type {String}
         */
        this.description = data.description || "No description";

        /**
         * The arguments.
         * @type {Option}
         */
        this.options = data.args || [];
    }

    /**
     * The function to be executed on command run.
     */
    Run(msg, args=null)
    {
        return console.error("Run not defined for command.");
    }

    /**
     * Check whether the user's permission is over the required permission.
     * @param {Message} message 
     * @returns {Boolean} 
     */
    CheckPermission(message)
    {
        return true;
    }

    GetArgument(argument, args)
    {
        for (let arg of args) {
            if (arg.name==argument)
                return arg;
        }

        return null;
    }

    /**
     * Get the required permission level and return it.
     * @returns {Number}
     */
    GetPermission()
    {
        return this.permission;
    }
}

module.exports = Command;