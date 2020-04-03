const { logger } = require("./logger");
const { MessageEmbed } = require("discord.js");
const Pornsearch = require("pornsearch");

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function handlePornRequest(client, msg) {
  const { content } = msg;

  if (content.startsWith("plsky")) {
    const split = content.replace(/\s\s+/g, " ").split(" ");
    if (split.length >= 2) {
      const [, ...parsed] = split;
      const query = parsed.join(" ");
      logger.info(`requested porn "${query}"`);

      try {
        const search = Pornsearch.search(query);
        const gifs = await search.gifs(getRandomInt(1, 5));

        const items = gifs.filter(({ url }) => !url.includes("undefined"));
        const { url } = items[Math.floor(Math.random() * items.length)];
        logger.info("got url", url);

        const embed = new MessageEmbed(url);
        embed.setImage(url);
        await msg.channel.send(`${query} ${url}`, {
          embed
        });
        logger.info("got sent to discord", url);
      } catch (e) {
        logger.error("got error in porn request", e);
      }

      setTimeout(() => {
        msg.delete();
      }, 5000);
    }
  }
}

module.exports = {
  handlePornRequest
};
