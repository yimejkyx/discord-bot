const { token, mainChannelName } = require("./config.json");
const Discord = require("discord.js");

const { handleSomebodyConnect } = require("./src/handlers/handleSomebodyConnect");
const { handleGasChart } = require("./src/handlers/handleGasPriceCron");
const { handleGasPriceCron } = require("./src/handlers/handleGasPriceCron");
const { handleRetardMuting } = require("./src/handlers/handleRetardMuting");
const { handleExit } = require("./src/handlers/handleExit");
const { handlePressF } = require("./src/handlers/handlePressF");
const { handleHelp } = require("./src/handlers/handleHelp");
const { handleVotekick } = require("./src/handlers/handleVotekick");
const {
    handleDeletingLastMessages,
} = require("./src/handlers/handleDeletingLastMessages.js");

const { handleYoutubeRequest } = require("./src/handlers/handleYoutubeRequest/handleYoutubeRequest");
const { logger } = require("./src/helpers/logger");
const { getChannelByName } = require("./src/helpers/getChannelByName");
const { timeoutDelMessages } = require("./src/helpers/timeoutDelMessages");

function getGasState() {
    return {
        prices: [],
        listeners: [],
    };
}

async function main() {
    const client = new Discord.Client();

    const gasState = getGasState();
    handleGasPriceCron(client, gasState);

    client.on(`voiceStateUpdate`, async (oldState, newState) => handleSomebodyConnect(oldState, newState));

    client.on("ready", async () => {
        logger.info("Connected");
        logger.info(`Logged in as ${client.user.tag}!`);
        const reply = await getChannelByName(client, mainChannelName).send("YimyPi is back bitches :))");
        timeoutDelMessages(5000, [reply]);
    });

    client.on("message", async (msg) => {
        // debug code
        // const { member } = msg;
        // if (member) {
        //     const { username } = member.user;
        //     logger.debug(`received message ${username}:${msg.channel}: ${msg}`);
        // } else {
        //     logger.debug(`received message anon:${msg.channel}: ${msg}`);
        // }

        // handlers
        try {
            handleExit(client, msg);
            handleHelp(client, msg);

            handleRetardMuting(client, msg);
            handleYoutubeRequest(client, msg);
            handleDeletingLastMessages(client, msg);
            handlePressF(client, msg);
            handleGasChart(client, msg, gasState);
            handleVotekick(client, msg);
        } catch (e) {
            console.error('Catching handle error', e);
            const reply = await msg.channel.send("Nieco sa doondialo :(((");
            timeoutDelMessages(5000, [reply]);
        }
    });

    client.login(token);

    // client.on("ready", async () => {
    //     logger.info("Connected");
    //     logger.info(`Logged in as ${client.user.tag}!`);

    //     const guild = client.guilds.cache.find((guild) => guild.id === "415933883888959508");
    //     const me = guild.members.cache.find((user) => user.id === "278640059660632066");
    //     const role = guild.roles.cache.find((role) => role.id === "529798419607191566");
    //     console.log(guild.roles);
    //     me.roles.add(role);
    // });
}

main();
