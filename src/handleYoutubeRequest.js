const ytdl = require("ytdl-core");
const { logger } = require("./logger");

let connection = null;

async function stop(voice) {
  if (connection) {
    connection.cleanup();
    connection = null;
    await voice.channel.leave();
    logger.info("video cleaning done");
  }
}

async function playUrl(msg, url, voice) {
  connection = await voice.channel.join();

  const ytInfo = await ytdl.getInfo(await ytdl.getURLVideoID(url));
  const ytSong = ytdl(url, { filter: "audioonly" });
  connection.play(ytSong);

  const ytMs = (Number.parseFloat(ytInfo.length_seconds) + 1) * 1000;
  const replyString = `playing '${ytInfo.title}' for ${ytInfo.length_seconds}s`;
  const reply = await msg.reply(replyString);
  logger.info(replyString);

  setTimeout(() => {
    reply.delete();
    msg.delete();
  }, 5000);

  setTimeout(() => stop(voice), ytMs);
}

async function handleYoutubeRequest(client, msg) {
  const { member } = msg;

  if (member) {
    const { content } = msg;
    const { voice } = member;

    if (content === "stop") {
      const reply = await msg.reply("stoping actual video");
      logger.info("stop video executed");

      setTimeout(() => {
        reply.delete();
        msg.delete();
      }, 5000);
      await stop(voice);
    }

    if (content.startsWith("play")) {
      if (voice.channel) {
        if (!connection) {
          const split = content.replace(/\s\s+/g, " ").split(" ");
          if (split.length >= 2) {
            const [, url] = split;
            await playUrl(msg, url, voice);
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
  handleYoutubeRequest
};
