const {stop} = require('./stop');
const {logger} = require("../logger");
const config = require("../../config.json");
const {timeoutDelMessages} = require("../timeoutDelMessages");
const {cmdPrefix} = config;

async function handleStop(client, msg, youtubeState) {
    const {content, member: {voice}} = msg;
    if (content !== `${cmdPrefix}stop`) return;

    const reply = await msg.reply("handleStop: stoping actual video");
    logger.info("handleStop: stop video executed");
    timeoutDelMessages(5000, [reply, msg]);

    if (youtubeState.stoppingTimeout) {
        logger.info("handleStop: clearing timeout in video");
        clearTimeout(youtubeState.stoppingTimeout);
        youtubeState.stoppingTimeout = null;
    }
    await stop(youtubeState, voice);
}

module.exports = {
    handleStop,
};
