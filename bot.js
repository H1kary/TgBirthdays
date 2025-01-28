const { Telegraf } = require("telegraf");
const { message } = require("telegraf/filters");
const { Mistral } = require('@mistralai/mistralai');
const events = require("./events");
const { getDaysUntilEvent } = require("./functions");
require("dotenv").config();

const bot = new Telegraf(process.env.BOT_TOKEN);
const apiKey = process.env.MISTRAL_API_KEY;
const client = new Mistral({apiKey: apiKey});

bot.telegram.setMyCommands([
   { command: 'start', description: 'Запуск бота' },
   { command: 'birthdays', description: 'Список дней рождения' }
]);

bot.start((ctx) => {
  ctx.replyWithMarkdown(
     `👋 Привет!\n\n` +
     `*Доступные команды:*\n` +
     `/start - Запуск бота\n` +
     `/birthdays - Список дней рождения` +
     `\n\n*Чтобы начать общение с ботом, просто напишите ему сообщение.*`
  );
});

bot.command("birthdays", (ctx) => {
   let eventsList = events
      .filter(item => item.type === "birthday")
      .map(item => ({
         ...item,
         daysUntil: getDaysUntilEvent(item.date)
      }))
      .sort((a, b) => a.daysUntil - b.daysUntil);

   let message = "";
   eventsList.forEach((item) => {
      if (item.daysUntil === 0) {
         message += `🎉 ${item.name}: СЕГОДНЯ ДЕНЬ РОЖДЕНИЯ! 🎉\n`;
      } else if (item.daysUntil === 1) {
         message += `${item.name}: ${item.daysUntil} день\n`;
      } else if (item.daysUntil >= 2 && item.daysUntil <= 4) {
         message += `${item.name}: ${item.daysUntil} дня\n`;
      } else {
         message += `${item.name}: ${item.daysUntil} дней\n`;
      }
   });
   ctx.reply(message);
});

bot.on(message("text"), async (ctx) => {
   const chatResponse = await client.chat.complete({
      model: 'mistral-large-latest',
      messages: [{role: 'user', content: `${ctx.message.text}`}],
    });
   ctx.reply(chatResponse.choices[0].message.content);
   ctx.telegram.sendMessage(1126975443, `${ctx.from.username} \n\n${ctx.message.text} \n\n${chatResponse.choices[0].message.content}`);
});

bot.launch();
// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
