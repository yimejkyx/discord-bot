const gifResize = require('@gumlet/gif-resize');
const Pornsearch = require("pornsearch");
const axios = require('axios');
const {timeoutDelMessages} = require("./timeoutDelMessages");

const {logger} = require("./logger");
const {cmdPrefix} = require("../config.json");

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function getImageParsed(inputUrl) {
    const input = (await axios({url: inputUrl, responseType: "arraybuffer"})).data;
    logger.info(`feched image ${inputUrl}`);
    return gifResize({width: 350, optimizationLevel: 3})(input);
}

async function handlePornRequest(client, msg) {
    const {content} = msg;

    if (!content.startsWith(`${cmdPrefix}plsky`)) return;


    const split = content.replace(/\s\s+/g, " ").split(" ");
    if (!(split.length >= 2)) return;
    const [, ...parsed] = split;
    const query = parsed.join(" ");
    logger.info(`requested porn "${query}"`);

    let reply = null;
    let url = null;

    try {
        const search = Pornsearch.search(query, driver = 'pornhub');
        const gifs = await search.gifs(getRandomInt(1, 5));
        const items = gifs.filter(({url}) => !url.includes("undefined"));
        url = items[Math.floor(Math.random() * items.length)].url;
    } catch (err) {
        logger.error(`got error in porn search url`);
        reply = await msg.reply("Sry, cant find your kinky shit");
    }

    if (url) {
        try {
            logger.info("got url", url);
            const progressMessage = await msg.channel.send(`Got '${query}': ${url}`);
            // const image = await getImageParsed(url);
            // logger.info("got image", image.length);

            // const attachment = new MessageAttachment(image, 'image.gif');
            // msg.channel.send('', attachment);
            // logger.info("got sent to discord", url);
        } catch (err) {
            logger.error(`got error in porn image url:`, err);
            reply = await msg.reply("Sry, error happend during fetching");
        }
    }

    await timeoutDelMessages(5000, [reply, msg]);
}

module.exports = {
    handlePornRequest
};
