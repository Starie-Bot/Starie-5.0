/**
 * Represents a command group.
 */
class CommandGroup extends Map {
    constructor(data)
    {
        super(); // Load the old stuff.
        
        if (!data) // Fail if there's no data.
            throw "Cannot load Command Group without a name.";

        /**
         * The command group's name.
         * @type {string}
         * @readonly
         */
        this.name = data.name;

        /**
         * The command group's short name.
         * @type {string}
         * @readonly
         */
        this.shortName = data.shortName;
    }
}

module.exports = CommandGroup;