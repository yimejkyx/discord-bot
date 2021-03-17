const {timeoutDelMessages} = require("./timeoutDelMessages");
const {cmdPrefix} = require("../config.json");

async function handleHelp(client, msg) {
    const {content} = msg;

    if (content === `${cmdPrefix}help`) {
        const reply = await msg.reply("Tromiks je retard");
        await timeoutDelMessages(5000, [reply, msg]);
    }
}

module.exports = {
    handleHelp
};
