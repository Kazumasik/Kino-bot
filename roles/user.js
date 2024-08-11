const { Composer, Markup } = require("telegraf");
const Channel = require("../models/channelModel");
const Link = require("../models/linkModel");
const { saveLastMessage } = require("../utils");
const adminBot = require("./admin");
const { notifyAdmins } = require("../utils");
const userBot = new Composer();

userBot.start(async (ctx) => {
  await ctx.reply(
    "🔎 Для поиска отправьте КОД фильма/сериала"
  );
});

userBot.on("text", async (ctx) => {
  await sendChannelList(ctx);
});

userBot.action("subscribed", async (ctx) => {
  const userId = ctx.from.id;
  const channels = await Channel.find({});

  const remainingChannels = [];

  for (const channel of channels) {
    if (channel.isAdmin) {
      try {
        const member = await ctx.telegram.getChatMember(channel.id, userId);
        if (["member", "administrator", "creator"].includes(member.status)) {
          continue;
        } else {
          remainingChannels.push(channel);
        }
      } catch (error) {
        // Обновление статуса канала в базе данных
        await Channel.updateOne(
          { _id: channel._id },
          { $set: { isAdmin: false } }
        );

        // Уведомление всех администраторов
        const message = `⚠️ Бот был удален из администраторов канала ${
          channel.title || channel.id
        } и теперь не может проверять подписку.`;
        await notifyAdmins(message, ctx);

        // Добавление канала в список для повторной проверки позже
        continue;
      }
    }
  }

  if (remainingChannels.length > 0) {
    await sendChannelList(ctx, remainingChannels);
  } else {
    const linkDoc = await Link.findById("link");
    const lastMessage = await ctx.reply(
      `Спасибо за подписку на все каналы! В этом канале вы сможете получить название фильма: ${linkDoc.customLink}`
    );
    await saveLastMessage(ctx, lastMessage);
  }
});

async function sendChannelList(ctx, channels) {
  if (!channels) {
    channels = await Channel.find({});
  }

  const buttons = [];
  for (let i = 0; i < channels.length; i += 2) {
    const row = [];
    if (channels[i]) {
      row.push(Markup.button.url(channels[i].title, channels[i].url));
    }
    if (channels[i + 1]) {
      row.push(Markup.button.url(channels[i + 1].title, channels[i + 1].url));
    }
    buttons.push(row);
  }

  buttons.push([Markup.button.callback("Я подписался", "subscribed")]);

  const lastMessage = await ctx.reply(
    "📝 Для получения названия фильма, вы должны быть подписаны на наши каналы:",
    Markup.inlineKeyboard(buttons)
  );
  await saveLastMessage(ctx, lastMessage);
}

module.exports = userBot;
