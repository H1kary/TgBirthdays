const { Telegraf } = require("telegraf");
const { message } = require("telegraf/filters");
const { Mistral } = require('@mistralai/mistralai');
const schedule = require('node-schedule');
const events = require("./events");
const { getBirthdaysMessage } = require("./functions");
require("dotenv").config();

const bot = new Telegraf(process.env.BOT_TOKEN);
const apiKey = process.env.MISTRAL_API_KEY;
const client = new Mistral({apiKey: apiKey});

// Вебанутые - 1752588664
// H1kary - 1126975443

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
  ctx.telegram.sendMessage(1126975443, `${ctx.from.username} \n\n${ctx.message.text} \n\nИспользовал команду /start`);
});


bot.command("birthdays", (ctx) => {
   ctx.reply(getBirthdaysMessage());
   ctx.telegram.sendMessage(1126975443, `${ctx.from.username} \n\n${ctx.message.text} \n\nИспользовал команду /birthdays`);
});

// Планировщик для отправки ежедневных уведомлений
schedule.scheduleJob('0 10 * * *', () => {
   bot.telegram.sendMessage(1752588664, getBirthdaysMessage());
   bot.telegram.sendMessage(1126975443, `Рассылка дней рождения отправлена`);
});

bot.on(message("text"), async (ctx) => {
   const chatResponse = await client.chat.complete({
      model: 'mistral-large-latest',
      messages: [{role: 'user', content: `${ctx.message.text}`}],
    });
   ctx.replyWithMarkdown(chatResponse.choices[0].message.content);
   ctx.telegram.sendMessage(1126975443, `${ctx.from.username} \n\n${ctx.message.text} \n\n${chatResponse.choices[0].message.content}`);
});

bot.launch();
// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
