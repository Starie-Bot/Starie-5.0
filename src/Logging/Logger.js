const LogTypes = require("./LogTypes");

class Logger {
    constructor() {
        this.enabledTypes = process.argv[2].split(",");
    }

    /**
     * Print a message into the console.
     * @param {String} message 
     * @param {LogTypes} type 
     */
    Print(message, type=LogTypes.NETCALL) {
        if (this.enabledTypes.includes(type))
            return console.log(`[${new Date().getHours()}:${new Date().getMinutes()}] [${type}] ${message}`);
    }
}

module.exports = Logger;