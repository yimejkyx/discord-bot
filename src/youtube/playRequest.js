const {timeoutDelMessages} = require("../timeoutDelMessages");
const {stop} = require('./stop');
const {logger} = require("../logger");
const {prepareSong} = require('./prepareSong');


async function afterPlayUrl(msg, voice, youtubeState, title, videoLength, videoLengthMs) {
    let reply;
    if (videoLength > 0) {
        const replyString = `playing '${title}' for ${videoLengthMs / 1000}s`;
        reply = await msg.reply(replyString);
        logger.debug(replyString, `videoLengthMs '${videoLengthMs}'`);

        youtubeState.stoppingTimeout = setTimeout(() => {
            logger.debug(`stoping '${title}' - music is end`);
            stop(youtubeState, voice);
            youtubeState.stoppingTimeout = null;
        }, videoLengthMs + 10000);
    } else {
        const replyString = `playing '${title}' for unlimited`;
        reply = await msg.reply(replyString);
        logger.info(replyString);
    }

    return reply;
}

async function playRequest(msg, requestText, voice, youtubeState) {
    youtubeState.connection = await voice.channel.join();

    let reply;
    try {
        const songInfo = await prepareSong(requestText);
        if (!songInfo) {
            reply = await msg.reply("Sry, cannot find video, nieco sa doondialo :(((((");
            await timeoutDelMessages(5000, [reply, msg]);
            return;
        }

        const {song, title, videoLength, videoLengthMs} = songInfo;
        youtubeState.connection.play(song);
        reply = await afterPlayUrl(msg, voice, youtubeState, title, videoLength, videoLengthMs);
    } catch (err) {
        await stop(youtubeState, voice);
        logger.error(`got error in youtube play request, ${err}`);
        reply = await msg.reply("Sry, cannot play that video, nieco sa doondialo :(((((");
    }

    await timeoutDelMessages(5000, [reply, msg]);
}


module.exports = {
    playRequest,
};
