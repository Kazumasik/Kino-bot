const { Scenes, Markup } = require("telegraf");

const subscribeCheck = new Scenes.BaseScene("subscribeCheck");

subscribeCheck.enter((ctx) => {
  checkSubscription(ctx);
});

subscribeCheck.action("subscribed", (ctx) => checkSubscription(ctx));

const checkSubscription = async (ctx) => {
  const userId = ctx.from.id;
  const notSubscribedChannels = [];
  for (const channel of ctx.session.channels) {
    try {
      const chatMember = await ctx.telegram.getChatMember(channel.id, userId);
      if (chatMember.status === "left" || chatMember.status === "kicked") {
        notSubscribedChannels.push(channel);
      }
    } catch (error) {
      console.error(
        `Error checking subscription for channel ${channel.id}:`,
        error.response.error_code
      );
    }
  }

  if (notSubscribedChannels.length === 0) {
    await ctx.reply("Спасибо за подписку на все каналы!");
  } else {
    const newMessage = await ctx.reply(
      "Чтобы получить названия фильма, подпишитесь на каналы ниже:",
      Markup.inlineKeyboard([
        ...notSubscribedChannels.map((channel) => [
          Markup.button.url(channel.text, channel.url),
        ]),
        [Markup.button.callback("Я подписался", "subscribed")],
      ])
        .oneTime()
        .resize()
    );
    ctx.session.lastMessageId = newMessage.message_id;
  }
};

module.exports = { subscribeCheck };
