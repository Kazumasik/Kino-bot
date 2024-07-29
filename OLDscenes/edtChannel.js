const { Scenes, Markup } = require("telegraf");
const { mainMenu, isTelegramLink } = require("../../../utils");
const Channel = require("../../../models/channelModel");
require("dotenv").config();

const updateChannel = new Scenes.WizardScene(
  "updateChannel",
  async (ctx) => {
    ctx.wizard.state.channelId = ctx.match[1]; // Извлечение ID канала из действия
    const channel = await Channel.findById(ctx.wizard.state.channelId);

    if (channel) {
      ctx.wizard.state.currentChannel = channel;
      await ctx.reply(
        `Редактируем канал: ${channel.title}\nВведите новое название (или нажмите кнопку, чтобы оставить текущее):`,
        Markup.keyboard([
          [Markup.button.text(channel.title)],
        ])
          .oneTime()
          .resize()
      );
      return ctx.wizard.next();
    } else {
      await ctx.reply("Канал не найден.");
      return ctx.scene.leave();
    }
  },
  async (ctx) => {
    if (ctx.message && ctx.message.text) {
      ctx.wizard.state.currentChannel.title = ctx.message.text;
      await ctx.reply(
        `Редактируем канал: ${ctx.wizard.state.currentChannel.title}\nВведите новую ссылку (или нажмите кнопку, чтобы оставить текущую):`,
        Markup.keyboard([
          [Markup.button.text(ctx.wizard.state.currentChannel.url)],
        ])
          .oneTime()
          .resize()
      );
      return ctx.wizard.next();
    } else {
      await ctx.reply(
        "Пожалуйста, введите название для канала или нажмите кнопку с текущим названием.",
        Markup.keyboard([
          [Markup.button.text(ctx.wizard.state.currentChannel.title)],
        ])
          .oneTime()
          .resize()
      );
      return;
    }
  },
  async (ctx) => {
    if (ctx.message && ctx.message.text && isTelegramLink(ctx.message.text)) {
      ctx.wizard.state.currentChannel.url = ctx.message.text;

      // Сохранение изменений канала в базу данных
      await ctx.wizard.state.currentChannel.save();
      await ctx.reply("Канал успешно обновлен!");
      return ctx.scene.leave();
    } else {
      await ctx.reply(
        "Пожалуйста, отправьте корректную ссылку на канал (например, https://t.me/channel_name) или нажмите кнопку с текущей ссылкой.",
        Markup.keyboard([
          [Markup.button.text(ctx.wizard.state.currentChannel.url)],
        ])
          .oneTime()
          .resize()
      );
      return;
    }
  }
);


updateChannel.leave(async (ctx) => {
  mainMenu(ctx);
});

module.exports = { updateChannel };
