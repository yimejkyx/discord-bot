const { logger } = require("./logger");

async function stopVoiceConnection(voiceState) {
    try {
        if (voiceState.connection) {
            await voiceState.connection.channel.leave();
            voiceState.connection.disconnect();
            voiceState.connection = null;
        }

        logger.info("video cleaning done");
    } catch (e) {
        logger.debug('stop error debug', e);
    }
}

module.exports = {
    stopVoiceConnection
};
