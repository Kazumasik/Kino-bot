const deleteLastMessage = async (ctx, next) => {
console.log("Deleting last message", ctx.session?.lastMessageId);
  if (ctx.session?.lastMessageId) {
    await ctx.deleteMessage(ctx.session.lastMessageId);
    ctx.session.lastMessageId = null;

  }
  console.log("Deleted last message", ctx.session?.lastMessageId);
  next();
};

module.exports = { deleteLastMessage };
