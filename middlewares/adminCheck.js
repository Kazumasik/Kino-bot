require("dotenv").config();

const adminIds = process.env.ADMINS;

const adminCheck = (ctx, next) => {
  if (adminIds.includes(ctx.from.id)) {
    return next();
  } else {
    ctx.scene.enter("search");
  }
};

module.exports = { adminCheck };
