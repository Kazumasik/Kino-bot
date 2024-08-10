// middlewares/deleteLastMessage.js
const redis = require("../redis");

const deleteLastMessage = async (ctx, next) => {
  const userId = ctx.from.id;
  const lastMessageId = await redis.get(`lastMessageId:${userId}`);

  if (lastMessageId) {
    try {
      await ctx.deleteMessage(lastMessageId);
    } catch (e) {
      console.error(e);
    }
    try {
      await redis.del(`lastMessageId:${userId}`);
    } catch (e) {
      console.error(e);
    }
  }

  if (ctx?.message) {
    await ctx.deleteMessage(ctx.message.message_id);
  }

  next();
};

module.exports = { deleteLastMessage };
