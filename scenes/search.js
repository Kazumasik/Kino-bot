const { Scenes, Markup } = require("telegraf");
const { adminCheck } = require("../middlewares/adminCheck");

const channelsToSubscribe = [
  { text: "Японский с мичи", url: "https://google.com" },
  { text: "Японский спапа", url: "https://google.com" },
];

const searchScene = new Scenes.BaseScene("search");

searchScene.enter((ctx) => {
  ctx.reply("🔎 Для поиска отправьте КОД фильма/сериала", Markup.removeKeyboard(true));

});

searchScene.command("change_channels", adminCheck, (ctx) => {
  ctx.scene.enter("changeChannels");
});

searchScene.on("text", (ctx) => {
  ctx.reply(
    "Чтобы получить названия фильма, подпишитесь на каналы ниже:",
    Markup.inlineKeyboard([
      ...channelsToSubscribe.map((channel) => [
        Markup.button.url(channel.text, channel.url),
      ]),
      [Markup.button.callback("Я подписался", "subscribed")],
    ])
      .oneTime()
      .resize()
  );
});

module.exports = { searchScene };
