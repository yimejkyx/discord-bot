const {handleStop} = require("./handleStop");
const {handlePlay} = require("./handlePlay");


async function handleYoutubeRequest(client, msg) {
    const {member} = msg;

    if (member) {
        handleStop(client, msg);
        handlePlay(client, msg);
    }
}

module.exports = {
    handleYoutubeRequest,
};
