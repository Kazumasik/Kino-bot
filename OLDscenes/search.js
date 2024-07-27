const { Scenes, Markup } = require("telegraf");
const { adminCheck } = require("../middlewares/adminCheck");
const { readChannelsFromFile } = require("../utils");

const searchScene = new Scenes.BaseScene("search");

searchScene.enter((ctx) => {
  ctx.session.channels = readChannelsFromFile();
  ctx.reply(
    "🔎 Для поиска отправьте КОД фильма/сериала",
    Markup.removeKeyboard(true)
  );
});

searchScene.command("change_channels", adminCheck, (ctx) => {
  ctx.scene.enter("changeChannels");
});

searchScene.on("text", (ctx) => {
  ctx.scene.enter("subscribeCheck")
});

module.exports = { searchScene };
