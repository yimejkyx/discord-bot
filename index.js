const { token, cmdPrefix } = require("./config.json");
const Discord = require("discord.js");

const { logger } = require("./src/logger");
const { handleRetardMuting } = require("./src/handleRetardMuting");
const { handleYoutubeRequest } = require("./src/handleYoutubeRequest");
const { handlePornRequest } = require("./src/handlePornRequest");
const {
  handleDeletingLastMessages,
} = require("./src/handleDeletingLastMessages.js");
const { handleDotaMatches, startCronDotaMatches } = require('./src/handleDotaMatches');
const { handlePressF } = require("./src/handlePressF");

const client = new Discord.Client();

client.on("ready", () => {
  logger.info("Connected");
  logger.info(`Logged in as ${client.user.tag}!`);

  startCronDotaMatches(client);

  //   console.log(client.guilds.cache.array());
  //   client.guilds.cache.array().forEach(async guild => {
  //     console.log(guild.members.cache.array().map(user => user.user.username));
  //   });
});

client.on("message", async (msg) => {
  const { content, member } = msg;
  logger.info(`recieved message "${msg}", "${msg.channel}"`);

  if (member) {
    const { username } = member.user;
    logger.info(`message got member '${username}}'`);
  }

  if (content === `${cmdPrefix}help`) {
    const reply = await msg.reply("Tromiks je retard");
    setTimeout(() => {
      reply.delete();
      msg.delete();
    }, 5000);
  }

  // handlers
  handleRetardMuting(client, msg);
  handleYoutubeRequest(client, msg);
  handlePornRequest(client, msg);
  handleDeletingLastMessages(client, msg);
  handlePressF(client, msg);
  handleDotaMatches(client, msg);
});

client.login(token);
