const { Scenes } = require("telegraf");
require("dotenv").config();
const { readChannelsFromFile, writeChannelsToFile } = require("../utils");

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

    // Запись в переменную
    ctx.session.channels = channels;
    ctx.reply(`Канал "${newChannel.text}" успешно добавлен!`);
    ctx.scene.enter("changeChannels");
  }
);

module.exports = { addChannelScene };
