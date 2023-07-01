/*
Connecting the main modules for working with the command,
embed messages, requests and the file system
*/
const {
  ApplicationCommandType,
  ApplicationCommandOptionType,
  AttachmentBuilder,
  EmbedBuilder,
} = require("discord.js");
const fetch = require("node-fetch");
const fs = require("fs");
const { readdirSync, writeFile } = require("fs");

// command body
module.exports = {
  name: "check",
  description: "description",
  type: ApplicationCommandType.ChatInput,

  options: [
    {
      name: "status",
      description: "check status code of the url",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "url",
          description: "type the url here",
          type: ApplicationCommandOptionType.String,
          minLength: 12,
          maxLength: 2048,
          required: true,
        },
      ],
    },
  ],

  execute: async (client, interaction) => {
    try {
      /*=================FUNCTIONS=================*/

      function checkCacheForTheCat(statusCode) {
        const catImage = readdirSync("./cache/").filter(
          (f) => f === `${statusCode}.jpg`
        );

        if (catImage.length) {
          sendTheCat(statusCode);
        } else {
          getTheCat(statusCode);
        }
      }

      async function getTheCat(statusCode) {
        const response = await fetch(`https://http.cat/${statusCode}`);

        if (response.status === 200) {
          const buffer = await response.buffer();
          const filePath = `./cache/${statusCode}.jpg`;

          writeFile(filePath, buffer, (err) => {
            if (err) throw err;
          });

          // Deleting the image from the cache
          setTimeout(() => {
            fs.unlink(filePath, (err) => {
              // Error trying to delete the file
              if (err) throw err;
            });
          }, 5 * 60 * 1000); // 5 minutes cooldown

          // callback
          return checkCacheForTheCat(statusCode);
        } else {
          // API error of https://http.cat/
          await interaction
            .reply({
              content: "## Something went wrong, no picture provided 🐱‍👤",
              ephemeral: true,
            })
            .catch(console.error);

          throw new Error(`HTTP status code: ${response.status}`);
        }
      }

      async function sendTheCat(statusCode) {
        /*
        Uploading the image to the builder to be presented as a link,
        because setImage() method only accepts links
        */
        let catImage = new AttachmentBuilder(`./cache/${statusCode}.jpg`);

        return await interaction
          .reply({
            embeds: [
              new EmbedBuilder()
                .setColor("#2B2D31")
                .setTitle("Click to open the link 🐱‍👤")
                .setDescription("**Received HTTP code:**")
                .setURL(url)
                .setImage(`attachment://${statusCode}.jpg`),
            ],
            files: [catImage],
            ephemeral: true,
          })
          .catch(console.error);
      }

      /*=================COMMAND=================*/

      // parsing url from the command
      let url = interaction.options._hoistedOptions.find(
        (arg) => arg.name == "url"
      ).value;

      // [protocol http or https]://[sub domain and domain 2-256 symbols].[TLD 2-6 symbols]/[path]?[parameters]
      let regex =
        /^(http(s|):\/\/)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/;

      if (!regex.test(url)) {
        return await interaction
          .reply({
            content:
              "## Invalid URL, valid format examples:\n" +
              "* <https://www.google.com/> (200)\n" +
              "* <https://google.com/imghp> (200)\n" +
              "* <http://www.columbia.edu/~fdc/sample.html> (200)\n" +
              "* <https://auttaja.io/> (403)\n" +
              "* <https://github.com/naueramant/node-clipboard> (404)\n",
            ephemeral: true,
          })
          .catch(console.error);
      }

      await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      })
        .then((response) => {
          checkCacheForTheCat(response.status);
        })
        .catch(async (err) => {
          console.log(err);

          return await interaction
            .reply({
              content: "## Invalid link, site can't be reached 🐱‍👤",
              ephemeral: true,
            })
            .catch(console.error);
        });
    } catch (err) {
      console.log(err);
    }
  },
};
