const { Composer } = require("telegraf");
const userBot = new Composer();
userBot.start( async (ctx) => {
  ctx.reply("🔎 Для поиска отправьте КОД фильма/сериала");
});

module.exports = userBot;
