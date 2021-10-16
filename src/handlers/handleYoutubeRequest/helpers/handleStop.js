const { logger } = require("../../../helpers/logger");
const config = require("../../../../config.json");

const { timeoutDelMessages } = require("../../../helpers/timeoutDelMessages");
const { VoiceManager } = require("../../../VoiceManager");
const { cmdPrefix } = config;

async function handleStop(client, msg) {
    const { content } = msg;

    if (content !== `${cmdPrefix}stop`) return;

    if (!VoiceManager.lock()) {
        logger.debug('handleStop: lock stop');
        return;
    }

    const reply = await msg.reply("stoping actual video");
    logger.info("handleStop: stop video executed");
    timeoutDelMessages(5000, [reply, msg]);
    await VoiceManager.leave();

    VoiceManager.unlock();
}

module.exports = {
    handleStop,
};
