const puppeteer = require("puppeteer");
const stringTable = require("string-table");
const { logger } = require("../../../helpers/logger");
const { enchRecipes, alchRecipes, leatRecipes } = require("./recipes");
const mapLimit = require("async/mapLimit");

const config = require("../../../../config.json");
const { cmdPrefix } = config;

const formater = {
  typeFormatters: {
    number: function (value, header) {
      return value.toFixed(2);
    },
  },
};

async function openOribosPage(browser) {
  const page = await browser.newPage();
  await page.goto("https://oribos.exchange", { waitUntil: "networkidle2" });
  await page.select("div.search-bar select", "549");
  return page;
}

async function getItemValue(input, browser) {
  const page = await openOribosPage(browser);
  logger.debug(`paged opened done: ${input}`);

  try {
    const resetBtn = await page.$(
      "div.search-bar div.text-container div.text-reset"
    );
    await resetBtn.click();
  } catch (e) {}

  await page.type("div.search-bar div.text-container input", input);
  await page.keyboard.press("Enter");

  const tableSelector = "div.search-result-target table tbody";

  let found = false;
  try {
    const pricePromise = page
      .waitForSelector(`${tableSelector} tr td.price`, { timeout: 0 })
      .then(() => true);
    const noResultPromise = page
      .waitForSelector(`${tableSelector} tr.message`, { timeout: 30 * 1000 })
      .then(() => false);
    found = await Promise.race([pricePromise, noResultPromise]);
  } catch (err) {
    console.log("DEBUG EROR", err);
    throw err;
  }

  if (found) {
    const table = await page.$(tableSelector);
    const data = await table.evaluate((ele) => {
      const rows = Array.from(ele.querySelectorAll("tr"));
      return rows.map((tr) => {
        let name = "Unknown";
        try {
          name = tr.querySelector("td.name span").textContent;
        } catch (error) {}

        let gold = 0;
        try {
          gold = tr
            .querySelector("td.price span span.gold")
            .textContent.split(",")
            .join("");
        } catch (error) {}

        let silver = 0;
        try {
          silver = tr
            .querySelector("td.price span span.silver")
            .textContent.split(",")
            .join("");
        } catch (error) {}
        const price = Number.parseInt(gold) + Number.parseInt(silver) / 100;

        return {
          name,
          price,
        };
      });
    });

    await page.close();
    return data.map((obj) => ({ ...obj, inputName: input }));
  }

  await page.close();
  return [];
}

async function getPrices(items, browser, updateFn = () => {}) {
  return mapLimit(items, 5, async (item) => {
    const results = await getItemValue(item.name, browser);
    await updateFn(item.name, results);

    if (item.isExact)
      return results.find(
        (result) => result.name.toLowerCase() === item.name.toLowerCase()
      );
    return results[0];
  });
}

async function launchBrowser() {
  let browser;
  try {
    logger.info("Launching puppeteer");
    browser = await puppeteer.launch({ headless: false });
  } catch (err) {
    browser = null;
    logger.error(`Launching puppeteer error: ${err}`);
  }

  if (!browser) {
    logger.info("Launching puppeteer with TOR");

    try {
      const args = [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--proxy-server=socks5://127.0.0.1:9050",
      ];
      browser = await puppeteer.launch({
        headless: true,
        executablePath: "chromium-browser",
        args,
      });

      const page = await browser.newPage();
      await page.goto("https://check.torproject.org/");
      const isUsingTor = await page.$eval("body", (el) =>
        el.innerHTML.includes(
          "Congratulations. This browser is configured to use Tor"
        )
      );
      await page.close();
      logger.info(`Tor status ${isUsingTor}`);
    } catch (err) {
      browser = null;
      logger.error(`Launching browser error: ${err}`);
    }
  }

  return browser;
}

function getItemsFromRecipes(recipes) {
  const items = recipes.reduce(
    (arr, recipe) => [
      ...arr,
      {
        name: recipe.name,
        isExact: !!recipe.isExact,
      },
      ...recipe.ingredients.map((ing) => ({
        name: ing.name,
        isExact: !!ing.isExact,
      })),
    ],
    []
  );
  return items.filter((v, i, a) => a.findIndex((t) => t.name === v.name) === i);
}

