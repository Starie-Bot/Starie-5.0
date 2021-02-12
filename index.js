const {Client} = require("discord.js"),
      config = require("./config/config.json");
const client = new Client();
const SlashCommands = new (require("./src/SlashCommands/SlashCommands"))(client, config);

const CONSOLE_SEPARATOR = "-".repeat(30);
const OWNERS = [];

client.on("ready", async _ => {
    for (let ownerID of config["OWNERS"]) {
        let owner = await client.users.fetch(ownerID);

        if (!owner) {
            console.log(`Could not properly instanstiate an owner; ID: ${ownerID}`);
            continue;
        }

        OWNERS.push(owner);
        console.log(`Loaded owner-user: ${owner.tag} (${owner.id})`);
    }
});

client.login(config["TOKEN"]);