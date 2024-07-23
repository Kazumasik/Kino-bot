const { Scenes, Markup } = require("telegraf");
const { readChannelsFromFile, removeChannelById } = require("../utils");

const changeChannelsScene = new Scenes.BaseScene("changeChannels");

changeChannelsScene.enter((ctx) => {
  ctx.session.channels = readChannelsFromFile()
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
    return ch.id === +channelId;
  });

  if (channel) {
    ctx.reply(
      `Название: ${channel.text}\nСсылка: ${channel.url}\nID: ${channel.id}`,
      Markup.inlineKeyboard([[
        Markup.button.callback("Удалить", `delete_${channel.id}`),
        Markup.button.callback("Изменить", `edit_${channel.id}`),

      ], [Markup.button.callback("Вернуться", `back`)]])
    );
  } else {
    ctx.reply("Канал не найден.");
  }
});

changeChannelsScene.action(/delete_(.+)/, (ctx) => {
  const channelId = ctx.match[1];
  removeChannelById(channelId)
  ctx.reply(`Канал с ID ${channelId} был удален.`);
  ctx.scene.enter('changeChannels')
});
changeChannelsScene.action('add_new_channel', (ctx) => {
  ctx.scene.enter("addChannel");
});
changeChannelsScene.action('back', (ctx) => {
  ctx.scene.enter("changeChannels");
});

module.exports = { changeChannelsScene };
