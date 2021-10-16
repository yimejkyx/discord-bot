const { timeoutDelMessages } = require("../../../helpers/timeoutDelMessages");
const { logger } = require("../../../helpers/logger");
const { prepareSong } = require('./prepareSong');
const { VoiceManager } = require("../../../VoiceManager");


async function playRequest(msg, requestText, voice) {
    await VoiceManager.join(voice.channel);

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
        VoiceManager.play(songInfo);

        if (songInfo.videoLength > 0) {
            reply = await msg.reply(`playing '${songInfo.title}' for ${songInfo.videoLengthMs / 1000}s`);
        } else {
            reply = await msg.reply(`playing '${songInfo.title}' for unlimited`);
        }
    } catch (err) {
        await VoiceManager.leave();

        logger.error(`playRequest: got error in youtube play request, ${err}`);
        reply = await msg.reply("Sry, cannot play that video, nieco sa doondialo :(((((");
    }

    await timeoutDelMessages(5000, [reply, msg]);
}


module.exports = {
    playRequest,
};
