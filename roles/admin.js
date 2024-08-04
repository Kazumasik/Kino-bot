const { Composer, Markup } = require("telegraf");
const adminBot = new Composer();
const { mainMenu, saveLastMessage } = require("../utils");
const Channel = require("../models/channelModel");

adminBot.command("change", async (ctx) => {
  mainMenu(ctx);
});

adminBot.action("back", async (ctx) => {
  mainMenu(ctx);
});

adminBot.action("add_channel", async (ctx) => {
  ctx.scene.enter("addChannel");
});

adminBot.action(/channel_(.+)/, async (ctx) => {
  const channelId = ctx.match[1]; // Извлечение ID канала из действия
  const channel = await Channel.findById(channelId);
  const lastMessage = await ctx.reply(
    `Информация о канале:\nНазвание: ${channel.title}\nСсылка: ${channel.url}`,
    Markup.inlineKeyboard([
      [
        Markup.button.callback("Удалить", `delete_${channelId}`),
        Markup.button.callback("Изменить", `update_${channelId}`),
      ],
      [Markup.button.callback("Вернуться", `back`)],
    ])
  );
  await saveLastMessage(ctx, lastMessage);
});

adminBot.action(/delete_(.+)/, async (ctx) => {
  const channelId = ctx.match[1];
  await Channel.findByIdAndDelete(channelId);
  mainMenu(ctx);
});

adminBot.action(/update_(.+)/, async (ctx) => {
  ctx.scene.enter("updateChannel", { match: ctx.match });
});

module.exports = adminBot;
