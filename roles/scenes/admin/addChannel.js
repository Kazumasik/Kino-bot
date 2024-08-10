const { Scenes, Markup } = require("telegraf");
const { mainMenu, isTelegramLink, saveLastMessage } = require("../../../utils");
const Channel = require("../../../models/channelModel");
require("dotenv").config();

const addChannel = new Scenes.WizardScene(
  "addChannel",
  async (ctx) => {
    const lastMessage = await ctx.reply(
      "Отправьте любой пост из канала, который нужно добавить.",
      Markup.inlineKeyboard([[Markup.button.callback("Вернуться", "back")]])
    );
    await saveLastMessage(ctx, lastMessage);
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
      ctx.wizard.state.newChannel.id = chatId;
      ctx.wizard.next();
      return ctx.wizard.steps[ctx.wizard.cursor](ctx);
    } else {
      const lastMessage = await ctx.reply(
        "То, что вы отправили, не является пересланным сообщением из канала. Попробуйте еще раз.",
        Markup.inlineKeyboard([[Markup.button.callback("Вернуться", "back")]])
      );
      await saveLastMessage(ctx, lastMessage);
      return;
    }
  },
  async (ctx) => {
    try {
      await ctx.telegram.getChatMember(ctx.wizard.state.newChannel.id, ctx.botInfo.id);
      ctx.wizard.state.newChannel.isAdmin = true;
      const lastMessage = await ctx.reply(
        "Введите название для канала.",
        Markup.inlineKeyboard([[Markup.button.callback("Вернуться", "back")]])
      );
      await saveLastMessage(ctx, lastMessage);
      return ctx.wizard.next();
    } catch (error) {
      const lastMessage = await ctx.reply(
        "Бот не является администратором в канале. Все верно?",
        Markup.inlineKeyboard([
          [Markup.button.callback("Да", "confirm_no_admin")],
          [Markup.button.callback("Нет", "back")],
        ])
      );
      await saveLastMessage(ctx, lastMessage);
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
      await saveLastMessage(ctx, lastMessage);
      return ctx.wizard.next();
    } else {
      const lastMessage = await ctx.reply(
        "Пожалуйста, введите название для канала.",
        Markup.inlineKeyboard([[Markup.button.callback("Вернуться", "back")]])
      );
      await saveLastMessage(ctx, lastMessage);
      return;
    }
  },
  async (ctx) => {
    if (ctx.message && ctx.message.text && isTelegramLink(ctx.message.text)) {
      ctx.wizard.state.newChannel.url = ctx.message.text;
      const channel = new Channel(ctx.wizard.state.newChannel);
      await channel.save();
      return ctx.scene.leave();
    } else {
      const lastMessage = await ctx.reply(
        "Пожалуйста, отправьте корректную ссылку на канал (например, https://t.me/channel_name).",
        Markup.inlineKeyboard([[Markup.button.callback("Вернуться", "back")]])
      );
      await saveLastMessage(ctx, lastMessage);
      return;
    }
  }
);

addChannel.action("confirm_no_admin", async (ctx) => {
  ctx.wizard.state.newChannel.isAdmin = false;
  ctx.wizard.next();
  return ctx.wizard.steps[ctx.wizard.cursor](ctx);
});

addChannel.action("back", async (ctx) => {
  ctx.scene.leave();
});

addChannel.leave(async (ctx) => {
  mainMenu(ctx);
});

module.exports = { addChannel };
