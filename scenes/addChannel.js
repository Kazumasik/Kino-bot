const { Scenes } = require("telegraf");
const fs = require("fs");

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
    const newChannel = ctx.wizard.state.channel;

    // Чтение существующих каналов из .env
    let channels = process.env.CHANNELS ? JSON.parse(process.env.CHANNELS) : [];
    channels.push(newChannel);

    // Запись обновленного списка каналов в .env
    fs.writeFileSync(".env", `CHANNELS=${JSON.stringify(channels)}\n`, {
      flag: "a",
    });

    ctx.reply(`Канал "${newChannel.text}" успешно добавлен!`);
    ctx.scene.leave();
  }
);

module.exports = { addChannelScene };
