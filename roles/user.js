const { Composer } = require("telegraf");
const userBot = new Composer();
userBot.command("/start", async (ctx) => {
  ctx.reply("🔎 Для поиска отправьте КОД фильма/сериала");
});

module.exports = userBot;
