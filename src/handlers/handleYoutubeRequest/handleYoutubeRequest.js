import { handleStop } from "./helpers/handleStop";
import { handlePlay } from "./helpers/handlePlay";

export async function handleYoutubeRequest(client, msg) {
  const { member } = msg;

  if (member) {
    handleStop(client, msg);
    handlePlay(client, msg);
  }
}
