require("dotenv").config();
const Admin = require("./models/adminModel");
const { Markup } = require("telegraf");
const Channel = require("./models/channelModel");
const redis = require("./redis");

async function getAllAdmins() {
  try {
    const admins = await Admin.find({});
    return admins;
  } catch (error) {
    console.error("Error fetching admins:", error);
    throw error;
  }
}
const saveLastMessage = async (ctx, message) => {
  const userId = ctx.from.id;
  const redisId = await redis.get(`lastMessageId:${userId}`);
  console.log("USerId", userId, "Ctx", message.message_id, "RedisId", redisId);

  await redis.set(`lastMessageId:${userId}`, message.message_id);
};

const notifyAdmins = async (ctx, message) => {
  for (const adminId of adminIds) {
    try {
      await ctx.telegram.sendMessage(adminId, message);
    } catch (error) {
      console.error(`Failed to send message to admin ${adminId}:`);
    }
  }
};

const mainMenu = async (ctx) => {
  const channels = await Channel.find();
  const channelButtons = channels.map((channel) => [
    Markup.button.callback(channel.title, `channel_${channel._id}`),
  ]);
  const lastMessage = await ctx.reply(
    "Выберите канал для подписки который нужно отредактировать или добавьте новый:",
    Markup.inlineKeyboard([
      ...channelButtons,
      [Markup.button.callback("Добавить новый канал", "add_channel")],
    ])
  );
  await saveLastMessage(ctx, lastMessage);
};

const isTelegramLink = (url) => {
  const telegramChannelRegex =
    /^(https?:\/\/)?(www\.)?(t\.me\/|telegram\.me\/)([a-zA-Z0-9_]{5,}|\+[a-zA-Z0-9_]+)$/;
  return telegramChannelRegex.test(url);
};

module.exports = {
  notifyAdmins,
  getAllAdmins,
  mainMenu,
  isTelegramLink,
  saveLastMessage,
};
