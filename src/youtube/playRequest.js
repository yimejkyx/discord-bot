const {timeoutDelMessages} = require("../helpers/timeoutDelMessages");
const {stopVoiceConnection} = require('../helpers/stopVoiceConnection');
const {logger} = require("../helpers/logger");
const {prepareSong} = require('./prepareSong');


async function setupClearingVoiceConnection(msg, voiceState, songInfo) {
    let reply;
    if (songInfo.videoLength > 0) {
        const replyString = `playing '${songInfo.title}' for ${songInfo.videoLengthMs / 1000}s`;
        reply = await msg.reply(replyString);
        logger.debug(`afterPlayUrl: '${replyString}' videoLengthMs '${songInfo.videoLengthMs}'`);

        const clearingFunction = async () => {
            logger.debug(`afterPlayUrl: stopping voice after playing '${songInfo.title}' - music is end`);
            voiceState.stoppingTimeout = null;
            await stopVoiceConnection(voiceState);
        }
        voiceState.stoppingTimeout = setTimeout(clearingFunction, songInfo.videoLengthMs + 10000);
    } else {
        const replyString = `playing '${songInfo.title}' for unlimited`;
        reply = await msg.reply(replyString);
        logger.info(replyString);
    }

    return reply;
}

async function playRequest(msg, requestText, voice, voiceState) {
    voiceState.connection = await voice.channel.join();

    let reply;
    try {
        logger.info(`playRequest: preparing song '${requestText}`);
        const songInfo = await prepareSong(requestText);
        logger.info(`playRequest: got prepared song '${songInfo.title}'`);
        if (!songInfo) {
            reply = await msg.reply("Sry, cannot find video, nieco sa doondialo :(((((");
            await timeoutDelMessages(5000, [reply, msg]);
            return;
        }

        logger.info(`playRequest: playing song '${songInfo.title}'`);
        voiceState.connection.play(songInfo.song);
        reply = await setupClearingVoiceConnection(msg, voiceState, songInfo);
    } catch (err) {
        await stopVoiceConnection(voiceState);
        logger.error(`playRequest: got error in youtube play request, ${err}`);
        reply = await msg.reply("Sry, cannot play that video, nieco sa doondialo :(((((");
    }

    await timeoutDelMessages(5000, [reply, msg]);
}


module.exports = {
    playRequest,
};
