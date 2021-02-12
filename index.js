const {Client} = require("discord.js"),
      config = require("./config/config.json");
const client = new Client();

new (require("./src/SlashCommands/SlashCommands"))(client, config);

const OWNERS = [];

client.on("ready", async _ => {
    for (let ownerID of config["OWNERS"]) {
        let owner = await client.users.fetch(ownerID);

        if (!owner) {
            continue;
        }

        OWNERS.push(owner);
    }
});

client.login(config["TOKEN"]);