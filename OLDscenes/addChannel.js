const { Scenes, Markup } = require("telegraf");
require("dotenv").config();
const {
  readChannelsFromFile,
  writeChannelsToFile,
  addChannel,
} = require("../utils");

const addChannelScene = new Scenes.WizardScene(
  "addChannel",
  (ctx) => {
    ctx.reply(
      "Отправьте канал в бот через кнопку ниже",
      Markup.keyboard([[Markup.button.channelRequest("Отправить канал", 1)]])
        .oneTime()
        .resize()
    );
    ctx.wizard.state.channel = {};
    return ctx.wizard.next();
  },
  async (ctx) => {
    if (ctx.message.chat_shared) {
      console.log(
        "CHATMEMBER",
        ctx.message.chat_shared.chat_id,
        ctx.botInfo.id
      );
      try {
        const chatMember = await ctx.telegram.getChatMember(
          ctx.message.chat_shared.chat_id,
          ctx.botInfo.id
        );
        if (
          chatMember.status !== "administrator" &&
          chatMember.status !== "creator"
        ) {
          ctx.reply("Бот должен быть администратором в канале.");
          return ctx.scene.enter("changeChannels");
        }
      } catch (error) {
        await ctx.reply(
          "Не удалось получить информацию о канале. Пожалуйста, убедитесь, что бот является администратором в канале."
        );
        return ctx.scene.enter("changeChannels");
      }
      ctx.wizard.state.channel.id = ctx.message.chat_shared.chat_id;
      ctx.reply("Введите название для канала:", Markup.removeKeyboard(true));
      return ctx.wizard.next();
    } else {
      ctx.reply("Пожалуйста, отправьте канал.");
      return;
    }
  },
  (ctx) => {
    ctx.wizard.state.channel.text = ctx.message.text;
    ctx.reply("Введите ссылку на канал в формате https://t.me/________:");
    return ctx.wizard.next();
  },
  async (ctx) => {
    const url = ctx.message.text;
    const telegramChannelRegex =
      /^(https?:\/\/)?(www\.)?(t\.me\/|telegram\.me\/)([a-zA-Z0-9_]{5,}|\+[a-zA-Z0-9_]+)$/;

    if (!telegramChannelRegex.test(url)) {
      ctx.reply("Неправильный формат ссылки, должно быть https://t.me/___:");
      return;
    }
    ctx.wizard.state.channel.url = url;

    const newChannel = ctx.wizard.state.channel;

    addChannel(newChannel);

    // Запись в переменную
    ctx.session.channels = [...ctx.session.channels, newChannel];
    await ctx.scene.leave();
  }
);

addChannelScene.leave(async (ctx) => {
  await ctx.scene.enter("changeChannels");
});

module.exports = { addChannelScene };
