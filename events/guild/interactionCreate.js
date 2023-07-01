// Handling all incoming interactions
module.exports = async (client, interaction) => {
  try {
    // Handling slash commands
    if (interaction.isCommand()) {
      const command = client.slashCommands.get(interaction.commandName);

      // Checking if the command is outdated
      if (!command) {
        return await interaction
          .reply({
            content: "## Сommand is outdated, reload your Discord client 🐱‍👤",
            ephemeral: true,
          })
          .catch(console.error);
      }

      command.execute(client, interaction);
    }
  } catch (err) {
    console.log(err);
  }
};
