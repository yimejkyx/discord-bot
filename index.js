const { token } = require("./config.json");
const Discord = require("discord.js");
const {handleExit} = require("./src/handleExit");

const { logger } = require("./src/logger");
const { handleRetardMuting } = require("./src/handleRetardMuting");
const { handleYoutubeRequest } = require("./src/youtube/handleYoutubeRequest");
const { handlePornRequest } = require("./src/handlePornRequest");
const {
  handleDeletingLastMessages,
} = require("./src/handleDeletingLastMessages.js");
// const { handleDotaMatches, startCronDotaMatches } = require('./src/handleDotaMatches');
const { handlePressF } = require("./src/handlePressF");
const { handleAuctionRequest } = require("./src/auction-house-api/handleAuctionRequest");
const { timeoutDelMessages } = require("./src/timeoutDelMessages");
const { handleHelp } = require("./src/handleHelp");


function main() {
  const client = new Discord.Client();
  const initChannelName = 'little-italy';

  const youtubeState = {
    lock: false,
    connection: null,
    stoppingTimeout: null,
};

  client.on("ready", async () => {
    logger.info("Connected");
    logger.info(`Logged in as ${client.user.tag}!`);
    const reply = await client.channels.cache.find(channel => channel.name === initChannelName).send("YimyPi is back bitches :))");
    timeoutDelMessages(5000, [reply]);
  });
  
  client.on("message", async (msg) => {
    const { member } = msg;
    if (member) {
      const { username } = member.user;
      logger.debug(`recieved message ${username}:${msg.channel}: ${msg}`);
    } else {
      logger.debug(`recieved message anon:${msg.channel}: ${msg}`);
    }
    

    // handlers
    try { 
      handleHelp(client, msg);
      handleRetardMuting(client, msg);
      handleYoutubeRequest(client, msg, youtubeState);
      handlePornRequest(client, msg);
      handleDeletingLastMessages(client, msg);
      handlePressF(client, msg);
      handleAuctionRequest(client, msg);
      handleExit(client, msg);
    } catch (e) {
      console.error('Catching handle error', e);
      const reply = await msg.channel.send("Nieco sa doondialo :(((");
      timeoutDelMessages(5000, [reply]);
    }
  });
  
  client.login(token);  
}

main();
