// middlewares/deleteLastMessage.js
const redis = require("../redis");

const deleteLastMessage = async (ctx, next) => {
  const userId = ctx.from.id;
  const lastMessageId = await redis.get(`lastMessageId:${userId}`);
  
  if (lastMessageId) {
    await ctx.deleteMessage(lastMessageId);
    await redis.del(`lastMessageId:${userId}`);
  }
  
  if (ctx?.message) {
    console.log('deleteLastMessage', ctx.message.message_id);
    await ctx.deleteMessage(ctx.message.message_id);
  }
  
  next();
};

module.exports = { deleteLastMessage };
