require("dotenv").config();

// Получаем массив строковых идентификаторов и преобразуем их в числа
const adminIds = process.env.ADMINS.split(' ').map(id => parseInt(id, 10));
const adminCheck = (ctx, next) => {
  if (adminIds.includes(ctx.from.id)) {
    return next();
  } else {
    return;
  }
};

module.exports = { adminCheck };
