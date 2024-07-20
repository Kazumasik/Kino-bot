require("dotenv").config();

class BotHandlers {
  constructor(bot, channelsToSubscribe) {
    this.bot = bot;
    this.channelsToSubscribe = channelsToSubscribe;

  }

  async handleStart(chatId, from) {
    await this.bot.sendMessage(
      chatId,
      `Привет, ${from.first_name}. Чтобы получить названия фильма, подпишись на каналы ниже:`,
      {
        reply_markup: {
          inline_keyboard: [
            ...this.channelsToSubscribe.map((channel) => [
              { text: channel.text, url: channel.url },
            ]),
            [{ text: "Я подписался", callback_data: "subscribed" }],
          ],
        },
      }
    );
  }
  async handleChangeChannels(chatId) {
    await this.bot.sendMessage(
      chatId,
      `Тут можно изменить каналы для обязательной подписки`,
      {
        reply_markup: {
          keyboard: [
            [
              ...this.channelsToSubscribe.map((channel) => ({
                text: channel.text,
              })),
            ],
            [
              {
                text: "Добавить новый канал",
                request_chat: { request_id: 1, chat_is_channel: true },
              },
            ],
          ],
          resize_keyboard: true,
          one_time_keyboard: true,
        },
      }
    );
  }

  async handleCode(chatId, from) {
    await this.bot.sendMessage(
      chatId,
      `Привет, ${from.first_name}. Чтобы получить названия фильма, подпишись на каналы ниже:`,
      {
        reply_markup: {
          inline_keyboard: [
            ...this.channelsToSubscribe.map((channel) => [
              { text: channel.text, url: channel.url },
            ]),
            [{ text: "Я подписался", callback_data: "subscribed" }],
          ],
        },
      }
    );
  }

  async handleSubscription(query) {
    const chatId = query.message.chat.id;
    const checkSubscription = await this.bot.getChatMember(
      -1002109858898,
      query.from.id
    );

    if (
      checkSubscription.status === "left" ||
      checkSubscription.status === "kicked"
    ) {
      await this.bot.sendMessage(
        chatId,
        "Вы не подписаны на все каналы. Подпишитесь на все каналы и нажмите кнопку еще раз."
      );
    } else {
      await this.bot.sendMessage(
        chatId,
        "Вы подписаны на все каналы. Теперь вы можете получить названия фильмов.",
        {
          reply_markup: {
            inline_keyboard: [
              ...this.channelsToSubscribe.map((channel) => [
                { text: channel.text, url: channel.url },
              ]),
              [{ text: "Канал с кодами", url: "https://t.me/topor" }],
            ],
          },
        }
      );
    }

    this.bot.answerCallbackQuery(query.id);
  }
}

module.exports = BotHandlers;
