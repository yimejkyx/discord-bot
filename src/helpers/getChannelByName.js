export function getChannelByName(client, channelName) {
  return client.channels.cache.find((channel) => channel.name === channelName);
}

export function getChannelById(client, channelId) {
  return client.channels.cache.find(
    (channel) => channel.id.toString() === channelId.toString()
  );
}
