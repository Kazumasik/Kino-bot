const express = require("express");
require('dotenv').config()
const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });
const channelsToSubscribe = [{ text: 'Японский с мичи', url: 'google.com' }, { text: 'Японский спапа', url: 'google.com' },]

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
    if (text === '/start') {
        await bot.sendMessage(chatId, `Привет, ${msg.from.first_name}. Чтобы получить названия фильма, подпишись на каналы ниже:`, {
            reply_markup: {
                inline_keyboard: [
                    ...channelsToSubscribe.map(channel => [{ text: channel.text, url: channel.url }]),
                    [{ text: 'Я подписался', callback_data: 'subscribed' }]
                ]
            }
        })
    }
});

bot.on('callback_query', async (query) => {
    const chatId = query.message.chat.id;
    if (query.data === 'subscribed') {
        // Выводим текст в консоль
        console.log('Пользователь нажал кнопку "Я подписался"');
        const check = await bot.getChatMember(-1002109858898, query.from.id)

        console.log(check)
        // Отправляем сообщение пользователю
        bot.sendMessage(chatId, 'Спасибо за подписку!');

        // Опционально: можно закрыть уведомление о нажатии кнопки
        bot.answerCallbackQuery(query.id);
    }
});
console.log(process.env.TELEGRAM_TOKEN)

// const TelegramBot = require('node-telegram-bot-api');
// const cors = require('cors');
// const app = express();
// const bot = new TelegramBot('7335914969:AAF-yx2bgksrYATZRE9WtrGTtj0CpJaO034', { polling: true });
// app.use(express.json());
// app.use(cors());

// bot.on('message', async (msg) => {
//   const chatId = msg.chat.id;
//   const text = msg.text;
//   if (text === '/start') {
//     await bot.sendMessage(chatId, 'Начать учиться по кнопке ниже', {
//       reply_markup: {
//         inline_keyboard: [
//           [{ text: 'Учиться', web_app: { url: 'https://annually-intent-ox.ngrok-free.app/' } }]
//         ]
//       }
//     })
//     const photo = await bot.getUserProfilePhotos(msg.from.id)
//     console.log(photo.photos[0])

//   }
// });

// const authRoutes = require("./routes/auth");
// const userRoutes = require("./routes/user");
// const bookRoutes = require("./routes/book");
// const genreRoutes = require("./routes/genre");
// const categoryRoutes = require("./routes/category");

// const app = express();
// const PORT = 5002;

// app.use(bodyParser.json());

// app.use("/images", express.static(path.join(__dirname, "images")));

// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "OPTIONS, GET, POST, PUT, PATCH, DELETE"
//   );
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
//   next();
// });

// app.use("/auth", authRoutes);
// app.use("/user", userRoutes);
// app.use("/book", bookRoutes);
// app.use("/genre", genreRoutes);
// app.use("/category", categoryRoutes);

// app.use((error, req, res, next) => {
//   console.log(error);
//   const status = error.statusCode || 500;
//   const message = error.message;
//   const data = error.data;
//   res.status(status).json({ message: message, data: data });
// });

// const dbURL =
//   "mongodb+srv://maxim4ik:qSfI1yz2bti9bQ0W@cluster0.nyu4b6m.mongodb.net/?retryWrites=true&w=majority";

// mongoose
//   .connect(dbURL, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     useFindAndModify: false,
//   })
//   .then(() => {
//     app.listen(PORT, () => {
//       console.log(`Server started successfully on port ${PORT}!`);
//     });
//   })
//   .catch((err) => console.log(err));
