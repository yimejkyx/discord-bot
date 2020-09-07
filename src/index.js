const { token, cmdPrefix } = require("./config.json");
const Discord = require("discord.js");

const { logger } = require("./logger");
const { handleRetardMuting } = require("./handleRetardMuting");
const { handleYoutubeRequest } = require("./handleYoutubeRequest");
const { handlePornRequest } = require("./handlePornRequest");
const {
  handleDeletingLastMessages,
} = require("./handleDeletingLastMessages.js");
const { handleDotaMatches, startCronDotaMatches } = require('./handleDotaMatches');
const { handlePressF } = require("./handlePressF");

const client = new Discord.Client();

client.on("ready", () => {
  logger.info("Connected");
  logger.info(`Logged in as ${client.user.tag}!`);

  startCronDotaMatches(client);
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
