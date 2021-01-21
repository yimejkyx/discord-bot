const { stop } = require('./stop');
const { logger } = require("../logger");
const { prepareSong } = require('./prepareSong');

  
async function afterPlayUrl(msg, voice, youtubeState, title, videoLength, videoLengthMs) {
    if (videoLength > 0) {
        const replyString = `playing '${title}' for ${videoLengthMs / 1000}s`;
        reply = await msg.reply(replyString);
        logger.debug(replyString, `videoLengthMs '${videoLengthMs}'`);

        youtubeState.stoppingTimeout = setTimeout(() => {
            logger.debug(`stoping '${title}' - music is end`);
            stop(youtubeState, voice);
            youtubeState.stoppingTimeout = null;
        }, videoLengthMs);
    } else {
        const replyString = `playing '${title}' for unlimited`;
        reply = await msg.reply(replyString);
        logger.info(replyString);
    }

    return reply;
}

async function playUrl(msg, url, voice, youtubeState) {
    youtubeState.connection = await voice.channel.join();

    let reply = null;
    try {
        const { song, title, videoLength, videoLengthMs } = await prepareSong(url);
        youtubeState.connection.play(song);
        reply = await afterPlayUrl(msg, voice, youtubeState, title, videoLength, videoLengthMs);
    } catch (err) {
        stop(youtubeState, voice);
        logger.error(`got error in youtube play request, ${err}`);
        reply = await msg.reply("Sry, cant play that video, something went wrong :(((((");
    }

    setTimeout(() => {
        reply?.delete();
        msg.delete();
    }, 5000);
}


module.exports = {
    playUrl,
};
