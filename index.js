const config = require("./config.json");
const Discord = require("discord.js");

const { logger } = require("./src/logger");
const { handleRetardMuting } = require("./src/handleRetardMuting");
const { handleYoutubeRequest } = require("./src/handleYoutubeRequest");
const { handlePornRequest } = require("./src/handlePornRequest");

const client = new Discord.Client();

client.on("ready", () => {
  logger.info("Connected");
  logger.info(`Logged in as ${client.user.tag}!`);

  //   console.log(client.guilds.cache.array());
  //   client.guilds.cache.array().forEach(async guild => {
  //     console.log(guild.members.cache.array().map(user => user.user.username));
  //   });
});

client.on("message", async msg => {
  const { content, member } = msg;
  const { username } = member.user;

  logger.info(`recieved message "${msg}"`);
  logger.info({ username, content });

  if (content === "help") {
    msg.reply("Tromiks je retard");
  }
  handleRetardMuting(client, msg);
  handleYoutubeRequest(client, msg);
  handlePornRequest(client, msg);
});

client.login(config.token);
