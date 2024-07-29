const deleteLastMessage = async (ctx, next) => {
  if (ctx.session?.lastMessageId) {
    await ctx.deleteMessage(ctx.session.lastMessageId);
    ctx.session.lastMessageId = null;
  }
  if(ctx?.message){
    console.log('deleteLastMessage', ctx.message.message_id);
    await ctx.deleteMessage(ctx.message.message_id);
  }
  next();
};

module.exports = { deleteLastMessage };
