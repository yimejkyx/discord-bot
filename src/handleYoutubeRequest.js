const ytdl = require("ytdl-core");
const { logger } = require("./logger");
const { cmdPrefix } = require("../config.json");

let connection = null;

async function stop(voice) {
  try {
    if (connection) {
      connection.cleanup();
      connection = null;
      await voice.channel.leave();
      logger.info("video cleaning done");
    }
  } catch (e) {
    logger.debug('stop error debug', e);
  }
}

async function playUrl(msg, url, voice) {
  connection = await voice.channel.join();

  let reply = null;
  try {
    logger.debug('getting video info');
    const ytInfo = await ytdl.getInfo(await ytdl.getURLVideoID(url));
    logger.debug('getting video audio only');
    const ytSong = ytdl(url, { filter: "audioonly" });
    logger.debug('playing song to connection');
    connection.play(ytSong);

    const parsedLengthSeconds = Number.parseFloat(ytInfo.length_seconds);
    if (parsedLengthSeconds > 0) {
      const ytMs = (parsedLengthSeconds + 1) * 1000;
      const replyString = `playing '${ytInfo.title}' for ${ytMs / 1000}s`;
      reply = await msg.reply(replyString);
      logger.info(replyString);
      logger.debug(`ytMs '${ytMs}'`);
      // TODO if was manually stop remove timeout
      setTimeout(() => {
        logger.debug(`stoping '${ytInfo.title}' - music is end`);
        stop(voice);
      }, ytMs);
    } else {
      const replyString = `playing '${ytInfo.title}' for unlimited`;
      reply = await msg.reply(replyString);
      logger.info(replyString);
    }
  } catch (err) {
    stop(voice);
    logger.error(`got error in youtube play request, ${err}`);
    reply = await msg.reply(
      "Sry, cant play that video, something went wrong :((((("
    );
  }

  setTimeout(() => {
    reply.delete();
    msg.delete();
  }, 5000);
}

async function handleYoutubeRequest(client, msg) {
  const { member } = msg;

  if (member) {
    const { content } = msg;
    const { voice } = member;

    if (content === `${cmdPrefix}stop`) {
      const reply = await msg.reply("stoping actual video");
      logger.info("stop video executed");

      setTimeout(() => {
        reply.delete();
        msg.delete();
      }, 5000);
      await stop(voice);
    }

    if (content.startsWith(`${cmdPrefix}play`)) {
      if (voice.channel) {
        if (!connection) {
          const split = content.replace(/\s\s+/g, " ").split(" ");
          if (split.length >= 2) {
            const [, url] = split;
            if (url) {
              logger.info(`playing "${url}"`);
              await playUrl(msg, url, voice);
            } else {
              logger.error(`invalid url "${url}"`);
            }
          }
        } else {
          const reply = await msg.reply("Cant play another video!");
          setTimeout(() => {
            reply.delete();
            msg.delete();
          }, 5000);
        }
      } else {
        const reply = await msg.reply(
          "You need to join a voice channel first!"
        );
        setTimeout(() => {
          reply.delete();
          msg.delete();
        }, 5000);
      }
    }
  }
}

module.exports = {
  handleYoutubeRequest,
};
