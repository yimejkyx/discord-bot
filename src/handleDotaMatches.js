const CronJob = require('cron').CronJob;
const { logger } = require("./logger");
const { cmdPrefix } = require("./config.json");
const { fetchDotaMatches } = require('./fetchDotaMatches');

let matches = fetchDotaMatches();

function getMatchString(match) {
    return `${match.teamLeft} VS ${match.teamRight} - ${match.date.toLocaleString()}`;
}

async function startCronDotaMatches(client) {
    logger.info('CRON: started cron job dota matches');
    new CronJob('1 */20 * * * *', async () => {
        logger.info('CRON TRIGGER: Fetching dota matches every 10 minutes');
        matches = fetchDotaMatches();
    
        const parsedMatches = await matches;
        if (parsedMatches) {
            const mainJokerickChannelID = '415933883888959510';
            const channels = client.channels.cache.filter((obj) => obj.type === 'text' && obj.id === mainJokerickChannelID);
            const ONE_HOUR = 60 * 60 * 1000; // 2 days
            const now = new Date();

            parsedMatches.forEach((match) => {        
                const diff = match.date - now;
                if (diff > 0 && diff < ONE_HOUR) {
                    const fixedTime = (diff / (1000 * 60)).toFixed(0)
                    channels.forEach((channel) => {
                        channel.send(`@everyone **Dotka soon retards** ${getMatchString(match)}\n${match.url} in ${fixedTime} minutes`);
                    });
                }
            });
        }
    }).start();
}

async function handleDotaMatches(client, msg) {
  const { content, member } = msg;

  if (member) {
    const isCommand = content === `${cmdPrefix}dota` || content === `${cmdPrefix}dotka` || content === `${cmdPrefix}nip`;
    if (isCommand) {
      const { channel } = msg;
      if (channel) {
        let replyString = `**Dotka NIP**\n`;
        const parsedMatches = await matches;

        if (parsedMatches !== null) {
            parsedMatches.forEach((match) => {
                replyString = `${replyString}${getMatchString(match)}\n`;
            });
            await channel.send(replyString);
        } else {
            await channel.send('Nemam dotku :((');
        }

        await msg.delete();
      }
    }
  }
}

module.exports = {
    startCronDotaMatches,
    handleDotaMatches,
};
