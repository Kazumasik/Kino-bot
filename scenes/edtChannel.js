const { Scenes, Markup } = require("telegraf");
require("dotenv").config();
const { updateChannel } = require("../utils");

const editChannelScene = new Scenes.WizardScene(
  "editChannel",
  (ctx) => {
    const channel = ctx.scene.state.channel;
    ctx.wizard.state.channel = channel;

    ctx.reply(
      `Редактируем канал: ${channel.text}\nВведите новое название (или нажмите кнопку, чтобы оставить текущее):`,
      Markup.keyboard([
        [Markup.button.text(channel.text)],
      ])
        .oneTime()
        .resize()
    );
    return ctx.wizard.next();
  },
  (ctx) => {
    if (ctx.message.text === ctx.wizard.state.channel.text) {
      ctx.wizard.state.channel.text = ctx.message.text;
    } else {
      ctx.wizard.state.channel.text = ctx.message.text;
    }
    ctx.reply(
      `Введите новую ссылку (или нажмите кнопку, чтобы оставить текущую):`,
      Markup.keyboard([
        [Markup.button.text(ctx.wizard.state.channel.url)],
      ])
        .oneTime()
        .resize()
    );
    return ctx.wizard.next();
  },
  async (ctx) => {
    if (ctx.message.text === ctx.wizard.state.channel.url) {
      ctx.wizard.state.channel.url = ctx.message.text;
    } else {
      const url = ctx.message.text;
      const telegramChannelRegex = /^(https?:\/\/)?(www\.)?(t\.me\/|telegram\.me\/)([a-zA-Z0-9_]{5,}|\+[a-zA-Z0-9_]+)$/;

      if (!telegramChannelRegex.test(url)) {
        ctx.reply('Неправильный формат ссылки, должно быть https://t.me/___:');
        return;
      }

      ctx.wizard.state.channel.url = url;
    }

    const updatedChannel = ctx.wizard.state.channel;

    updateChannel(updatedChannel);

    // Обновление канала в сессии
    ctx.session.channels = ctx.session.channels.map((ch) =>
      ch.id === updatedChannel.id ? updatedChannel : ch
    );

    await ctx.reply(`Канал "${updatedChannel.text}" успешно обновлен!`);
    await ctx.scene.enter("changeChannels");
  }
);

module.exports = { editChannelScene };
