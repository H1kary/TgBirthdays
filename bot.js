const { Telegraf } = require("telegraf");
const { message } = require("telegraf/filters");
const events = require("./events");
const { getDaysUntilEvent } = require("./functions");
require("dotenv").config();

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => {
   ctx.reply(
      `Список доступных команд:\n/birthdays - список дней рождения\n/events - список событий`
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
      message += `${item.name}: ${item.daysUntil} дней\n`;
   });
   ctx.reply(message);
});

bot.command("events", (ctx) => {
   let eventsList = events
      .filter(item => item.type === "holiday")
      .map(item => ({
         ...item,
         daysUntil: getDaysUntilEvent(item.date)
      }))
      .sort((a, b) => a.daysUntil - b.daysUntil);

   let message = "";
   eventsList.forEach((item) => {
      message += `${item.name}: ${item.daysUntil} дней\n`;
   });
   ctx.reply(message);
});

bot.launch();
// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
