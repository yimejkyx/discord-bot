import ytdl from "ytdl-core";
import yts from "yt-search";

import { logger } from "../../../helpers/logger";

export async function prepareSong(requestText) {
  logger.debug("prepareSong: got request");
  let url = requestText;
  if (!ytdl.validateURL(requestText)) {
    logger.debug("prepareSong: request text is not url, finding videos");
    const { videos } = await yts(requestText);

    // cant find video
    if (!videos.length) {
      logger.debug("prepareSong: didnt find videos");
      return null;
    }
    url = videos[0].url;

    logger.debug(`prepareSong: found url based on text ${url}`);
  }

  logger.debug(`prepareSong: getting video info from url ${url}`);
  const {
    videoDetails: { title, lengthSeconds },
  } = await ytdl.getInfo(`${url}`);
  const videoLength = Number.parseFloat(lengthSeconds);
  const videoLengthMs = (videoLength + 1) * 1000;

  logger.debug("prepareSong: getting video audio only");
  const song = ytdl(url, { filter: "audioonly" });
  logger.debug("prepareSong: playing song to connection");
  return { song, title, videoLength, videoLengthMs };
}
