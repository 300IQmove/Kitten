// Main parameters and modules of the bot
const { Client, GatewayIntentBits } = require("discord.js");
const { Guilds } = GatewayIntentBits;

const client = new Client({
  intents: [Guilds],
  partials: [],
});

// Loading the token into environment variables
require("dotenv").config();

// Connecting handlers
const { readdirSync } = require("fs");
const handlers = readdirSync("./handlers/").filter((f) => f.endsWith(".js"));
handlers.forEach((handler) => {
  require(`./handlers/${handler}`)(client);
});

// Bot authorization
client.login(process.env.TOKEN);
