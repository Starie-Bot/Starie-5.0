class Validator {
    constructor(data)
    {
        /**
         * The identifier for the validator.
         * @type {String}
         */
        this.name = data.name;

        /**
         * The displayed descriptor for this validator.
         * @type {String}
         */
        this.description = data.description||data.name;
    }

    /**
     * Validate the string into an object.
     * @param {String} arg 
     */
    Validate(arg)
    {
    }
}

module.exports = Validator;