const {handleStop} = require("./handleStop");
const {handlePlay} = require("./handlePlay");


async function handleYoutubeRequest(client, msg, voiceState) {
    const {member} = msg;

    if (member) {
        handleStop(client, msg, voiceState);
        handlePlay(client, msg, voiceState);
    }
}

module.exports = {
    handleYoutubeRequest,
};
