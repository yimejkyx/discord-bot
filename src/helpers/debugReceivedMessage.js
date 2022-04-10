import { logger } from "./logger";

function debugReceivedMessage(msg) {
  // debug code
  const { member } = msg;
  if (member) {
    const { username } = member.user;
    logger.debug(`received message ${username}:${msg.channel}: ${msg}`);
  } else {
    logger.debug(`received message anon:${msg.channel}: ${msg}`);
  }
}

module.exports = {
  debugReceivedMessage,
};
