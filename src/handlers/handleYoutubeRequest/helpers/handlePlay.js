const { playRequest } = require("./playRequest");
const { logger } = require("../../../helpers/logger");
const config = require("../../../../config.json");
const { timeoutDelMessages } = require("../../../helpers/timeoutDelMessages");
const { VoiceManager } = require("../../../VoiceManager");
const { cmdPrefix } = config;

async function handlePlay(client, msg) {
    const { content, member: { voice } } = msg;

    if (!content.startsWith(`${cmdPrefix}play`)) return;

    if (!VoiceManager.lock()) {
        const reply = await msg.reply("Cannot play song right now :((");
        await timeoutDelMessages(5000, [reply, msg]);
        return;
    }

    if (!voice.channel) {
        const reply = await msg.reply("You need to join a voice channel first!");
        await timeoutDelMessages(5000, [reply, msg]);
        VoiceManager.unlock();
        return;
    }

    if (VoiceManager.isConnected()) {
        const reply = await msg.reply("Cant play another video!");
        await timeoutDelMessages(5000, [reply, msg]);
        VoiceManager.unlock();
        return;
    }

    const split = content.replace(/\s\s+/g, " ").split(" ");
    if (split.length >= 2) {
        const [, ...requestText] = split;
        const parsedText = requestText.join(" ");

        if (parsedText) {
            logger.info(`handlePlay: playing "${parsedText}"`);
            await playRequest(msg, parsedText, voice);
        } else {
            logger.error(`handlePlay: invalid request "${requestText}"`);
        }
    }

    VoiceManager.unlock();
}

module.exports = {
    handlePlay,
};
