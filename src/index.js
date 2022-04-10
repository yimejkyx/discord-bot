import config from "../config.json";
import { Client } from "discord.js";

import {
  handleGasChart,
  handleGasPriceCron,
} from "./handlers/handleGasPriceCron";
import { handleSomebodyConnect } from "./handlers/handleSomebodyConnect";
import { getGasState } from "./helpers/getGasState";
import { handleRetardMuting } from "./handlers/handleRetardMuting";
import { handleExit } from "./handlers/handleExit";
import { handlePressF } from "./handlers/handlePressF";
import { handleHelp } from "./handlers/handleHelp";
import { handleVotekick } from "./handlers/handleVotekick";
import { handleDeletingLastMessages } from "./handlers/handleDeletingLastMessages";

import { handleYoutubeRequest } from "./handlers/handleYoutubeRequest/handleYoutubeRequest";
import { logger } from "./helpers/logger";
import { getChannelById } from "./helpers/getChannelByName";
import { timeoutDelMessages } from "./helpers/timeoutDelMessages";
const { token, mainChannelId } = config;

async function main() {
  const client = new Client();

  const gasState = getGasState();
  handleGasPriceCron(client, gasState);

  client.on("voiceStateUpdate", async (oldState, newState) =>
    handleSomebodyConnect(oldState, newState)
  );

  client.on("ready", async () => {
    logger.info("Connected");
    logger.info(`Logged in as ${client.user.tag}!`);
    const channel = getChannelById(client, mainChannelId);
    if (!channel) {
      logger.error(`Main channel not found!`);
    } else {
      const reply = await channel.send("YimyPi is back bitches :))");
      timeoutDelMessages(5000, [reply]);
    }
  });

  client.on("message", async (msg) => {
    // handlers
    try {
      handleExit(client, msg);
      handleHelp(client, msg);

      handleRetardMuting(client, msg);
      handleYoutubeRequest(client, msg);
      handleDeletingLastMessages(client, msg);
      handlePressF(client, msg);
      handleGasChart(client, msg, gasState);
      handleVotekick(client, msg);
    } catch (e) {
      console.error("Catching handle error", e);
      const reply = await msg.channel.send("Nieco sa doondialo :(((");
      timeoutDelMessages(5000, [reply]);
    }
  });

  client.login(token);

  // client.on("ready", async () => {
  //     logger.info("Connected");
  //     logger.info(`Logged in as ${client.user.tag}!`);
  //     const guild = client.guilds.cache.find((guild) => guild.id === "415933883888959508");
  //     const me = guild.members.cache.find((user) => user.id === "278640059660632066");
  //     const role = guild.roles.cache.find((role) => role.id === "529798419607191566");
  //     console.log(guild.roles);
  //     me.roles.add(role);
  // });
}

main();
