const { Scenes, Markup } = require("telegraf");

const changeChannelsScene = new Scenes.BaseScene("changeChannels");

changeChannelsScene.enter((ctx) => {
  const channelsToSubscribe = ctx.session.channels;
  const channelButtons = channelsToSubscribe.map((channel) =>
    Markup.button.callback(channel.text, `channel_${channel.id}`)
  );

  const chunkedButtons = [];
  const buttonsPerRow = 3;
  for (let i = 0; i < channelButtons.length; i += buttonsPerRow) {
    chunkedButtons.push(channelButtons.slice(i, i + buttonsPerRow));
  }

  ctx.reply(
    "Выберите канал для подписки который нужно отредактировать или добавьте новый:",
    Markup.inlineKeyboard([
      ...chunkedButtons,
      [Markup.button.callback("Добавить новый канал", "add_new_channel")],
    ])
  );
});
changeChannelsScene.action(/channel_(.+)/, (ctx) => {
  const channelId = ctx.match[1];
  const channel = ctx.session.channels.find((ch) => {
    console.log(ch.id, channelId);
    return ch.id === +channelId;
  });

  if (channel) {
    ctx.reply(
      `Название: ${channel.text}\nСсылка: ${channel.url}\nID: ${channel.id}`,
      Markup.inlineKeyboard([
        Markup.button.callback("Удалить", `delete_channel_${channel.id}`),
        Markup.button.callback("Изменить", `edit_channel_${channel.id}`),
      ])
    );
  } else {
    ctx.reply("Канал не найден.");
  }
});

changeChannelsScene.action(/delete_channel_(.+)/, (ctx) => {
  const channelId = ctx.match[1];
  ctx.reply(`Канал с ID ${channelId} был удален.`);
});
changeChannelsScene.on("chat_shared", async (ctx) => {
  ctx.session.channelId = ctx.message.chat_shared.chat_id;
  console.log(ctx.message.from.id);
  try {
    // Получаем информацию о статусе бота в чате
    const chatMember = await ctx.getChatMember(
      ctx.message.from.id,
      ctx.message.chat_shared.chat_id
    );
    console.log(chatMember);
  } catch (error) {
    console.error("Error checking bot admin status:", error);
    ctx.reply("Произошла ошибка при проверке статуса администратора.");
  }
  ctx.scene.enter("addChannel");
});

module.exports = { changeChannelsScene };
