const fs = require("fs");
const channelsFilePath = "channels.txt";
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
module.exports = { writeChannelsToFile, readChannelsFromFile };
