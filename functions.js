function getDaysUntilEvent(event) {
   const today = new Date();
   const nextEvent = new Date(event);
   nextEvent.setFullYear(today.getFullYear());

   if (nextEvent < today) {
      nextEvent.setFullYear(today.getFullYear() + 1);
   }

   const diffTime = nextEvent - today;
   return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

module.exports = { getDaysUntilEvent };
