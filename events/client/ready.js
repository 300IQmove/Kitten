const fs = require("fs");
const { readdirSync } = require("fs");

module.exports = (client) => {
  console.log(`${client.user.tag} ready`);

  client.user.setActivity("Catnip", { type: "PLAYING" });

  // Universal invite link for any applied token
  // Flags - bot, applications.commands
  /* 
  Permissions - none,
  because the only command is global and replies are ephemeral
  */
  console.log(
    "Invite link:\n" +
      "https://discord.com/api/oauth2/authorize?client_id=" +
      client.application.id +
      "&permissions=0&scope=bot%20applications.commands"
  );

  // Clear images cache on startup
  const cachedFiles = readdirSync("./cache/").filter((f) => f.endsWith(".jpg"));
  cachedFiles.forEach((file) => {
    fs.unlink(`./cache/${file}`, (err) => {
      // Error trying to delete files
      if (err) throw err;
    });
  });
};
