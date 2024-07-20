const { Scenes } = require("telegraf");
const fs = require("fs");
require("dotenv").config();

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

    // Чтение существующих каналов из .env
    let channels = process.env.CHANNELS ? JSON.parse(process.env.CHANNELS) : [];
    channels.push(newChannel);

    // Запись обновленного списка каналов в .env
    const envData = `
    TELEGRAM_TOKEN = '${process.env.TELEGRAM_TOKEN}'
    ADMINS = ${process.env.ADMINS}
    CHANNELS=${JSON.stringify(channels)}
    `;

    fs.writeFileSync(".env", envData.trim());

    ctx.reply(`Канал "${newChannel.text}" успешно добавлен!`);
    ctx.scene.leave();
  }
);

module.exports = { addChannelScene };
