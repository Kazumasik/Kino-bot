const {Composer} = require("telegraf");
const adminBot = new Composer();
adminBot.command("/change", async (ctx) => {
  const channelsToSubscribe = ctx.session.channels;
  const channelButtons = channelsToSubscribe.map((channel) =>
    Markup.button.callback(channel.text, `channel_${channel.id}`)
  );

  const chunkedButtons = [];
  const buttonsPerRow = 3;
  for (let i = 0; i < channelButtons.length; i += buttonsPerRow) {
    chunkedButtons.push(channelButtons.slice(i, i + buttonsPerRow));
  }

  const lastMessage = await ctx.reply(
    "Выберите канал для подписки который нужно отредактировать или добавьте новый:",
    Markup.inlineKeyboard([
      ...chunkedButtons,
      [Markup.button.callback("Добавить новый канал", "add_new_channel")],
    ])
  );
  ctx.session.lastMessageId = lastMessage.message_id;
});

module.exports = adminBot;  