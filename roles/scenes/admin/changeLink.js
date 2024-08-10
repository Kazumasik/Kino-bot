const { Scenes, Markup } = require("telegraf");
const { mainMenu, saveLastMessage } = require("../../../utils");
const Link = require("../../../models/linkModel");
const { isTelegramLink } = require("../../../utils");
const changeLink = new Scenes.BaseScene("changeLink");

changeLink.enter(async (ctx) => {
  const link = await Link.findById("link");
  const lastMessage = await ctx.reply(`
    Текущая ссылка: ${link.customLink}\nПожалуйста, введите новую ссылку:`);
  await saveLastMessage(ctx, lastMessage);
});

changeLink.on("text", async (ctx) => {
  const newLink = ctx.message.text;
  if (!isTelegramLink(newLink)) {
    const lastMessage = await ctx.reply(
      "Пожалуйста, отправьте корректную ссылку на канал (например, https://t.me/channel_name) или нажмите Вернуться, чтобы оставить текущую.",
      Markup.inlineKeyboard([[Markup.button.callback("Вернуться", "back")]])
    );
    await saveLastMessage(ctx, lastMessage);
  } else {
    await Link.findOneAndUpdate({ customLink: newLink }, { upsert: true });

    mainMenu(ctx);
    await ctx.scene.leave();
  }
});

changeLink.action("back", async (ctx) => {
  mainMenu(ctx);
  ctx.scene.leave();
});
module.exports = { changeLink };
