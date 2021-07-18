const { logger } = require('./logger');

function getUserFromMention(client, mention) {
	if (!mention) return;

    logger.debug(`getUserFromMention ${mention}`);
	if (mention.startsWith('<@') && mention.endsWith('>')) {
		mention = mention.slice(2, -1);

		if (mention.startsWith('!')) {
			mention = mention.slice(1);
		}

		return client.users.cache.get(mention);
	}
}

module.exports = {
    getUserFromMention
};
