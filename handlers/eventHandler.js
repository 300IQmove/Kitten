const { readdirSync } = require("fs");

// Connecting event modules sorted by folders
module.exports = (client) => {
  const eventDirs = readdirSync("./events/");

  eventDirs.forEach((eventDir) => {
    const eventsFiles = readdirSync(`./events/${eventDir}/`).filter((f) =>
      f.endsWith(".js")
    );
    eventsFiles.forEach((file) => {
      const event = require(`../events/${eventDir}/${file}`);
      const eventName = file.split(".")[0].trim();

      client.on(eventName, event.bind(null, client));
    });
  });
};
