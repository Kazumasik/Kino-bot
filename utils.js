const fs = require("fs");
const channelsFilePath = "channels.json";
require("dotenv").config();
const Admin = require('./models/adminModel');

async function getAllAdmins() {
    try {
        const admins = await Admin.find({});
        return admins;
    } catch (error) {
        console.error('Error fetching admins:', error);
        throw error;
    }
}


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

  channels = channels.filter((channel) => channel.id !== +channelId);
  writeChannelsToFile(channels);
};

const updateChannel = (updatedChannel) => {
  let channels = readChannelsFromFile();
  channels = channels.map((ch) =>
    +ch.id === updatedChannel.id ? updatedChannel : ch
  );
  writeChannelsToFile(channels);
};

const notifyAdmins = async (ctx, message) => {
  for (const adminId of adminIds) {
    try {
      await ctx.telegram.sendMessage(adminId, message);
    } catch (error) {
      console.error(`Failed to send message to admin ${adminId}:`);
    }
  }
};
module.exports = {
  readChannelsFromFile,
  writeChannelsToFile,
  addChannel,
  removeChannelById,
  updateChannel,
  notifyAdmins,
  getAllAdmins
};
