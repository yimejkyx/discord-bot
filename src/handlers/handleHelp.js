import { timeoutDelMessages } from "../helpers/timeoutDelMessages";
import config from "../../config.json";
const { cmdPrefix } = config;

export async function handleHelp(client, msg) {
  const { content } = msg;

  if (content === `${cmdPrefix}help`) {
    const reply = await msg.reply("Tromiks je retard");
    await timeoutDelMessages(5000, [reply, msg]);
  }
}
