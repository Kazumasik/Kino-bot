const { Scenes, Markup } = require("telegraf");



const changeChannelsScene = new Scenes.BaseScene("changeChannels");

changeChannelsScene.enter((ctx) => {
  
  const channelsToSubscribe = JSON.parse(process.env.CHANNELS)
  const channelButtons = channelsToSubscribe.map((channel) =>
    Markup.button.text(channel.text)
  );
  const chunkedButtons = [];
  const buttonsPerRow = 3;
  for (let i = 0; i < channelButtons.length; i += buttonsPerRow) {
    chunkedButtons.push(channelButtons.slice(i, i + buttonsPerRow));
  }

  ctx.reply(
    "Выберите канал для подписки который нужно отредактировать или добавьте новый:",
    Markup.keyboard([
      ...chunkedButtons,
      [Markup.button.channelRequest("Добавить новый канал", 1)]
    ])
      .oneTime(true)
      .resize(true)
  );
});


changeChannelsScene.start((ctx) => {
  ctx.scene.enter("search");
});

changeChannelsScene.on("chat_shared", async (ctx) => {
  console.log(ctx.message);
  ctx.session.channelId = ctx.message.chat_shared.chat_id;
  ctx.scene.enter("addChannel");
});

module.exports = { changeChannelsScene };
