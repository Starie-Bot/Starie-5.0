class Package {
    constructor(data)
    {
        /**
         * The name of the command package.
         */
        this.name = data.name;

        /**
         * The description of the command package.
         */
        this.description = data.description;

        /**
         * The options available to edit.
         */
        this.configOptions = data.configOptions;

        /**
         * Whether or not this is a premium feature.
         */
        this.premium = false;
    }
}

module.exports = Package;