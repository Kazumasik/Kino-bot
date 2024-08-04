const { Telegraf, Scenes, session, Composer} = require("telegraf");
require("dotenv").config();
const { deleteLastMessage } = require("./middlewares/deleteLastMessage");
const db  = require("./db");
const { addChannel } = require("./roles/scenes/admin/addChannel");
const adminBot = require("./roles/admin");
const userBot = require("./roles/user");
const { updateChannel } = require("./roles/scenes/admin/updateChannel");

const bot = new Telegraf(process.env.TELEGRAM_TOKEN);
const stage = new Scenes.Stage([addChannel, updateChannel]);
bot.use(session());
bot.use(deleteLastMessage);
bot.use(stage.middleware());

const adminIds = process.env.ADMINS.split(' ').map(id => parseInt(id, 10));

bot.use(Composer.acl(adminIds, adminBot));
bot.use(userBot);

db.once("open", () => {
  bot.launch()
});
