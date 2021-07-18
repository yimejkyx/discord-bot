const { logger } = require("../helpers/logger");

async function deleteMessages(messages) {
    if (messages) {
        return Promise.all(
            messages.map(mes => mes?.delete())
        ).catch(() => {
        });
    }

    return null;
}

async function timeoutDelMessages(time, messages) {
    return new Promise((res, rej) => setTimeout(() => deleteMessages(messages).then(res).catch(rej), time));
}

module.exports = {
    timeoutDelMessages,
};