async function fetchAllRecipes(recipes, updateFn = () => {}) {
  const browser = await launchBrowser();
  if (!browser) {
    logger.error("Missing browser :(");
    throw new Error("Missing browser");
  }

  const items = getItemsFromRecipes(recipes);
  logger.debug(`getting prices: ${items}`);

  let prices = [];
  try {
    prices = await getPrices(items, browser, updateFn);
  } catch (error) {
    await browser.close();
    throw error;
  }

  const pricesObj = prices.reduce(
    (obj, item) => ({ ...obj, [item.name]: item.price }),
    {}
  );
  const recipesProfit = recipes.map((item) => {
    const key = Object.keys(pricesObj).find((name) =>
      name.toLowerCase().includes(item.name.toLowerCase())
    );
    const sellPrice = pricesObj[key];
    const sellPrice95 = sellPrice * 0.95;

    const craftPrice = item.ingredients.reduce((price, ing) => {
      const ingKey = Object.keys(pricesObj).find((name) =>
        name.toLowerCase().includes(ing.name.toLowerCase())
      );
      return price + ing.count * pricesObj[ingKey];
    }, 0);
    const percents95 = (sellPrice95 / craftPrice - 1) * 100;
    const percents = (sellPrice / craftPrice - 1) * 100;

    return {
      name: item.name,
      profit: `${(sellPrice95 - craftPrice).toFixed(2)} (${(
        sellPrice - craftPrice
      ).toFixed(2)})`,
      percents: `${percents95.toFixed(2)}% (${percents.toFixed(2)}%)`,
      craftPrice,
      sellPrice: `${sellPrice95.toFixed(2)} (${sellPrice.toFixed(2)})`,
    };
  });

  // console.log("hello", pricesObj);
  logger.debug("showing recipes and items prices");
  console.table(prices);
  console.table(recipesProfit);
  await browser.close();

  return {
    prices: stringTable.create(
      prices.map((item) => ({ name: item.name, price: item.price })),
      formater
    ),
    recipes: stringTable.create(recipesProfit, formater),
  };
}

async function requestItem(requestQuery, msg) {
  const browser = await launchBrowser();
  const output = await getItemValue(requestQuery, browser);

  if (output.length <= 0) {
    await msg.reply(`No Matches for '${requestQuery}'`);
  } else {
    await msg.reply(`Matches for '${requestQuery}':`);
    let pagination = 1;
    await output.slice(0, 50).reduce(async (acc, item, index) => {
      const parsedAcc = await acc;

      if ((index + 1) % 25 === 0 || index + 1 === output.length) {
        const tableString = stringTable.create(
          [...parsedAcc, item].map((item) => ({
            name: item.name,
            price: item.price,
          })),
          formater
        );
        await msg.channel.send(
          `\`\`\`Page ${pagination} for '${requestQuery}':\n${tableString}\`\`\``
        );
        pagination++;
        return [];
      }

      return [...parsedAcc, item];
    }, new Promise((resolve, reject) => resolve([])));
  }
  await browser.close();
}

async function handleAuctionRequest(client, msg) {
  const { content, member } = msg;

  if (!member) return;
  if (content.startsWith(`${cmdPrefix}ah p `)) {
    const split = content.replace(/\s\s+/g, " ").split(" ");
    if (split.length < 3) return;

    const [, , typeRecipes] = split;
    let recipes;
    switch (typeRecipes) {
      case "ench": {
        recipes = enchRecipes;
        break;
      }
      case "alch": {
        recipes = alchRecipes;
        break;
      }
      case "leat": {
        recipes = leatRecipes;
        break;
      }
      default: {
        recipes = [...enchRecipes, ...alchRecipes, ...leatRecipes];
      }
    }

    logger.info("handling auction request");
    const items = getItemsFromRecipes(recipes);
    const reply = await msg.channel.send(
      `Fetching profit '${typeRecipes}' recipes: 0/${items.length}`
    );

    let itemsDone = 0;
    const updateFn = async () => {
      itemsDone += 1;
      await reply.edit(
        `Fetching profit '${typeRecipes}' recipes: ${itemsDone}/${items.length}`
      );
    };

    let tables = [];
    try {
      tables = await fetchAllRecipes(recipes, updateFn);
    } catch (error) {
      await reply.delete();
      return;
    }

    await msg.reply(`\`\`\`\n${tables.prices}\`\`\``);
    await msg.reply(`\`\`\`\n${tables.recipes}\`\`\``);

    await reply?.delete();
    await msg.delete();
    return;
  }

  if (content.startsWith(`${cmdPrefix}ah `)) {
    const split = content.replace(/\s\s+/g, " ").split(" ");
    if (split.length < 2) return;
    const [, ...stringRequest] = split;
    const requestQuery = stringRequest.join(" ");

    try {
      const reply = await msg.channel.send(
        `Fetching auction for '${requestQuery}'`
      );
      logger.info(`handling auction request query ${requestQuery}`);
      await requestItem(requestQuery, msg);

      await reply?.delete();
      await msg.delete();
    } catch (err) {
      logger.info("error in auction handling", err);
      const reply = await msg.channel.send("Nieco sa doondialo :(((");
      setTimeout(() => reply?.delete(), 5000);
    }
  }
}

module.exports = {
  handleAuctionRequest,
};
