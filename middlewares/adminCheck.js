require("dotenv").config();

const adminIds = JSON.parse(process.env.ADMINS);

const adminCheck = (ctx, next) => {
  if (adminIds.includes(ctx.from.id)) {
    return next();
  } else {
    ctx.reply("У вас нет прав для использования этой команды.");
  }
};

module.exports = { adminCheck };
