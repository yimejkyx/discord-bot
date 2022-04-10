import { logger } from "../../../helpers/logger";
import config from "../../../../config.json";

import { timeoutDelMessages } from "../../../helpers/timeoutDelMessages";
import { VoiceManager } from "../../../VoiceManager";
const { cmdPrefix } = config;

export async function handleStop(client, msg) {
  const { content } = msg;

  if (content !== `${cmdPrefix}stop`) return;

  if (!VoiceManager.lock()) {
    logger.debug("handleStop: lock stop");
    return;
  }

  const reply = await msg.reply("stoping actual video");
  logger.info("handleStop: stop video executed");
  timeoutDelMessages(5000, [reply, msg]);
  await VoiceManager.leave();

  VoiceManager.unlock();
}
