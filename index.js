const {token, mainChannelName} = require("./config.json");
const Discord = require("discord.js");
const fs = require("fs").promises;

const {handleSomebodyConnect} = require("./src/handlers/handleSomebodyConnect");
const {handleGasChart, handleGasPrice} = require("./src/handlers/handleGasPriceCron");
const {handleGasPriceCron} = require("./src/handlers/handleGasPriceCron");
const {handleRetardMuting} = require("./src/handlers/handleRetardMuting");
const {handlePornRequest} = require("./src/handlers/handlePornRequest");
const {handleExit} = require("./src/handlers/handleExit");
const {handlePressF} = require("./src/handlers/handlePressF");
const {handleHelp} = require("./src/handlers/handleHelp");
const {handleVotekick} = require("./src/handlers/handleVotekick");
const {
    handleDeletingLastMessages,
} = require("./src/handlers/handleDeletingLastMessages.js");

const {handleYoutubeRequest} = require("./src/youtube/handleYoutubeRequest");
const {logger} = require("./src/helpers/logger");
const {getChannelByName} = require("./src/helpers/getChannelByName");
const {handleAuctionRequest} = require("./src/auction-house-api/handleAuctionRequest");
const {timeoutDelMessages} = require("./src/helpers/timeoutDelMessages");


async function main() {
    const client = new Discord.Client();

    const voiceState = {
        lock: false,
        connection: null,
        stoppingTimeout: null
    };

    let gasState = null;
    try {
        const file = await fs.readFile("./gasState.json", "utf8");
        gasState = JSON.parse(file);
    } catch (err) {
        gasState = {
            prices: [],
            listeners: [],
        };
    }
    handleGasPriceCron(client, gasState);

    client.on(`voiceStateUpdate`, async (oldState, newState) => {
        handleSomebodyConnect(oldState, newState, voiceState);
    });

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
            handleGasChart(client, msg, gasState);
            handleVotekick(client, msg);
        } catch (e) {
            console.error('Catching handle error', e);
            const reply = await msg.channel.send("Nieco sa doondialo :(((");
            timeoutDelMessages(5000, [reply]);
        }
    });

    client.login(token);
}

main();
