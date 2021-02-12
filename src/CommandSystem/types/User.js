const Validator = require("../Validator");

class StringValidator extends Validator {
    constructor(arg)
    {
        super({
            name: "user",
            description: "Username, Nickname, Mention, User-Tag, User ID"
        });
        
    }

    Validate(value, msg)
    {
        const matches = value.match(/^(?:<@!?)?([0-9]+)>?$/);
        if(matches) return msg.client.users.get(matches[1]) || null;
        if(!msg.guild) return null;
        const search = value.toLowerCase();
        const members = msg.guild.members.filterArray(this.memberFilterInexact(search));
        if(members.length === 0) return null;
        if(members.length === 1) return members[0].user;
        const exactMembers = members.filter(this.memberFilterExact(search));
        if(exactMembers.length === 1) return members[0].user;
        return null;
    }

    memberFilterExact(search) {
        return mem => mem.user.username.toLowerCase() === search ||
            (mem.nickname && mem.nickname.toLowerCase() === search) ||
            `${mem.user.username.toLowerCase()}#${mem.user.discriminator}` === search;
    }
    
    memberFilterInexact(search) {
        return mem => mem.user.username.toLowerCase().includes(search) ||
            (mem.nickname && mem.nickname.toLowerCase().includes(search)) ||
            `${mem.user.username.toLowerCase()}#${mem.user.discriminator}`.includes(search);
    }
}

module.exports = StringValidator;