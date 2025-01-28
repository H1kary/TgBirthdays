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

module.exports = { getDaysUntilEvent };
