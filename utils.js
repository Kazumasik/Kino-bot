const fs = require("fs");
const channelsFilePath = "channels.json";

const readChannelsFromFile = () => {
  if (fs.existsSync(channelsFilePath)) {
    const fileContent = fs.readFileSync(channelsFilePath, "utf-8");
    if (fileContent.trim().length > 0) {
      return JSON.parse(fileContent);
    }
  }
  return [];
};

const writeChannelsToFile = (channels) => {
  fs.writeFileSync(channelsFilePath, JSON.stringify(channels, null, 2));
};

const addChannel = (channel) => {
  const channels = readChannelsFromFile();
  channels.push(channel);
  writeChannelsToFile(channels);
};

const removeChannelById = (channelId) => {
  let channels = readChannelsFromFile();

  channels = channels.filter(channel =>
    channel.id !== +channelId);
  writeChannelsToFile(channels);
};


const updateChannel = (updatedChannel) => {
  let channels = readChannelsFromFile();
  channels = channels.map((ch) => (+ch.id === updatedChannel.id ? updatedChannel : ch));
  writeChannelsToFile(channels);
};
module.exports = { readChannelsFromFile, writeChannelsToFile, addChannel, removeChannelById, updateChannel };
