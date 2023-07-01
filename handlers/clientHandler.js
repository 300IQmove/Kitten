const { Collection } = require("discord.js");

module.exports = (client) => {
  client.slashCommands = new Collection();
  client.events = new Collection();
};
