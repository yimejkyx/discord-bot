const { logger } = require("../logger");

async function stop(youtubeState, voice) {
    try {
        youtubeState.connection?.cleanup();
        youtubeState.connection = null;
        await voice.channel.leave();
        logger.info("video cleaning done");
    } catch (e) {
        logger.debug('stop error debug', e);
    }
}

module.exports = {
    stop
};
