async function deleteMessages(messages) {
    return Promise.all(
        messages.map(mes => mes?.delete())
    ).catch(() => {
    });
}

async function timeoutDelMessages(time, messages) {
    return new Promise((res, rej) => setTimeout(() => deleteMessages(messages).then(res).catch(rej), time));
}

module.exports = {
    timeoutDelMessages,
};
