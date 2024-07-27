const deleteLastMessage = async (ctx, next) => {
  if (ctx.session?.lastMessageId) {
    await ctx.deleteMessage(ctx.session.lastMessageId);
    ctx.session.lastMessageId = null;

  }
  next();
};

module.exports = { deleteLastMessage };
