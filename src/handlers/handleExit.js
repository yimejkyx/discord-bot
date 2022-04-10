import { timeoutDelMessages } from "../helpers/timeoutDelMessages";
import config from "../../config.json";
const { cmdPrefix } = config;

export async function handleExit(client, msg) {
  const { content } = msg;

  if (content === `${cmdPrefix}exit`) {
    const reply = await msg.channel.send("Idem si to hodit :((");
    await timeoutDelMessages(5000, [reply, msg]);
    process.exit(0);
  }
}
