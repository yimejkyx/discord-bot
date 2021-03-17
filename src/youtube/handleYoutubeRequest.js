const {handleStop} = require("./handleStop");
const {handlePlay} = require("./handlePlay");


async function handleYoutubeRequest(client, msg, youtubeState) {
    const {member} = msg;

    if (member) {
        handleStop(client, msg, youtubeState);
        handlePlay(client, msg, youtubeState);
    }
}

module.exports = {
    handleYoutubeRequest,
};
