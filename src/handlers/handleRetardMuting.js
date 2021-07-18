let isRetardMuted = false;
let retardId = "340912921569918986";
const config = require("../../config.json");
const {timeoutDelMessages} = require("../helpers/timeoutDelMessages");

async function handleRetardMuting(client, msg) {
    const {member} = msg;
    if (!member) return;

    const {
        content, guild: {voiceStates}
    } = msg;
    const {id: userId} = member.user;
    const roles = member.roles.cache.map(({name}) => name);

    let reply = null;
    if (isRetardMuted && userId === retardId) {
        reply = await msg.reply("Tak to ti mazu Pitvore! Za 3, 2..");
        await timeoutDelMessages(5000, [reply, msg]);
        return;
    }

    // Pitvor, ID 340912921569918986
    const retardVoiceState = voiceStates.cache.find(({id}) => id === retardId);
    const hasRole = config.canMuteRetard.some(role => roles.includes(role));

    // Activate mute
    if (hasRole && content === "prosim vypni toho retarda") {
        if (retardVoiceState) {
            retardVoiceState.setMute(true);
            retardVoiceState.setDeaf(true);
        }

        if (isRetardMuted) {
            reply = await msg.channel.send("Retardo uz je mutnute");
        } else {
            isRetardMuted = true;
            reply = await msg.channel.send("Tromiks a uz dost ty hovno");
        }

        await timeoutDelMessages(5000, [reply, msg]);
        return;
    }

    // Disable mute
    if (hasRole && content === "uvolni tromiksa") {
        if (retardVoiceState) {
            retardVoiceState.setMute(false);
            retardVoiceState.setDeaf(false);
        }

        if (isRetardMuted) {
            isRetardMuted = false;
            reply = await msg.channel.send("ten potrat moze hovorit");
        } else {
            reply = await msg.channel.send("potrat nema mute");
        }

        await timeoutDelMessages(5000, [reply, msg]);
        return;
    }
}

module.exports = {
    handleRetardMuting
};
