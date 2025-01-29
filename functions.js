const events = require("./events");

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

module.exports = { getDaysUntilEvent, getBirthdaysMessage };
