const { Scenes } = require("telegraf");
const fs = require("fs");
require("dotenv").config();
const { message } require 'telegraf/filters'

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

const addChannelScene = new Scenes.WizardScene(
  "addChannel",
  (ctx) => {
    ctx.reply("Введите название канала:");
    ctx.wizard.state.channel = {};
    return ctx.wizard.next();
  },
  (ctx) => {
    ctx.wizard.state.channel.text = ctx.message.text;
    ctx.reply("Введите ссылку на канал:");
    return ctx.wizard.next();
  },
  (ctx) => {
    ctx.wizard.state.channel.url = ctx.message.text;
    ctx.wizard.state.channel.id = ctx.session.channelId;

    const newChannel = ctx.wizard.state.channel;

    // Чтение существующих каналов из файла
    let channels = readChannelsFromFile();
    channels.push(newChannel);

    // Запись обновленного списка каналов в файл
    writeChannelsToFile(channels);

    ctx.reply(`Канал "${newChannel.text}" успешно добавлен!`);
    ctx.scene.enter('changeChannels');
  }
);

module.exports = { addChannelScene };
