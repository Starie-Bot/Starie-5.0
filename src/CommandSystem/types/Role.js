const Validator = require("../Validator");

class StringValidator extends Validator {
    constructor(arg)
    {
        super({
            name: "role",
            description: "Role, Role Mention, Role ID"
        });
        
    }

    Validate(value, msg)
    {
        const matches = value.match(/^(?:<@!?)?([0-9]+)>?$/);
        if(matches) return msg.guild.roles.get(matches[1]) || null;
        const search = value.toLowerCase();
        const roles = msg.guild.roles.filterArray(this.roleFilterInexact(search));
        if(roles.length === 0) return null;
        if(roles.length === 1) return roles[0];
        const exactRoles = roles.filter(this.roleFilterExact(search));
        if(exactRoles.length === 1) return roles;
        return null;
    }

    roleFilterExact(search) {
        return role => role.name.toLowerCase() === search || role.position == search;
    }
    
    roleFilterInexact(search) {
        return role => role.name.toLowerCase().includes(search) || role.position == search;
    }
}

module.exports = StringValidator;