const $ = require('cheerio')
const axios = require("axios");
const { logger } = require("../../../../helpers/logger");

const wikiNipUrl = "https://liquipedia.net/dota2/api.php?action=parse&format=json&page=Ninjas_in_Pyjamas";

async function fetchDotaMatches() {
  logger.info("fetching dota matches")
  try {
    const response = await axios({
      method: 'GET',
      url: wikiNipUrl,
      headers: {
        "Accept-Encoding": "gzip",
        "User-Agent": "PersonalDiscordBot/0.1 (nikolas.tsk@gmail.com)"
      }
    });

    logger.debug('DEBUG got response');
    const html = response.data.parse.text["*"];
    const content = $.load(html)('div.fo-nttax-infobox-wrapper table.infobox_matches_content')
    const matches = []

    logger.debug('DEBUG parsing content');
    content.each((_, el) => {
      const teamLeft = $(el).find('.team-left');
      const teamRight = $(el).find('.team-right');
      const matchInfo = $(el).find('.match-filler');

      if (teamLeft.html() && teamRight.html()) {
        const timeText = matchInfo.find('.timer-object').text().replace(',', '').replace('-', '').replace(/\s\s+/g, ' ');
        const match = {
          teamLeft: teamLeft.find('a').text() || 'TBD',
          teamRight: teamRight.find('a').text() || 'TBD',
          date: new Date(timeText),
          url: `https://liquipedia.net${matchInfo.find('a').attr('href')}`,
        }
        matches.push(match)
      }
    });

    logger.info("done fetching dota matches");
    return matches;
  } catch (e) {
    logger.error("error fetching dota matches", e);
    return null;
  }
}

module.exports = {
  fetchDotaMatches
}