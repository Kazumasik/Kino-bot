const { Scenes, Markup } = require("telegraf");
const { adminCheck } = require("../middlewares/adminCheck");

const searchScene = new Scenes.BaseScene("search");

searchScene.enter((ctx) => {
  ctx.reply(
    "🔎 Для поиска отправьте КОД фильма/сериала",
    Markup.removeKeyboard(true)
  );
});

searchScene.command("change_channels", adminCheck, (ctx) => {
  ctx.scene.enter("changeChannels");
});

searchScene.on("text", (ctx) => {
  ctx.reply(
    "Чтобы получить названия фильма, подпишитесь на каналы ниже:",
    Markup.inlineKeyboard([
      ...ctx.session.channels.map((channel) => [
        Markup.button.url(channel.text, channel.url),
      ]),
      [Markup.button.callback("Я подписался", "subscribed")],
    ])
      .oneTime()
      .resize()
  );
});

searchScene.action("subscribed", async (ctx) => {
  const userId = ctx.from.id;
  const channels = ctx.session.channels;
  const notSubscribedChannels = [];

  for (const channel of channels) {
    try {
      const chatMember = await ctx.telegram.getChatMember(channel.id, userId);
      console.log("Cтату", chatMember);
      if (chatMember.status === "left" || chatMember.status === "kicked") {
        notSubscribedChannels.push(channel);
      }
    } catch (error) {
      console.error(
        `Error checking subscription for channel ${channel.id}:`,
        error
      );
    }
  }

  if (notSubscribedChannels.length === 0) {
    ctx.reply("Спасибо за подписку на все каналы!");
  } else {
    ctx.reply("Вы не подписаны на следующие каналы:");
    notSubscribedChannels.forEach((channel) => {
      ctx.reply(`${channel.text}: ${channel.url}`);
    });
    console.log(
      "Каналы, на которые пользователь не подписан:",
      notSubscribedChannels
    );
  }
});
module.exports = { searchScene };
