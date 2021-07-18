

function getChannelByName(client, channelName) {
    return client.channels.cache.find(channel => channel.name === channelName);
}

module.exports = {
    getChannelByName
};

