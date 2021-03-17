const {playRequest} = require("./playRequest");
const {logger} = require("../logger");
const config = require("../../config.json");
const {timeoutDelMessages} = require("../timeoutDelMessages");
const {cmdPrefix} = config;

async function handlePlay(client, msg, voiceState) {
    const {content, member: {voice}} = msg;

    if (!content.startsWith(`${cmdPrefix}play`)) return;
    if (voiceState.lock) {
        const reply = await msg.reply("Cannot play song right now :((");
        await timeoutDelMessages(5000, [reply, msg]);
        return;
    }
    voiceState.lock = true;

    if (!voice.channel) {
        const reply = await msg.reply("You need to join a voice channel first!");
        await timeoutDelMessages(5000, [reply, msg]);
        voiceState.lock = false;
        return;
    }

    if (voiceState.connection) {
        const reply = await msg.reply("Cant play another video!");
        await timeoutDelMessages(5000, [reply, msg]);
        voiceState.lock = false;
        return;
    }

    const split = content.replace(/\s\s+/g, " ").split(" ");
    if (split.length >= 2) {
        const [, ...requestText] = split;
        const parsedText = requestText.join(" ");

        if (parsedText) {
            logger.info(`handlePlay: playing "${parsedText}"`);
            await playRequest(msg, parsedText, voice, voiceState);
        } else {
            logger.error(`handlePlay: invalid request "${requestText}"`);
        }
    }

    voiceState.lock = false;
}

module.exports = {
    handlePlay,
};
