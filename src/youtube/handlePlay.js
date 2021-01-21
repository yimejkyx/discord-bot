const { playUrl } = require("./playUrl");
const { logger } = require("../logger");
const config = require("../../config.json");
const { cmdPrefix } = config;

async function handlePlay(client, msg, youtubeState) {
  const { content, member: { voice } } = msg;

  if (!content.startsWith(`${cmdPrefix}play`)) return;

  if (!voice.channel) {
    const reply = await msg.reply("You need to join a voice channel first!");
    setTimeout(() => {
      reply.delete();
      msg.delete();
    }, 5000);
    return;
  }

  if (youtubeState.connection) {
    const reply = await msg.reply("Cant play another video!");
    setTimeout(() => {
      reply.delete();
      msg.delete();
    }, 5000);
    return;
  }

  const split = content.replace(/\s\s+/g, " ").split(" ");
  if (split.length >= 2) {
    const [, url] = split;
    if (url) {
      logger.info(`playing "${url}"`);
      await playUrl(msg, url, voice, youtubeState);
    } else {
      logger.error(`invalid url "${url}"`);
    }
  }
}

module.exports = {
  handlePlay,
};
