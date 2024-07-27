const { Composer } = require("telegraf");
const { Scenes, Markup } = require("telegraf");
const adminBot = new Composer();
adminBot.command("change", async (ctx) => {
  // const channelsToSubscribe = ctx.session.channels;
  // const channelButtons = channelsToSubscribe.map((channel) =>
  //   Markup.button.callback(channel.text, `channel_${channel.id}`)
  // );

  // const chunkedButtons = [];
  // const buttonsPerRow = 3;
  // for (let i = 0; i < channelButtons.length; i += buttonsPerRow) {
  //   chunkedButtons.push(channelButtons.slice(i, i + buttonsPerRow));
  // }

  const lastMessage = await ctx.reply(
    "Выберите канал для подписки который нужно отредактировать или добавьте новый:",
    Markup.inlineKeyboard([
      [Markup.button.callback("Добавить новый канал", "add_new_channel")],
    ])
  );
  ctx.session.lastMessageId = lastMessage.message_id;
});

adminBot.action("add_channel", async (ctx) => {
  const lastMessage = await ctx.reply(
    "Отправьте любой пост из канала который нужно добавить.",
    Markup.inlineKeyboard([
      [Markup.button.callback("Вернуться", "back")],
    ])
  );
  ctx.session.lastMessageId = lastMessage.message_id;
});

module.exports = adminBot;
