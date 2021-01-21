const ytdl = require("ytdl-core");
const { logger } = require("../logger");

async function prepareSong(url) {
    logger.debug('getting video info');
    const ytInfo = await ytdl.getInfo(await ytdl.getURLVideoID(url));
    const title = ytInfo.videoDetails.title;
    const videoLength = Number.parseFloat(ytInfo.length_seconds);
    const videoLengthMs = (videoLength + 1) * 1000;
  
    logger.debug('getting video audio only');
    const song = ytdl(url, { filter: "audioonly" });
    logger.debug('playing song to connection');
    return { song, title, videoLength, videoLengthMs };
}

module.exports = {
    prepareSong
};