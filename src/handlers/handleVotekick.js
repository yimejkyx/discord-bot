const {timeoutDelMessages} = require("../helpers/timeoutDelMessages");
const {cmdPrefix} = require("../../config.json");
const {logger} = require("../helpers/logger");
const {VoteKickManager} = require("../helpers/VoteKickManager");
const {getUserFromMention} = require("../helpers/getUserFromMention");


async function handleVotekick(client, msg) {
    const {content} = msg;

    const commandString = `${cmdPrefix}vk`;
    if (content.startsWith(commandString)) {
        if (!VoteKickManager.lock()) return;

        const args = content.slice(commandString.length).trim().split(/ +/);
        const voterId = msg.member.id;
        logger.debug(`handleVotekick: I am inside ${args}`);

        let reply = null;
        if (VoteKickManager.hasActiveVoting()) {
            logger.debug('handleVotekick: increasing votekick');
            reply = await VoteKickManager.voteUser(voterId, msg);
        } else {
            logger.debug('handleVotekick: initing votekick');
            if (args.length > 0) {
                const user = getUserFromMention(client, args[0]);
                if (user) {
                    VoteKickManager.initState(msg, user);
                    reply = await VoteKickManager.voteUser(voterId, msg);
                } else {
                    reply = await msg.reply("Čo chybalo??? Nenašiel som panáčka...");
                }
            } else {
                reply = await msg.reply("Čo chybalo??? Meno");
            }
        }
        VoteKickManager.unlock();

        await timeoutDelMessages(5000, [reply, msg]);
    }
}

module.exports = {
    handleVotekick
};
