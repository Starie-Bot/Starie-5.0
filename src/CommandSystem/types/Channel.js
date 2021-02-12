const Validator = require("../Validator");

class StringValidator extends Validator {
    constructor(arg)
    {
        super({
            name: "channel",
            description: "Channel, Channel Mention, Channel ID"
        });
        
    }

    Validate(value, msg)
    {
        const matches = value.match(/^(?:<@!?)?([0-9]+)>?$/);
        if(matches) return msg.guild.channels.get(matches[1]) || null;
        const search = value.toLowerCase();
        const channels = msg.guild.channels.filterArray(this.channelFilterInexact(search));
        if(channels.length === 0) return null;
        if(channels.length === 1) return channels[0];
        const exactChannels = channels.filter(this.channelFilterExact(search));
        if(exactChannels.length === 1) return channels;
        return null;
    }

    channelFilterExact(search) {
        return channel => channel.name.toLowerCase() === search;
    }
    
    channelFilterInexact(search) {
        return channel => channel.name.toLowerCase().includes(search);
    }
}

module.exports = StringValidator;