const { Scenes, Markup } = require("telegraf");
const { mainMenu, isTelegramLink } = require("../../../utils");
const Channel = require("../../../models/channelModel");
require("dotenv").config();
const addChannel = new Scenes.WizardScene(
  "addChannel",
  async (ctx) => {
    const lastMessage = await ctx.reply(
      "Отправьте любой пост из канала, который нужно добавить.",
      Markup.inlineKeyboard([[Markup.button.callback("Вернуться", "back")]])
    );
    ctx.session.lastMessageId = lastMessage.message_id;
    ctx.wizard.state.newChannel = {};
    ctx.wizard.next();
  },
  async (ctx) => {
    if (
      ctx.message &&
      ctx.message.forward_from_chat &&
      ctx.message.forward_from_chat.type === "channel"
    ) {
      const chatId = ctx.message.forward_from_chat.id;
      console.log("CHATMEMBER", chatId, ctx.botInfo.id);
      try {
        await ctx.telegram.getChatMember(chatId, ctx.botInfo.id);
        ctx.wizard.state.newChannel.id = chatId;
        const lastMessage = await ctx.reply(
          "Введите название для канала.",
          Markup.inlineKeyboard([[Markup.button.callback("Вернуться", "back")]])
        );
        ctx.session.lastMessageId = lastMessage.message_id;
        return ctx.wizard.next();
      } catch (error) {
        const lastMessage = await ctx.reply(
          "Бот не является администратором в канале. Все верно?",
          Markup.inlineKeyboard([
            [Markup.button.callback("Да", "confirm_no_admin")],
            [Markup.button.callback("Нет", "back")],
          ])
        );
        ctx.session.lastMessageId = lastMessage.message_id;
        return;
      }
    } else {
      const lastMessage = await ctx.reply(
        "То, что вы отправили, не является пересланным сообщением из канала. Попробуйте еще раз.",
        Markup.inlineKeyboard([[Markup.button.callback("Вернуться", "back")]])
      );
      ctx.session.lastMessageId = lastMessage.message_id;
      return;
    }
  },
  async (ctx) => {
    if (ctx.message && ctx.message.text) {
      ctx.wizard.state.newChannel.title = ctx.message.text;
      const lastMessage = await ctx.reply(
        "Отправьте ссылку на канал.",
        Markup.inlineKeyboard([[Markup.button.callback("Вернуться", "back")]])
      );
      ctx.session.lastMessageId = lastMessage.message_id;
      return ctx.wizard.next();
    } else {
      const lastMessage = await ctx.reply(
        "Пожалуйста, введите название для канала.",
        Markup.inlineKeyboard([[Markup.button.callback("Вернуться", "back")]])
      );
      ctx.session.lastMessageId = lastMessage.message_id;
      return;
    }
  },
  async (ctx) => {
    if (ctx.message && ctx.message.text && isTelegramLink(ctx.message.text)) {
      ctx.wizard.state.newChannel.url = ctx.message.text;

      // Сохранение канала в базу данных
      const channel = new Channel(ctx.wizard.state.newChannel);
      await channel.save();
      return ctx.scene.leave();
    } else {
      const lastMessage = await ctx.reply(
        "Пожалуйста, отправьте корректную ссылку на канал (например, https://t.me/channel_name).",
        Markup.inlineKeyboard([[Markup.button.callback("Вернуться", "back")]])
      );
      ctx.session.lastMessageId = lastMessage.message_id;
      return;
    }
  }
);
addChannel.action("confirm_no_admin", async (ctx) => {
  ctx.wizard.next();
});
addChannel.action("back", async (ctx) => {
  ctx.scene.leave();
});

addChannel.leave(async (ctx) => {
  mainMenu(ctx);
});

module.exports = { addChannel };
