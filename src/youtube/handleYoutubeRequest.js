const {handleStop} = require("./handleStop");
const {handlePlay} = require("./handlePlay");

async function handleYoutubeRequest(client, msg) {
    const {member} = msg;
    const youtubeState = {
        connection: null,
        stoppingTimeout: null,
    };

    if (member) {
        handleStop(client, msg, youtubeState);
        handlePlay(client, msg, youtubeState);
    }
}

module.exports = {
    handleYoutubeRequest,
};
