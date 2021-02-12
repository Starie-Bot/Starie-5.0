const Validator = require("../Validator");

class StringValidator extends Validator {
    constructor(arg)
    {
        super({
            name: "package",
            description: "Package Name"
        });
        
    }

    Validate(value, msg)
    {
        if(!msg.guild) return null;
        const search = value.toLowerCase();
        const members = global.CommandSystem.GetPackages().filterArray(this.memberFilterInexact(search));
        if(members.length === 0) return null;
        if(members.length === 1) return members[0];
        const exactMembers = members.filter(this.memberFilterExact(search));
        if(exactMembers.length === 1) return members[0];
        return null;
    }

    memberFilterExact(search) {
        return mem => mem.name.toLowerCase() === search.toLowerCase();
    }
    
    memberFilterInexact(search) {
        return mem => mem.name.toLowerCase().includes(search.toLowerCase());
    }
}

module.exports = StringValidator;