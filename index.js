const {token, mainChannelName} = require("./config.json");
const Discord = require("discord.js");
const {handleGasPrice} = require("./src/handleGasPriceCron");
const {getChannelByName} = require("./src/getChannelByName");
const {handleGasPriceCron} = require("./src/handleGasPriceCron");
const {handleExit} = require("./src/handleExit");

const {logger} = require("./src/logger");
const {handleRetardMuting} = require("./src/handleRetardMuting");
const {handleYoutubeRequest} = require("./src/youtube/handleYoutubeRequest");
const {handlePornRequest} = require("./src/handlePornRequest");
const {
    handleDeletingLastMessages,
} = require("./src/handleDeletingLastMessages.js");

const {handlePressF} = require("./src/handlePressF");
const {handleAuctionRequest} = require("./src/auction-house-api/handleAuctionRequest");
const {timeoutDelMessages} = require("./src/timeoutDelMessages");
const {handleHelp} = require("./src/handleHelp");


function main() {
    const client = new Discord.Client();

    const voiceState = {
        lock: false,
        connection: null,
        stoppingTimeout: null
    };

    const gasState = {
      prices: [],
      listeners: [],
    };
    handleGasPriceCron(client, gasState);


    client.on("ready", async () => {
        logger.info("Connected");
        logger.info(`Logged in as ${client.user.tag}!`);
        const reply = await getChannelByName(client, mainChannelName).send("YimyPi is back bitches :))");
        timeoutDelMessages(5000, [reply]);
    });

    client.on("message", async (msg) => {
        const {member} = msg;
        if (member) {
            const {username} = member.user;
            logger.debug(`received message ${username}:${msg.channel}: ${msg}`);
        } else {
            logger.debug(`received message anon:${msg.channel}: ${msg}`);
        }

        // handlers
        try {
            handleHelp(client, msg);
            handleRetardMuting(client, msg);
            handleYoutubeRequest(client, msg, voiceState);
            handlePornRequest(client, msg);
            handleDeletingLastMessages(client, msg);
            handlePressF(client, msg);
            handleAuctionRequest(client, msg);
            handleGasPrice(client, msg, gasState);
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
