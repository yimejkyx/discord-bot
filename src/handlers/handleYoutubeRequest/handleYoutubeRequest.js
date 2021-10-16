const {handleStop} = require("./helpers/handleStop");
const {handlePlay} = require("./helpers/handlePlay");


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
