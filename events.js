const events = [
   { name: "Ахметшин Ильдар", date: "2005-08-03", type: "birthday" },
   { name: "Белов Юра", date: "2006-03-22", type: "birthday" },
   { name: "Бикбаева Иделия", date: "2006-11-05", type: "birthday" },
   { name: "Брайловский Роман", date: "2006-02-08", type: "birthday" },
   { name: "Гумеров Йасин", date: "2006-04-03", type: "birthday" },
   { name: "Галимова Дарья", date: "2004-08-05", type: "birthday" },
   { name: "Данилова Дарья", date: "2006-01-17", type: "birthday" },
   { name: "Джамаль Эд-Дин Комрад", date: "2006-07-26", type: "birthday" },
   { name: "Ермолаев Эдуард", date: "2006-02-26", type: "birthday" },
   { name: "Кузнецова Валерия", date: "2006-06-11", type: "birthday" },
   { name: "Кулыев Денис", date: "2005-03-14", type: "birthday" },
   { name: "Мартынова Ульяна", date: "2006-03-15", type: "birthday" },
   { name: "Минебаев Данил", date: "2006-06-28", type: "birthday" },
   { name: "Мурашова Ксения", date: "2005-12-17", type: "birthday" },
   { name: "Назмиев Айзат", date: "2006-06-07", type: "birthday" },
   { name: "Платонова Полина", date: "2006-02-26", type: "birthday" },
   { name: "Пятков Тимур", date: "2005-12-13", type: "birthday" },
   { name: "Рахматуллин Камиль", date: "2006-02-02", type: "birthday" },
   { name: "Рогожина Виктория", date: "2006-07-25", type: "birthday" },
   { name: "Рюхова Софья", date: "2006-02-08", type: "birthday" },
   { name: "Садыкова Радмила", date: "2006-01-12", type: "birthday" },
   { name: "Сафин Мирас", date: "2005-08-10", type: "birthday" },
   { name: "Сафина Ильдина", date: "2006-09-30", type: "birthday" },
   { name: "Строй Владислав", date: "2005-03-30", type: "birthday" },
   { name: "Хузин Ильгиз", date: "2006-01-12", type: "birthday" },
   { name: "Шигапова Мадина", date: "2006-05-01", type: "birthday" },
];

const schedule = [
   {
      day: "Понедельник",
      pairs: [
         {
            pairNumber: 1,
            time: "8:00 – 9:30",
            room: "Точка кипения",
            name: "Тестирование",
            teacher: "Зифарова А.В.",
         },
         {
            pairNumber: 2,
            time: "9:40 – 11:10",
            room: "406 / 405",
            name: "Ин. яз",
            teacher: "Бочкова О.Е., Садыкова А.Ш.",
         },
      ],
   },
   {
      day: "Вторник",
      pairs: [
         {
            pairNumber: 2,
            time: "9:40 – 11:10",
            room: "417",
            name: "Философия",
            teacher: "Галеева А.Р.",
         },
         {
            pairNumber: 3,
            time: "11:50 – 13:20",
            room: "1302",
            name: "Проектирование",
            teacher: "Халиуллина А.Р., Хайруллин Д.И.",
         },
         {
            pairNumber: 4,
            time: "13:40 – 15:10",
            room: "Точка кипения",
            name: "Тестирование",
            teacher: "Зифарова А.В.",
         },
         {
            pairNumber: 5,
            time: "15:20 – 16:50",
            room: "1302",
            name: "Разработка кода",
            teacher: "Фазлиева Л.Р., Гимадиев Н.Н.",
         },
      ],
   },
   {
      day: "Среда",
      pairs: [
         {
            pairNumber: 1,
            time: "8:00 – 9:30",
            room: "1301",
            name: "Разработка кода",
            teacher: "Фазлиева Л.Р., Гимадиев Н.Н.",
         },
         {
            pairNumber: 2,
            time: "9:40 – 11:10",
            room: "1302",
            name: "Проектирование",
            teacher: "Халиуллина А.Р., Хайруллин Д.И.",
         },
         {
            pairNumber: 3,
            time: "11:50 – 13:20",
            room: "417",
            name: "Философия",
            teacher: "Галеева А.Р.",
         },
         {
            pairNumber: 4,
            time: "13:40 – 15:10",
            room: "1301",
            name: "Разработка кода",
            teacher: "Фазлиева Л.Р.",
         },
      ],
   },
   {
      day: "Четверг",
      pairs: [
         {
            pairNumber: 5,
            time: "15:20 – 16:50",
            room: "1302",
            name: "Проектирование",
            teacher: "Халиуллина А.Р., Хайруллин Д.И.",
         },
         {
            pairNumber: 6,
            time: "17:00 – 18:30",
            room: "414",
            name: "Правовое обеспеч.",
            teacher: "Гришина Д.Р.",
         },
      ],
   },
   {
      day: "Пятница",
      pairs: [
         {
            pairNumber: 4,
            time: "13:40 – 15:10",
            room: "Точка кипения",
            name: "Тестирование",
            teacher: "Зифарова А.В.",
         },
         {
            pairNumber: 5,
            time: "15:20 – 16:50",
            room: "414",
            name: "Правовое обеспеч.",
            teacher: "Гришина Д.Р.",
         },
         {
            pairNumber: 6,
            time: "17:00 – 18:30",
            room: "1302",
            name: "Разработка кода",
            teacher: "Фазлиева Л.Р., Гимадиев Н.Н.",
         },
      ],
   },
   {
      day: "Суббота",
      pairs: [
         {
            pairNumber: 3,
            time: "11:30 – 13:00",
            room: "с/з",
            name: "Физ-ра",
            teacher: "Хажиев Р.Р., Раджабов Р.В.",
         },
         {
            pairNumber: 4,
            time: "13:10 – 14:40",
            room: "1302",
            name: "Проектирование",
            teacher: "Халиуллина А.Р., Хайруллин Д.И.",
         },
         {
            pairNumber: 5,
            time: "14:50 – 16:20",
            room: "1302",
            name: "Проектирование",
            teacher: "Халиуллина А.Р.",
         },
      ],
   },
];

module.exports = { events, schedule };
