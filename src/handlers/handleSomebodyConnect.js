const path = require('path');

const { logger } = require("../helpers/logger");
const { VoiceManager } = require('../VoiceManager');


async function handleSomebodyConnect(oldState, newState) {
    const { guild, member } = oldState;
    const guildName = `The City of Lost Heaven`;

    if (!guild || !member) return;
    if (guild.name !== guildName) return;
    if (!member?.nickname?.includes(`Tokok`)) return;

    // user was not connected, now he is
    if (oldState.channelID === null && newState.channelID !== null) {
        const { voice } = newState.member;

        if (!VoiceManager.lock()) return;

        // if user doesnt have channel or if bot is connected in some channel
        if (!voice.channel || VoiceManager.isConnected()) {
            VoiceManager.unlock();
            return;
        }

        try {
            const songInfo = {
                'title': `Tokok Ojam`,
                'videoLengthMs': 4000,
                'song': path.join(__dirname, '../tokok-ojam.mp3')
            }

            await VoiceManager.join(voice.channel);
            VoiceManager.play(songInfo);
        } catch (err) {
            await VoiceManager.leave();
            logger.error(`handleSomebodyConnect:error: got error, ${err}`);
        }

        VoiceManager.unlock();
    }
}


module.exports = {
    handleSomebodyConnect
}
