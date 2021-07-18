const path = require('path');

const {logger} = require("../helpers/logger");
const {stopVoiceConnection} = require("../helpers/stopVoiceConnection");


async function handleSomebodyConnect(oldState, newState, voiceState) {
    const {guild, member} = oldState;
    const guildName = `The City of Lost Heaven`;

    if (!guild || !member) return;
    if (guild.name !== guildName) return;
    if (!member?.nickname?.includes(`Tokok`)) return;

    // user was not connected, now he is
    if (oldState.channelID === null && newState.channelID !== null) {
        const { voice } = newState.member;

        if (voiceState.lock) return;
        voiceState.lock = true;

        // if user doesnt have channel or if bot is connected in some channel
        if (!voice.channel || voiceState.connection) {
            voiceState.lock = false;
            return;
        }

        try {
            const songInfo = {
                'title': `Tokok Ojam`,
                'videoLengthMs': 4000,
            }

            voiceState.connection = await voice.channel.join();
            voiceState.connection.play(path.join(__dirname, './tokok-ojam.mp3'));

            if (songInfo.videoLength <= 0) {
                // TODO: clearing
                return;
            }

            logger.debug(`handleSomebodyConnect:clean: videoLengthMs '${songInfo.videoLengthMs}'`);
            const clearingFunction = async () => {
                logger.debug(`handleSomebodyConnect:clean: stopping voice after playing '${songInfo.title}' - music is end`);
                voiceState.stoppingTimeout = null;
                await stopVoiceConnection(voiceState);
            }
            voiceState.stoppingTimeout = setTimeout(clearingFunction, songInfo.videoLengthMs + 2000);
        } catch (err) {
            await stopVoiceConnection(voiceState);
            logger.error(`handleSomebodyConnect:error: got error, ${err}`);
        }

        voiceState.lock = false;
    }
}


module.exports = {
    handleSomebodyConnect
}
