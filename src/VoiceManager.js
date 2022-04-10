import { logger } from "./helpers/logger";

const STOP_SECONDS_OFFSET = 2000;

export class VoiceManager {
  static state = {
    lock: false,
    connection: null,
    stoppingTimeout: null,
  };

  static lock() {
    if (this.state.lock) return false;
    this.state.lock = true;
    logger.debug(`VoiceManager.lock: Lock`);
    return true;
  }

  static unlock() {
    logger.debug(`VoiceManager.unlock: Unlock`);
    this.state.lock = false;
  }

  static isConnected() {
    return this.state.connection;
  }

  static async join(voiceChannel) {
    if (this.isConnected()) throw new Error("Already connected");

    this.state.connection = await voiceChannel.join();
    this.state.connection.on("disconnect", () => {
      logger.info("VoiceManager.join:disconnect event: cleaning connection");
      this.state.connection = null;
      this.leave();
    });
  }

  static async cleanTimeout() {
    if (this.state.stoppingTimeout) {
      logger.debug("VoiceManager.cleanTimeout: clearing timeout in video");
      clearTimeout(this.state.stoppingTimeout);
    }

    this.state.stoppingTimeout = null;
  }

  static async timeoutFn(title) {
    logger.debug(`VoiceManager.play: cleaning audio after playing '${title}'`);
    this.cleanTimeout();
    await this.leave();
  }

  static play(songInfo) {
    if (!this.isConnected()) throw new Error("Missing connection");

    this.state.connection.play(songInfo.song);
    console.log(songInfo);

    // clearing functions
    if (songInfo.videoLength > 0) {
      logger.debug(
        `VoiceManager.play: setting up clean, will clean after ${songInfo.videoLengthMs}ms`
      );
      this.state.stoppingTimeout = setTimeout(
        () => this.timeoutFn(songInfo.title),
        songInfo.videoLengthMs + STOP_SECONDS_OFFSET
      );
    } else {
      // unlimited videos are do not have timeout
      logger.debug(`VoiceManager.play: playing for unlimited`);
    }
  }

  static async leave() {
    try {
      this.cleanTimeout();

      if (this.isConnected()) {
        await this.state.connection?.channel?.leave();
        this.state.connection?.disconnect();
      }
      this.state.connection = null;

      logger.info("VoiceManager.leave: cleaning connection");
    } catch (e) {
      logger.error("VoiceManager.leave: cleaning connection error", e);
    }
  }
}
