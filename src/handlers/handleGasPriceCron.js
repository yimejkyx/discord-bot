const axios = require("axios");
const CronJob = require('cron').CronJob;
const vega = require("vega");
const { MessageAttachment} = require('discord.js');

const {timeoutDelMessages} = require("../helpers/timeoutDelMessages");
const {logger} = require("../helpers/logger");
const {defiPulseApiKey, cmdPrefix} = require("../../config.json");


async function handleGasPriceCron(client, gasState) {
    logger.info('CRON: started cron job gas prices');
    new CronJob('1 */10 * * * *', async () => {
        try {
            logger.info('CRON TRIGGER: Fetching gas price every 10 minutes');

            const res = await axios.get(`https://ethgasstation.info/api/ethgasAPI.json?api-key=${defiPulseApiKey}`);
            const {data} = res;
            const {fastest, fast, average, safeLow} = data;
    
            // logger.debug(`gas price data: ${JSON.stringify(data)}`);
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
    
                channel.send(`<@${user.id}> ETH limit avg < ${listener.limit}: fastest **${fastest / 10}** (<30s), fast **${fast / 10}** (<2m), average **${average / 10}** (<5m), safe low **${safeLow / 10}** (<30m)`);
            });
        } catch (err) {
            logger.error(`gas price cron error: ${err.stack}`);
        }
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
}

function getSpec(values) {
    return {
        "$schema": "https://vega.github.io/schema/vega/v5.json",
        "description": "Chart",
        "width": 850,
        "height": 500,
        "padding": 5,
        "background": "white",
        "signals": [
            {
                "name": "interpolate",
                "value": "monotone"
            }
        ],
        "data": [
            {
                "name": "table",
                "values": values
            }
        ],
        "scales": [
            {
                "name": "x",
                "type": "point",
                "range": "width",
                "reverse": true,
                "domain": {"data": "table", "field": "created"}
            },
            {
                "name": "y",
                "type": "linear",
                "range": "height",
                "nice": true,
                "domain": {"data": "table", "field": "value"}
            },
            {
                "name": "type",
                "type": "ordinal",
                "range": "category",
                "domain": {"data": "table", "field": "type"}
            }
        ],
        "axes": [
            {"orient": "bottom", "scale": "x", "grid": true},
            {"orient": "left", "scale": "y", "grid": true}
        ],
        "marks": [
            {
                "type": "group",
                "from": {
                    "facet": {
                        "name": "series",
                        "data": "table",
                        "groupby": "type"
                    }
                },
                "marks": [
                    {
                        "type": "line",
                        "from": {"data": "series"},
                        "encode": {
                            "enter": {
                                "x": {"scale": "x", "field": "created"},
                                "y": {"scale": "y", "field": "value"},
                                "stroke": {"scale": "type", "field": "type"},
                                "strokeWidth": {"value": 3}
                            },
                            "update": {
                                "interpolate": {"signal": "interpolate"},
                                "strokeOpacity": {"value": 1}
                            },
                            "hover": {
                                "strokeOpacity": {"value": 0.5}
                            },
                            "legend": {
                                "update": {
                                    "stroke": {"value": "#ccc"},
                                    "strokeWidth": {"value": 1.5}
                                }
                            }
                        }
                    }
                ]
            }
        ]
    };

}

async function handleGasChart(client, msg, gasState) {
    const {content, member} = msg;
    if (!member) return;

    const isCommand = content === `${cmdPrefix}gas plot`;
    if (!isCommand) return;

    const values = gasState.prices.reduce((arr, item) => (
        [
            ...arr,
            ...["safeLow", "average", "fast", "fastest"].map((key) => ({
                "created": new Date(item.created),
                "value": item[key] / 10,
                "type": key,
            }))
        ]
    ), []);

    const spec = getSpec(values);
    const view = new vega
        .View(vega.parse(spec))
        .renderer('none')
        .initialize();

    try {
        const canvas = await view.toCanvas();
        logger.info('Sending PNG to file chart');
        const attachment = new MessageAttachment(canvas.toBuffer(), 'gas-price.png');
        await msg.channel.send(attachment);
    } catch (err) {
        logger.err("Error writing PNG to file:");
        console.error(err);
    }
}

module.exports = {
    handleGasPriceCron,
    handleGasPrice,
    handleGasChart
};
