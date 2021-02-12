class Command 
{
    constructor(data, client, handler)
    {
        if (!data || !client || !handler)
            return;

        /**
         * The authorative client object.  
         */
        this.client = client;

        /**
         * The command handler.
         */
        this.handler = handler;
        
        /**
         * The command's description
         */
        this.description = data.description || "No description";

        /**
         * The command's name, defaults to the member name;
         */
        this.name = data.name || data.memberName;

        /**
         * The command aliases.
         */
        this.aliases = data.aliases || [];

        /**
         * The command's invoker name.
         */
        this.memberName = data.memberName || console.error("Member-Name must be defined on a command.");
    
        /**
         * The enforced permission level required to execute the command.
         */
        this.permission = data.permission || 0;

        /**
         * Whether or not the command is enabled and usable.
         */
        this.enabled = data.enabled || true;
    
        /**
         * The assigned category table.
         */
        this.category = data.category || "General";

        /**
         * The arguments.
         */
        this.args = data.args || [];

        /**
         * The package this command is part of.
         */
        this.package = data.package||null;

        /**
         * Whether or not the command silently fails.
         */
        this.silentFail = data.silentFail || false;
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