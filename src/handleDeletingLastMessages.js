const {logger} = require("./logger");
const config = require("../config.json");
const {timeoutDelMessages} = require("./timeoutDelMessages");
const {cmdPrefix} = config;

let isDeleting = false;

async function handleDeletingLastMessages(client, msg) {
    const {content, member} = msg;
    if (!member) return;

    const roles = member.roles.cache.map(({name}) => name);
    const hasRole = config.canDeleteMessages.some(role => roles.includes(role));
    const isCommand =
        content.startsWith(`${cmdPrefix}ocista`) ||
        content.startsWith(`${cmdPrefix}klin`) ||
        content.startsWith(`${cmdPrefix}kleen`) ||
        content.startsWith(`${cmdPrefix}clean`) ||
        content.startsWith(`${cmdPrefix}clear`);

    if (!isDeleting && hasRole && isCommand) {
        const split = content.replace(/\s\s+/g, " ").split(" ");
        isDeleting = true;

        let count = 5;
        if (split.length >= 2) {
            const [, num] = split;
            count = Number.parseInt(num);
            if (Number.isNaN(count)) count = 5;
        }

        if (count > 10) count = 10;
        if (count < 1) count = 1;

        const {channel} = msg;
        if (channel) {
            let reply = null;
            try {
                logger.info(`deleting messages in channel ${count + 1}`);
                const {messages} = channel;
                const deleteMessages = await messages.fetch({limit: count + 1}); // will delete trigger message

                reply = await msg.reply(`mazu vam tie hovna, konkretne '${deleteMessages.size - 1}' shits`);
                await Promise.all(deleteMessages.map(m => m.delete()));
                logger.info("deleting messages done");
                await timeoutDelMessages(0, [reply]);
            } catch (err) {
                logger.error(`got error deleting messages, ${err}`);
                const errorReply = await msg.reply("Sry, nieco sa doondialo pri mazani");
                await timeoutDelMessages(5000, [errorReply]);
            }
        }

        isDeleting = false;
    }
}

module.exports = {
    handleDeletingLastMessages
};
