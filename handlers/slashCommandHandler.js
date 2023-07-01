const fs = require("fs");

// Registration of slash commands (global ones)
module.exports = (client) => {
  // Creating an array of commands
  const globalCmdArr = [];

  const cmdFiles = fs
    .readdirSync("./interactions/slashCommands/global/")
    .filter((f) => f.endsWith(".js"));

  cmdFiles.forEach((file) => {
    const command = require(`../interactions/slashCommands/global/${file}`);

    if (command.name && command.execute) {
      client.slashCommands.set(command.name, command);
      globalCmdArr.push(command);
    }
  });

  client.on("ready", async () => {
    try {
      // Removing all global commands
      /* 
      In the absence of critical changes in the commands code,
      it is recommended to comment out due to API rate limit
      */
      await client.application.commands.set([]).catch(console.error);

      // Registering the array of commands in the client
      // Warning! API limit is 200 command created per day
      globalCmdArr.forEach(async (cmd) => {
        await client.application.commands.create(cmd).catch(console.error);
      });
    } catch (err) {
      console.log(err);
    }
  });
};
