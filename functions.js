const { events } = require("./events");
const schedule = require("node-schedule");
const { Markup } = require("telegraf");

function getDaysUntilEvent(event) {
   const today = new Date();
   const nextEvent = new Date(event);
   nextEvent.setFullYear(today.getFullYear());

   // Устанавливаем время на 00:00:00 для точного сравнения
   today.setHours(0, 0, 0, 0);
   nextEvent.setHours(0, 0, 0, 0);

   if (nextEvent < today) {
      nextEvent.setFullYear(today.getFullYear() + 1);
   }

   const diffTime = nextEvent - today;
   return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// Функция для получения дня недели по индексу
function getDayName(dayIndex) {
   const days = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];
   return days[dayIndex];
}

// Функция для получения расписания на завтра
function getTomorrowSchedule(classSchedule) {
   const tomorrow = new Date();
   tomorrow.setDate(tomorrow.getDate() + 1);
   const tomorrowDay = getDayName(tomorrow.getDay());
   return classSchedule.find(s => s.day === tomorrowDay);
}

// Функция для проверки, закончились ли все пары на сегодня
function areTodayClassesOver(daySchedule) {
   if (!daySchedule || !daySchedule.pairs || daySchedule.pairs.length === 0) {
      return true;
   }

   const now = new Date();
   const currentHour = now.getHours();
   const currentMinute = now.getMinutes();

   // Получаем время окончания последней пары
   const lastPair = daySchedule.pairs[daySchedule.pairs.length - 1];
   const [_, endTime] = lastPair.time.split(" – ");
   const [endHour, endMinute] = endTime.split(":");

   // Сравниваем текущее время с временем окончания последней пары
   return (currentHour > parseInt(endHour)) || 
          (currentHour === parseInt(endHour) && currentMinute > parseInt(endMinute));
}

// Функция для получения актуального расписания
function getActualSchedule(classSchedule) {
   const today = getDayName(new Date().getDay());
   const todaySchedule = classSchedule.find(s => s.day === today);

   // Если сегодня все пары закончились, показываем расписание на завтра
   if (areTodayClassesOver(todaySchedule)) {
      const tomorrowSchedule = getTomorrowSchedule(classSchedule);
      return {
         schedule: tomorrowSchedule,
         isForTomorrow: true
      };
   }

   return {
      schedule: todaySchedule,
      isForTomorrow: false
   };
}

// Функция для формирования сообщения со списком дней рождения
function getBirthdaysMessage() {
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
   return message;
}

// Функция для форматирования расписания на день
function getScheduleMessage(daySchedule, showTomorrowButton = false) {
   if (!daySchedule || !daySchedule.pairs || daySchedule.pairs.length === 0) {
      return {
         text: "На этот день пар нет",
         keyboard: showTomorrowButton ? Markup.inlineKeyboard([
            Markup.button.callback("Показать расписание на завтра", "tomorrow")
         ]) : undefined
      };
   }

   // Преобразуем названия дней в правильный падеж
   const dayCase = {
      "Понедельник": "Понедельник",
      "Вторник": "Вторник",
      "Среда": "Среду",
      "Четверг": "Четверг",
      "Пятница": "Пятницу",
      "Суббота": "Субботу",
      "Воскресенье": "Воскресенье"
   };

   let message = `📅 *Расписание на ${dayCase[daySchedule.day]}:*\n\n`;
   daySchedule.pairs.forEach((pair) => {
      message += `*${pair.time}*\n`;
      message += `📚 ${pair.name}\n`;
      message += `🏛 ${pair.room}\n`;
      message += `👩‍🏫 ${pair.teacher}\n\n`;
   });

   return {
      text: message,
      keyboard: showTomorrowButton ? Markup.inlineKeyboard([
         Markup.button.callback("Показать расписание на завтра", "tomorrow")
      ]) : undefined
   };
}

// Функция для определения следующей пары и времени уведомления
function scheduleNextClassNotification(bot, daySchedule) {
   if (!daySchedule || !daySchedule.pairs || daySchedule.pairs.length === 0) return;

   daySchedule.pairs.forEach((pair) => {
      const [startHour, startMinute] = pair.time.split(" – ")[0].split(":");
      const notificationTime = new Date();
      notificationTime.setHours(startHour - 2, startMinute, 0); // За 2 часа до начала

      if (notificationTime > new Date()) { // Если время уведомления ещё не прошло
         schedule.scheduleJob(notificationTime, () => {
            const message = `🔔 *Через 2 часа начинается пара:*\n\n` +
               `*${pair.time}*\n` +
               `📚 ${pair.name}\n` +
               `🏛 ${pair.room}\n` +
               `👩‍🏫 ${pair.teacher}`;

            bot.telegram.sendMessage(-1001711466703, message, { parse_mode: "Markdown" });
            bot.telegram.sendMessage(1126975443, message, { parse_mode: "Markdown" });
         });
      }
   });
}

module.exports = {
   getDaysUntilEvent,
   getBirthdaysMessage,
   getScheduleMessage,
   scheduleNextClassNotification,
   getTomorrowSchedule,
   getDayName,
   getActualSchedule
};
