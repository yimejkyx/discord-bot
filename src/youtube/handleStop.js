const { stop } = require('./stop');
const { logger } = require("../logger");
const config = require("../../config.json");
const { cmdPrefix } = config;

async function handleStop(client, msg, youtubeState) {
    const { content, member: { voice } } = msg;
    if (content !== `${cmdPrefix}stop`) return;
  
    const reply = await msg.reply("stoping actual video");
    logger.info("stop video executed");
  
    setTimeout(() => {
      reply.delete();
      msg.delete();
    }, 5000);
  
    if (youtubeState.stoppingTimeout) {
      clearTimeout(youtubeState.stoppingTimeout);
      youtubeState.stoppingTimeout = null;
    }
    await stop(youtubeState, voice);
  }

module.exports = {
  handleStop,
};