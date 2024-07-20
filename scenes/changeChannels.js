const { Scenes, Markup } = require("telegraf");

const channelsToSubscribe = [
  { text: "Японский с мичи", url: "https://google.com" },
  { text: "Японский спапа", url: "https://google.com" },
];

const changeChannelsScene = new Scenes.BaseScene("changeChannels");

changeChannelsScene.enter((ctx) => {
  ctx.reply(
    "Выберите канал для подписки или добавьте новый:",
    Markup.keyboard([
      ...channelsToSubscribe.map((channel) => [
        Markup.button.text(channel.text),
      ]),
      [Markup.button.channelRequest("Добавить новый канал", 1)],
    ])
      .oneTime()
      .resize()
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
