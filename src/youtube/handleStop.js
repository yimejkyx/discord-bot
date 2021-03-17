const {logger} = require("../logger");
const config = require("../../config.json");
const {stopVoiceConnection} = require("./stopVoiceConnection");
const {timeoutDelMessages} = require("../timeoutDelMessages");
const {cmdPrefix} = config;

async function handleStop(client, msg, voiceState) {
    const {content} = msg;

    if (content !== `${cmdPrefix}stop`) return;
    if (voiceState.lock) {
        logger.debug('handleStop: lock stop');
        return;
    }
    voiceState.lock = true;

    const reply = await msg.reply("stoping actual video");
    logger.info("handleStop: stop video executed");
    timeoutDelMessages(5000, [reply, msg]);

    if (voiceState.stoppingTimeout) {
        logger.info("handleStop: clearing timeout in video");
        clearTimeout(voiceState.stoppingTimeout);
        voiceState.stoppingTimeout = null;
    }
    await stopVoiceConnection(voiceState);

    voiceState.lock = false;
}

module.exports = {
    handleStop,
};
