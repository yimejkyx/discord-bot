const { logger } = require("./logger");
const { cmdPrefix } = require("../config.json");
const fs = require("fs").promises;

async function readCounter() {
  let file;
  try {
    file = await fs.readFile("./pressCounter.json", "utf8");
    const obj = JSON.parse(file);
    return obj;
  } catch (e) {
    file = JSON.stringify({});
    await fs.writeFile("./pressCounter.json", file, "utf8");
    return {};
  }
}

async function increaseCounter(id) {
  const obj = await readCounter();
  const count = obj[id];
  obj[id] = count ? count + 1 : 1;
  await fs.writeFile("./pressCounter.json", JSON.stringify(obj));
  return [obj[id], Object.values(obj).reduce((s, n) => s + n, 0)];
}

async function handlePressF(client, msg) {
  const { content, member } = msg;

  if (member) {
    const isCommand = content === "f" || content === "F";
    if (isCommand) {
      const { channel } = msg;
      if (channel) {
        // or member.user.username
        const [count, sumCount] = await increaseCounter(member.id);
        const replyString = `${member.displayName} has paid ${count} times their respects, in total ${sumCount} respects`;
        await channel.send(replyString);
      }
    }
  }
}

module.exports = {
  handlePressF,
};
