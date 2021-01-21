const puppeteer = require('puppeteer');
const stringTable = require("string-table");
const { logger } = require("../logger");
const { recipes } = require("./recipes");

const config = require("../../config.json");
const { cmdPrefix } = config;

let browser = null;

async function openOribosPage() {
    const page = await browser.newPage();
    await page.goto('https://oribos.exchange', { waitUntil: 'networkidle2' });
    await page.select('div.search-bar select', '549');
    return page;
}

async function getItemValue(input) {
    const page = await openOribosPage();
    logger.debug(`paged opened done: ${input}`);

    try {
        const resetBtn = await page.$('div.search-bar div.text-container div.text-reset');
        await resetBtn.click();
    } catch (e) { }

    await page.type('div.search-bar div.text-container input', input);
    await page.keyboard.press('Enter');

    const tableSelector = 'div.search-result-target table tbody';
    await page.waitForSelector(`${tableSelector} tr td.price`);
    const table = await page.$(tableSelector);

    const data = await table.evaluate((ele) => {
        const rows = Array.from(ele.querySelectorAll('tr'));
        return rows.map((tr) => {
            const name = tr.querySelector('td.name span').textContent;
            const gold = tr.querySelector('td.price span span.gold').textContent;
            const silver = tr.querySelector('td.price span span.silver').textContent;
            const price = Number.parseInt(gold) + Number.parseInt(silver) / 100;

            return {
                name,
                price
            };
        });
    });

    return data.map(obj => ({ ...obj, inputName: input }));
}

async function getPrices(items) {
    const data = items.map(name =>
        new Promise(async res => {
            const output = await getItemValue(name);
            res(output[0]);
        })
    );

    return await Promise.all(data);
}

async function launchBrowser() {
    try {
        browser = await puppeteer.launch({ headless: true });
    } catch (err) {}

    try {
        browser = await puppeteer.launch({ headless: true, executablePath: 'chromium-browser' });
    } catch (err) {}
}

async function fetchAllRecipes() {
    await launchBrowser();

    const items = [...new Set(
        recipes.reduce((arr, recipe) => ([
            ...arr,
            recipe.name,
            ...recipe.ingredients.map(item => item.name)
        ]), [])
    )];
    logger.debug(`getting prices: ${items}`);
    const prices = await getPrices(items);

    const pricesObj = prices.reduce((obj, item) => ({ ...obj, [item.name]: item.price }), {});
    const recipesProfit = recipes.map((item) => {
        const itemPrice = pricesObj[item.name];
        const craftPrice = item.ingredients.reduce((price, ing) => price + ing.count * pricesObj[ing.name], 0)
        const profit = itemPrice - craftPrice;

        return {
            name: item.name,
            profit: Number.parseFloat(profit.toFixed(2))
        };
    });

    // console.log("hello", pricesObj);
    logger.debug(`showing recipes and items prices`);
    console.table(prices);
    console.table(recipesProfit);
    await browser.close();

    return {
        prices: stringTable.create(prices),
        recipes: stringTable.create(recipesProfit),
    };
}

async function handleAuctionRequest(client, msg) {
    const { content, member } = msg;

    if (!member) return;
    if (content === `${cmdPrefix}auction profit`) {
        logger.info("handling auction request");
        const reply = await msg.channel.send(`Fetching profit recipes`);

        const tables = await fetchAllRecipes();
        await msg.reply(`\`\`\`\n${tables.prices}\`\`\``);

        await reply?.delete();
        await msg.delete();
        return;
    };

    if (content.startsWith(`${cmdPrefix}auction `)) {
        const split = content.replace(/\s\s+/g, " ").split(" ");
        if (split.length < 2) return;
        const [, ...stringRequest] = split;
        const requestQuery = stringRequest.join(' ');

        const reply = await msg.channel.send(`Fetching auction for '${requestQuery}'`);
        logger.info(`handling auction request query ${requestQuery}`);

        await launchBrowser();
        const output = await getItemValue(requestQuery);

        const tableString = stringTable.create(output.map(item => ({ name: item.name, price: item.price })));
        await msg.reply(`\`\`\`Matches for '${requestQuery}':\n${tableString}\`\`\``);
        await browser.close();

        await reply?.delete();
        await msg.delete();
        return;
    };
}

module.exports = {
    handleAuctionRequest
};
