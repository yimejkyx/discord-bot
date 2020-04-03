let isRetardMuted = false;
let retardId = "340912921569918986";

async function handleRetardMuting(client, msg) {
  const { member } = msg;

  if (member) {
    const {
      content,
      guild: { voiceStates }
    } = msg;
    const { id: userId } = member.user;
    const roles = member.roles.cache.map(({ name }) => name);

    if (isRetardMuted && userId === retardId) {
      const reply = await msg.reply("Tak to ti mazu Pitvore! Za 3, 2..");
      setTimeout(() => {
        reply.delete();
        msg.delete();
      }, 5000);
    }

    // Pitvor, ID 340912921569918986
    const retardVoiceState = voiceStates.cache.find(
      ({ id }) => id === retardId
    );
    if (roles.includes("Bc.") && content === "prosim vypni toho retarda") {
      if (retardVoiceState) {
        retardVoiceState.setMute(true);
        retardVoiceState.setDeaf(true);
      }

      let reply;
      if (isRetardMuted) {
        reply = await msg.channel.send("Retardo uz je mutnute");
      } else {
        isRetardMuted = true;
        reply = await msg.channel.send("Tromiks a uz dost ty hovno");
      }

      setTimeout(() => {
        reply.delete();
        msg.delete();
      }, 5000);
    } else if (roles.includes("Bc.") && content === "uvolni tromiksa") {
      if (retardVoiceState) {
        retardVoiceState.setMute(false);
        retardVoiceState.setDeaf(false);
      }

      let reply;
      if (isRetardMuted) {
        isRetardMuted = false;
        reply = await msg.channel.send("ten potrat moze hovorit");
      } else {
        reply = await msg.channel.send("potrat nema mute");
      }

      setTimeout(() => {
        reply.delete();
        msg.delete();
      }, 5000);
    }
  }
}

module.exports = {
  handleRetardMuting
};
