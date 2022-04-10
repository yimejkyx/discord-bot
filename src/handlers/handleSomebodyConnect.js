import path from "path";
import { fileURLToPath } from "url";

import { logger } from "../helpers/logger";
import { VoiceManager } from "../VoiceManager";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const majoId = "246927069127114754";
const guildId = "415933883888959508";

export async function handleSomebodyConnect(oldState, newState) {
  const { guild, member } = oldState;

  if (!guild || !member) return;
  if (guild.id.toString() !== guildId.toString()) return;
  logger.debug(
    `handleSomebodyConnect: user connected: ${member?.id}, ${majoId}`
  );
  if (member?.id.toString() !== majoId.toString()) return;

  // user was not connected, now he is
  logger.debug(
    `handleSomebodyConnect: majo connected to some channel, ${oldState.channelID}, ${newState.channelID}`
  );
  if (oldState.channelID === null && newState.channelID !== null) {
    const { voice } = newState.member;

    if (!VoiceManager.lock()) return;

    // if user does not have channel or if bot is connected in some channel
    if (!voice.channel || VoiceManager.isConnected()) {
      VoiceManager.unlock();
      return;
    }

    try {
      const songInfo = {
        title: "Tokok Ojam",
        videoLength: 4,
        videoLengthMs: 4000,
        song: path.join(__dirname, "../assets/tokok-ojam.mp3"),
      };

      await VoiceManager.join(voice.channel);
      VoiceManager.play(songInfo);
    } catch (err) {
      await VoiceManager.leave();
      logger.error(`handleSomebodyConnect:error: got error, ${err}`);
    }

    VoiceManager.unlock();
  }
}
