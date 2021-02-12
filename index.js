const {Client} = require("discord.js"),
      config = require("./config/config.json");
const client = new Client();
var SlashCommands;

const CONSOLE_SEPARATOR = "-".repeat(30);
const OWNERS = [];

client.on("ready", async _ => {
    console.log("Initalizing primary systems\n");

    /**
     * Load functions
     */

    for (let ownerID of config["OWNERS"]) {
        let owner = await client.users.fetch(ownerID);

        if (!owner) {
            console.log(`Could not properly instanstiate an owner; ID: ${ownerID}`);
            continue;
        }

        OWNERS.push(owner);
        console.log(`Loaded owner-user: ${owner.tag} (${owner.id})`);
    }

    // Initalize the command systems.
    console.log(CONSOLE_SEPARATOR);
    SlashCommands = new (require("./src/SlashCommands/SlashCommands"))(client);
    console.log(CONSOLE_SEPARATOR);

    console.log(CONSOLE_SEPARATOR);

    console.log(`Permission Override User(s): ${OWNERS.map(u => u.tag).join(", ")}\n`);

    console.log(`Overall Guild Count: ${client.guilds.cache.size}`);
    console.log(`Overall User Count: ${client.users.cache.size}`)

    console.log(CONSOLE_SEPARATOR);
});

client.login(config["TOKEN"]);