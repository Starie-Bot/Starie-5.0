const Validator = require("../Validator");

class StringValidator extends Validator {
    constructor(arg)
    {
        super({
            name: "usergroup",
            description: "User Group, User Group ID"
        });
        
    }

    Validate(value, msg)
    {
        const search = value.toLowerCase();
        const usergroup = global.CommandSystem.GetUserGroups().filterArray(this.roleFilterInexact(search));
        if(usergroup.length === 0) return null;
        if(usergroup.length === 1) return usergroup[0];
        const exactGroups = usergroup.filter(this.roleFilterExact(search));
        if(exactGroups.length === 1) return usergroup[0];
        return 0;
    }

    roleFilterExact(search) {
        return role => role.id === parseInt(search) || role.name.toLowerCase() === search;
    }
    
    roleFilterInexact(search) {
        return role => role.id === parseInt(search) || role.name.toLowerCase().includes(search);
    }
}

module.exports = StringValidator;