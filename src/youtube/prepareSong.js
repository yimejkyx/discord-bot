const ytdl = require("ytdl-core");
const yts = require("yt-search");

const { logger } = require("../logger");

async function prepareSong(requestText) {
    let url = requestText;
    if (!ytdl.validateURL(requestText)) {
        const { videos } = await yts(requestText);
        // cant find video
        if (!videos.length) return null;
        url = videos[0].url;
    }

    logger.debug('prepareSong: getting video info');
    const { videoDetails: { title, lengthSeconds } } = await ytdl.getInfo(await ytdl.getURLVideoID(url));
    const videoLength = Number.parseFloat(lengthSeconds);
    const videoLengthMs = (videoLength + 1) * 1000;
  
    logger.debug('prepareSong: getting video audio only');
    const song = ytdl(url, { filter: "audioonly" });
    logger.debug('prepareSong: playing song to connection');
    return { song, title, videoLength, videoLengthMs };
}

module.exports = {
    prepareSong
};