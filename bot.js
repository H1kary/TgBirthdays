const { Telegraf } = require("telegraf");
const { message } = require("telegraf/filters");
const { Mistral } = require("@mistralai/mistralai");
const schedule = require("node-schedule");
const { events, schedule: classSchedule } = require("./events");
const {
   getBirthdaysMessage,
   getScheduleMessage,
   scheduleNextClassNotification,
   getTomorrowSchedule,
   getDayName,
   getActualSchedule,
} = require("./functions");
require("dotenv").config();

const bot = new Telegraf(process.env.BOT_TOKEN);
const apiKey = process.env.MISTRAL_API_KEY;
const client = new Mistral({ apiKey: apiKey });

// Вебанутые - -1001711466703
// H1kary - 1126975443

bot.telegram.setMyCommands([
   { command: "start", description: "Запуск бота" },
   { command: "birthdays", description: "Список дней рождения" },
   { command: "schedule", description: "Расписание" },
]);

bot.start((ctx) => {
   ctx.replyWithMarkdown(
      `👋 Привет!\n\n` +
         `*Доступные команды:*\n` +
         `/start - Запуск бота\n` +
         `/birthdays - Список дней рождения\n` +
         `/schedule - Расписание\n\n*Чтобы начать общение с ботом, просто напишите ему сообщение.*`
   );
   ctx.telegram.sendMessage(
      1126975443,
      `${ctx.from.username} // ${ctx.message.chat.id} \n\n${ctx.message.text} \n\nИспользовал команду /start`
   );
});

bot.command("birthdays", (ctx) => {
   ctx.reply(getBirthdaysMessage());
   ctx.telegram.sendMessage(
      1126975443,
      `${ctx.from.username} \n\n${ctx.message.text} \n\nИспользовал команду /birthdays`
   );
});

schedule.scheduleJob("0 10 * * *", () => {
   bot.telegram.sendMessage(-1001711466703, getBirthdaysMessage());
   bot.telegram.sendMessage(1126975443, `Рассылка дней рождения отправлена`);
});

// Планировщик для ежедневной отправки расписания
schedule.scheduleJob("0 0 * * 1-6", () => {
   const { schedule: actualSchedule, isForTomorrow } =
      getActualSchedule(classSchedule);

   if (actualSchedule) {
      const scheduleData = getScheduleMessage(actualSchedule, !isForTomorrow);
      const messagePrefix = isForTomorrow
         ? "Все пары на сегодня закончились!\n\n"
         : "";

      bot.telegram.sendMessage(
         -1001711466703,
         messagePrefix + scheduleData.text,
         {
            parse_mode: "Markdown",
            ...scheduleData.keyboard,
         }
      );
      bot.telegram.sendMessage(1126975443, messagePrefix + scheduleData.text, {
         parse_mode: "Markdown",
         ...scheduleData.keyboard,
      });

      // Планируем уведомления о парах
      if (!isForTomorrow) {
         scheduleNextClassNotification(bot, actualSchedule);
      }
   }
});

// Добавляем команду для получения расписания
bot.command("schedule", (ctx) => {
   const { schedule: actualSchedule, isForTomorrow } =
      getActualSchedule(classSchedule);

   if (actualSchedule) {
      const scheduleData = getScheduleMessage(actualSchedule, !isForTomorrow);
      const messagePrefix = isForTomorrow
         ? "Все пары на сегодня закончились!\n\n"
         : "";
      ctx.replyWithMarkdown(
         messagePrefix + scheduleData.text,
         scheduleData.keyboard
      );
   } else {
      ctx.reply("На сегодня и завтра пар нет");
   }
});

// Обработчик нажатия кнопки "Показать расписание на завтра"
bot.action("tomorrow", async (ctx) => {
   const tomorrowSchedule = getTomorrowSchedule(classSchedule);
   const scheduleData = getScheduleMessage(tomorrowSchedule, false, true);
   await ctx.editMessageText(scheduleData.text, {
      parse_mode: "Markdown",
      ...scheduleData.keyboard,
   });
   await ctx.answerCbQuery();
});

// Обработчик нажатия кнопки "Вернуться"
bot.action("back", async (ctx) => {
   const { schedule: actualSchedule, isForTomorrow } =
      getActualSchedule(classSchedule);

   if (actualSchedule) {
      const scheduleData = getScheduleMessage(actualSchedule, !isForTomorrow);
      const messagePrefix = isForTomorrow
         ? "Все пары на сегодня закончились!\n\n"
         : "";
      await ctx.editMessageText(messagePrefix + scheduleData.text, {
         parse_mode: "Markdown",
         ...scheduleData.keyboard,
      });
   }
   await ctx.answerCbQuery();
});

bot.on(message("text"), async (ctx) => {
   // Если это личное сообщение
   if (ctx.chat.type === "private") {
      try {
         const chatResponse = await client.agents.complete({
            agentId: process.env.AGENT_ID,
            messages: [{ role: "user", content: `${ctx.message.text}` }],
         });
         ctx.replyWithMarkdown(chatResponse.choices[0].message.content);
         ctx.telegram.sendMessage(
            1126975443,
            `${ctx.from.username} // ${ctx.message.chat.id}  \n\n${ctx.message.text} \n\n${chatResponse.choices[0].message.content}`
         );
      } catch (error) {
         console.error(error);
         ctx.reply(
            "Произошла ошибка при обработке запроса. Пожалуйста, попробуйте позже."
         );
      }
   }
   // Если это группа и есть reply на сообщение бота или упоминание бота
   else if (
      (ctx.message.reply_to_message &&
         ctx.message.reply_to_message.from.id === ctx.botInfo.id) ||
      ctx.message.text.includes("@h1karys_bot")
   ) {
      try {
         // Удаляем упоминание бота из текста сообщения, если оно есть
         const messageText = ctx.message.text
            .replace("@h1karys_bot", "")
            .trim();

         const chatResponse = await client.agents.complete({
            agentId: process.env.AGENT_ID,
            messages: [{ role: "user", content: messageText }],
         });
         ctx.replyWithMarkdown(chatResponse.choices[0].message.content);
         ctx.telegram.sendMessage(
            1126975443,
            `${ctx.from.username} // ${ctx.message.chat.id}  \n\n${messageText} \n\n${chatResponse.choices[0].message.content}`
         );
      } catch (error) {
         console.error(error);
         ctx.reply(
            "Произошла ошибка при обработке запроса. Пожалуйста, попробуйте позже."
         );
      }
   }
});

bot.launch();
// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
