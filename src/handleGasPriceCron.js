const axios = require("axios");
const CronJob = require('cron').CronJob;
const fs = require("fs").promises;

const {timeoutDelMessages} = require("./timeoutDelMessages");
const {logger} = require("./logger");
const {defiPulseApiKey, cmdPrefix} = require("../config.json");


async function handleGasPriceCron(client, gasState) {
    logger.info('CRON: started cron job gas prices');
    new CronJob('1 */10 * * * *', async () => {
        logger.info('CRON TRIGGER: Fetching gas price every 10 minutes');

        const res = await axios.get(`https://ethgasstation.info/api/ethgasAPI.json?api-key=${defiPulseApiKey}`);
        const {data} = res;
        const {fastest, fast, average, safeLow} = data;

        logger.debug(`gas price data: ${JSON.stringify(data)}`);
        gasState.prices = [
            {...data, created: new Date()},
            ...gasState.prices.slice(0, 144 - 1), // Hold gas prices for last day
        ];

        gasState.listeners.forEach((listener) => {
            if (average >= listener.limit * 10) return;

            const guild = client.guilds.cache.find((guild) => guild.id === listener.guildId);
            if (!guild) return;

            const user = guild.members.cache.find((user) => user.id === listener.userId);
            if (!user) return;

            const channel = guild.channels.cache.find((channel) => channel.id === listener.channelId);
            if (!channel) return;

            channel.send(`<@${user.id}> ETH limit avg < ${listener.limit}: fastest **${fastest/10}** (<30s), fast **${fast/10}** (<2m), average **${average/10}** (<5m), safe low **${safeLow/10}** (<30m)`);
        });
    }).start();
}

async function handleGasPrice(client, msg, gasState) {
    const {content, member} = msg;
    if (!member) return;

    const isCommand = content.startsWith(`${cmdPrefix}gas`);
    if (!isCommand) return;

    const hasListener = gasState.listeners.find((listener) => listener.userId === member.id);
    if (hasListener) {
        // removing listener
        logger.info(`Removing user "${member.nickname}" listener`);
        gasState.listeners = gasState.listeners.filter((listener) => listener.userId !== member.id);

        const reply = await msg.reply(`Removing yout gas price watcher`);
        await timeoutDelMessages(5000, [reply, msg]);
    } else {
        logger.info(`Adding user "${member.nickname}" listener`);
        // adding new listener
        const split = content.replace(/\s\s+/g, " ").split(" ");
        if (split.length < 2) return;

        const [, requestLimit] = split;
        const limit = Number.parseInt(requestLimit, 10);
        if (Number.isNaN(limit)) return;

        gasState.listeners.push({
            userId: member.id,
            guildId: msg.guild.id,
            channelId: msg.channel.id,
            limit
        });

        const reply = await msg.reply(`Watching the gas price with limit ${limit}`);
        await timeoutDelMessages(5000, [reply, msg]);
    }

    await fs.writeFile("./gasState.json", JSON.stringify(gasState));
}

module.exports = {
    handleGasPriceCron,
    handleGasPrice
};
