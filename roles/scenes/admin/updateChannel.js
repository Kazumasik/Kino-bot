const { Scenes, Markup } = require("telegraf");
const { mainMenu, isTelegramLink, saveLastMessage } = require("../../../utils");
const Channel = require("../../../models/channelModel");
require("dotenv").config();

const updateChannel = new Scenes.WizardScene(
  "updateChannel",
  async (ctx) => {
    const channel = await Channel.findById(ctx.match[1]);

    if (channel) {
      ctx.wizard.state.currentChannel = channel;
      const lastMessage = await ctx.reply(
        `Редактируем канал: ${channel.title}\nВведите новое название или нажмите кнопку, чтобы оставить текущее:`,
        Markup.inlineKeyboard([
          [Markup.button.callback(channel.title, "keep_current")],
          [Markup.button.callback("Вернуться", "back")],
        ])
      );
      await saveLastMessage(ctx, lastMessage);
      return ctx.wizard.next();
    } else {
      const lastMessage = await ctx.reply("Канал не найден.");
      await saveLastMessage(ctx, lastMessage);
      return ctx.scene.leave();
    }
  },
  async (ctx) => {
    if (ctx.message && ctx.message.text) {
      ctx.wizard.state.currentChannel.title = ctx.message.text;
    }
    const lastMessage = await ctx.reply(
      `Введите новую ссылку или нажмите кнопку, чтобы оставить текущую:`,
      Markup.inlineKeyboard([
        [
          Markup.button.callback(
            ctx.wizard.state.currentChannel.url,
            `save_url`
          ),
        ],
        [Markup.button.callback("Вернуться", "back")],
      ])
    );
    await saveLastMessage(ctx, lastMessage);
    return ctx.wizard.next();
  },
  async (ctx) => {
    if (ctx.message && ctx.message.text && isTelegramLink(ctx.message.text)) {
      ctx.wizard.state.currentChannel.url = ctx.message.text;
      await ctx.wizard.state.currentChannel.save();
      return ctx.scene.leave();
    } else {
      const lastMessage = await ctx.reply(
        "Пожалуйста, отправьте корректную ссылку на канал (например, https://t.me/channel_name) или нажмите кнопку, чтобы оставить текущую.",
        Markup.inlineKeyboard([
          [
            Markup.button.callback(
              ctx.wizard.state.currentChannel.url,
              `save_url`
            ),
          ],
          [Markup.button.callback("Вернуться", "back")],
        ])
      );
      await saveLastMessage(ctx, lastMessage);
      return;
    }
  }
);

updateChannel.action("save_url", async (ctx) => {
  await ctx.wizard.state.currentChannel.save();
  ctx.scene.leave();
});

updateChannel.action("back", async (ctx) => {
  ctx.scene.leave();
});

updateChannel.leave(async (ctx) => {
  mainMenu(ctx);
});

module.exports = { updateChannel };
