const config = require("./config.json");
const Discord = require("discord.js");
const winston = require("winston");

const client = new Discord.Client();

const logger = winston.createLogger({
  transports: [new winston.transports.Console()]
});

client.on("ready", () => {
  logger.info("Connected");
  logger.info(`Logged in as ${client.user.tag}!`);

  //   console.log(client.guilds.cache.array());
  //   client.guilds.cache.array().forEach(async guild => {
  //     console.log(guild.members.cache.array().map(user => user.user.username));
  //   });ß
});

client.on("message", async msg => {
  logger.info(`recieved message "${msg}"`);
  logger.info(msg.member.userID === "");

  if (msg.member.user.username === "Pitvor") {
    const reply = await msg.reply("Tak to ti mazu Pitvore! Za 3, 2..");
    setTimeout(() => {
      reply.delete();
      msg.delete();
    }, 5000);
  } else if (msg.content === "ping") msg.reply("Tromiks je kokot");
});

client.login(config.token);
