require("dotenv").config();

class BotHandlers {
  constructor(bot, channelsToSubscribe) {
    this.bot = bot;
    this.channelsToSubscribe = channelsToSubscribe;
    this.awaitingChannelDetails = {};
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
  async requestChannelDetails(chatId, channelId) {
    this.awaitingChannelDetails[chatId] = { channelId, step: 1 };
    await this.bot.sendMessage(chatId, "Пожалуйста, отправьте название канала.");
  }

  async handleChannelDetailsResponse(chatId, userId, text) {
    const userState = this.awaitingChannelDetails[chatId];
    if (userState.step === 1) {
      userState.name = text;
      userState.step = 2;
      await this.bot.sendMessage(chatId, "Теперь отправьте ссылку-приглашение на канал.");
    } else if (userState.step === 2) {
      const urlPattern = new RegExp('^(https?:\\/\\/)?' + // validate protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*).)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator

      if (urlPattern.test(text)) {
        userState.url = text;
        this.channelsToSubscribe.push({
          text: userState.name,
          url: userState.url
        });
        delete this.awaitingChannelDetails[chatId];
        await this.bot.sendMessage(chatId, "Канал успешно добавлен!");
      } else {
        await this.bot.sendMessage(chatId, "Неправильная ссылка. Попробуйте снова.");
      }
    }
  }
}

module.exports = BotHandlers;
