// Слова по темам. known: true — то, что Саша уже проходит в школе (листки от Екатерины, 21.10.2026).
// Поля слова: w — английское слово (как пишется и произносится), t — транскрипция русскими буквами,
// ru — перевод, картинка: e (эмодзи), c (цвет), n (число), svg (свой рисунок), L (буква алфавита).
// phrases — короткие фразы и считалки к теме.

const TOPICS = [
  {
    id: 'colors', title: 'Цвета', en: 'Colors', icon: '🎨', tint: '#FFE3C2', known: true,
    items: [
      { w: 'red', t: 'рэд', ru: 'красный', c: '#E53935' },
      { w: 'blue', t: 'блу:', ru: 'синий', c: '#1E66D0' },
      { w: 'green', t: 'гри:н', ru: 'зелёный', c: '#2E9E4F' },
      { w: 'yellow', t: 'йе́лоу', ru: 'жёлтый', c: '#FFD21F' },
      { w: 'orange', t: 'о́рындж', ru: 'оранжевый', c: '#FF8A1E' },
      { w: 'pink', t: 'пинк', ru: 'розовый', c: '#FF8FC4' },
      { w: 'black', t: 'блэк', ru: 'чёрный', c: '#222222' },
      { w: 'white', t: 'вайт', ru: 'белый', c: '#FFFFFF' },
      { w: 'brown', t: 'бра́ун', ru: 'коричневый', c: '#8B5A2B' },
      { w: 'grey', t: 'грэй', ru: 'серый', c: '#9AA0A6' }
    ],
    phrases: [
      { w: 'The sun is yellow.', ru: 'Солнце жёлтое.', e: '☀️' },
      { w: 'The grass is green.', ru: 'Трава зелёная.', e: '🌿' },
      { w: 'The sea is blue.', ru: 'Море синее.', e: '🌊' },
      { w: 'My favourite colour is red.', ru: 'Мой любимый цвет красный.', e: '❤️' }
    ]
  },
  {
    id: 'numbers', title: 'Числа 1–12', en: 'Numbers', icon: '🔢', tint: '#D9ECFF', known: true,
    items: [
      { w: 'one', t: 'ван', ru: 'один', n: 1 },
      { w: 'two', t: 'ту:', ru: 'два', n: 2 },
      { w: 'three', t: 'сри:', ru: 'три', n: 3 },
      { w: 'four', t: 'фо:', ru: 'четыре', n: 4 },
      { w: 'five', t: 'файв', ru: 'пять', n: 5 },
      { w: 'six', t: 'сыкс', ru: 'шесть', n: 6 },
      { w: 'seven', t: 'сэвн', ru: 'семь', n: 7 },
      { w: 'eight', t: 'эйт', ru: 'восемь', n: 8 },
      { w: 'nine', t: 'найн', ru: 'девять', n: 9 },
      { w: 'ten', t: 'тэн', ru: 'десять', n: 10 },
      { w: 'eleven', t: 'иле́вн', ru: 'одиннадцать', n: 11 },
      { w: 'twelve', t: 'твэлв', ru: 'двенадцать', n: 12 }
    ],
    phrases: [
      { w: 'One — a cat,', ru: 'Один — кошка,', e: '🐱' },
      { w: 'Two — a bat,', ru: 'два — летучая мышь,', e: '🦇' },
      { w: 'Three — a dog,', ru: 'три — собака,', e: '🐶' },
      { w: 'Four — a frog,', ru: 'четыре — лягушка,', e: '🐸' },
      { w: 'Five — a hare,', ru: 'пять — заяц,', e: '🐰' },
      { w: 'Six — a bear.', ru: 'шесть — медведь.', e: '🐻' },
      { w: 'What number is missing?', ru: 'Какое число пропущено?', e: '❓' },
      { w: 'One, two, three! Look at me!', ru: 'Раз, два, три! Посмотри на меня!', e: '👀' }
    ],
    phrasesTitle: 'Считалка'
  },
  {
    id: 'family', title: 'Моя семья', en: 'My family', icon: '👨‍👩‍👧‍👦', tint: '#FFE0E6', known: true,
    items: [
      { w: 'mother', t: 'ма́зэ', ru: 'мама', e: '👩' },
      { w: 'father', t: 'фа́:зэ', ru: 'папа', e: '👨' },
      { w: 'sister', t: 'си́стэ', ru: 'сестра', e: '👧' },
      { w: 'brother', t: 'бра́зэ', ru: 'брат', e: '👦' },
      { w: 'grandmother', t: 'грэ́ндма́зэ', ru: 'бабушка', e: '👵' },
      { w: 'grandfather', t: 'грэ́ндфа́:зэ', ru: 'дедушка', e: '👴' },
      { w: 'family', t: 'фэ́мили', ru: 'семья', e: '👨‍👩‍👧‍👦' },
      { w: 'baby', t: 'бэ́йби', ru: 'малыш', e: '👶' }
    ],
    phrases: [
      { w: 'This is my mother.', ru: 'Это моя мама.', e: '👩' },
      { w: 'This is my father.', ru: 'Это мой папа.', e: '👨' },
      { w: 'I have a brother.', ru: 'У меня есть брат.', e: '👦' },
      { w: 'I love my family.', ru: 'Я люблю свою семью.', e: '❤️' }
    ]
  },
  {
    id: 'fruits', title: 'Фрукты', en: 'Fruits', icon: '🍎', tint: '#E3F5D8', known: true,
    items: [
      { w: 'an apple', t: 'эн эпл', ru: 'яблоко', e: '🍎' },
      { w: 'a pear', t: 'э пэ́а', ru: 'груша', e: '🍐' },
      { w: 'an apricot', t: 'эн э́йприкот', ru: 'абрикос', svg: 'apricot' },
      { w: 'a cherry', t: 'э че́ри', ru: 'вишня', e: '🍒' },
      { w: 'a plum', t: 'э плам', ru: 'слива', svg: 'plum' },
      { w: 'a lemon', t: 'э ле́мэн', ru: 'лимон', e: '🍋' },
      { w: 'an orange', t: 'эн о́рындж', ru: 'апельсин', e: '🍊' },
      { w: 'a melon', t: 'э ме́лэн', ru: 'дыня', e: '🍈' },
      { w: 'a water-melon', t: 'э во́:тэмэ́лэн', ru: 'арбуз', e: '🍉' },
      { w: 'a peach', t: 'э пи:ч', ru: 'персик', e: '🍑' },
      { w: 'a banana', t: 'э бэна́:нэ', ru: 'банан', e: '🍌' }
    ],
    phrases: [
      { w: 'I like apples.', ru: 'Я люблю яблоки.', e: '🍎' },
      { w: 'The banana is yellow.', ru: 'Банан жёлтый.', e: '🍌' },
      { w: 'Give me a pear, please.', ru: 'Дай мне грушу, пожалуйста.', e: '🍐' },
      { w: 'Yummy!', ru: 'Вкусно!', e: '😋' }
    ]
  },

  {
    id: 'transport', title: 'Транспорт', en: 'Transport', icon: '🚌', tint: '#D7F3F0', known: true,
    items: [
      { w: 'a car', t: 'э ка:', ru: 'автомобиль', e: '🚗' },
      { w: 'a bus', t: 'э бас', ru: 'автобус', e: '🚌' },
      { w: 'a tram', t: 'э трэм', ru: 'трамвай', e: '🚋' },
      { w: 'a trolley-bus', t: 'э тро́либас', ru: 'троллейбус', e: '🚎' },
      { w: 'a train', t: 'э трэ́ин', ru: 'поезд', e: '🚂' },
      { w: 'a bicycle', t: 'э ба́йсикл', ru: 'велосипед', e: '🚲' },
      { w: 'a motorcycle', t: 'э мо́утэсайкл', ru: 'мотоцикл', e: '🏍️' },
      { w: 'a boat', t: 'э бо́ут', ru: 'лодка', e: '🛶' },
      { w: 'a ship', t: 'э шип', ru: 'корабль', e: '🚢' },
      { w: 'a plane', t: 'э плэ́ин', ru: 'самолёт', e: '✈️' },
      { w: 'a helicopter', t: 'э хе́ликоптэ', ru: 'вертолёт', e: '🚁' },
      { w: 'a rocket', t: 'э ро́кит', ru: 'ракета', e: '🚀' }
    ],
    phrases: [
      { w: 'Look at a bus.', ru: 'Посмотри на автобус.', e: '🚌' },
      { w: 'Look at a train.', ru: 'Посмотри на поезд.', e: '🚂' },
      { w: 'Look at a ship.', ru: 'Посмотри на корабль.', e: '🚢' },
      { w: 'Look at a plane.', ru: 'Посмотри на самолёт.', e: '✈️' },
      { w: 'Look at...', ru: 'Посмотри на...', e: '👀' }
    ],
    phrasesTitle: 'Стишок'
  },

  // ——— новое, если захочется дальше ———
  {
    id: 'animals', title: 'Животные', en: 'Animals', icon: '🐻', tint: '#FFF1BF',
    items: [
      { w: 'a cat', t: 'э кэт', ru: 'кошка', e: '🐱' },
      { w: 'a dog', t: 'э дог', ru: 'собака', e: '🐶' },
      { w: 'a bat', t: 'э бэт', ru: 'летучая мышь', e: '🦇' },
      { w: 'a frog', t: 'э фрог', ru: 'лягушка', e: '🐸' },
      { w: 'a hare', t: 'э хэ́а', ru: 'заяц', e: '🐰' },
      { w: 'a bear', t: 'э бэ́а', ru: 'медведь', e: '🐻' },
      { w: 'a mouse', t: 'э ма́ус', ru: 'мышка', e: '🐭' },
      { w: 'a fox', t: 'э фокс', ru: 'лиса', e: '🦊' },
      { w: 'a wolf', t: 'э вулф', ru: 'волк', e: '🐺' },
      { w: 'a cow', t: 'э ка́у', ru: 'корова', e: '🐮' },
      { w: 'a pig', t: 'э пиг', ru: 'свинья', e: '🐷' },
      { w: 'a horse', t: 'э хо:с', ru: 'лошадь', e: '🐴' },
      { w: 'a duck', t: 'э дак', ru: 'утка', e: '🦆' },
      { w: 'a bird', t: 'э бё:д', ru: 'птица', e: '🐦' },
      { w: 'a fish', t: 'э фиш', ru: 'рыба', e: '🐟' },
      { w: 'a lion', t: 'э ла́йэн', ru: 'лев', e: '🦁' },
      { w: 'a monkey', t: 'э ма́нки', ru: 'обезьяна', e: '🐵' }
    ],
    phrases: [
      { w: 'I have a cat.', ru: 'У меня есть кошка.', e: '🐱' },
      { w: 'The dog is brown.', ru: 'Собака коричневая.', e: '🐶' },
      { w: 'The frog can jump.', ru: 'Лягушка умеет прыгать.', e: '🐸' },
      { w: 'The fish can swim.', ru: 'Рыба умеет плавать.', e: '🐟' }
    ]
  },
  {
    id: 'hello', title: 'Привет и пока', en: 'Hello!', icon: '👋', tint: '#E6E1FF',
    items: [
      { w: 'Hello!', t: 'хэло́у', ru: 'Привет!', e: '👋' },
      { w: 'Goodbye!', t: 'гудба́й', ru: 'До свидания!', e: '🚪' },
      { w: 'Good morning!', t: 'гуд мо́:нинг', ru: 'Доброе утро!', e: '🌅' },
      { w: 'Good night!', t: 'гуд найт', ru: 'Спокойной ночи!', e: '🌙' },
      { w: 'Thank you!', t: 'сэнк ю:', ru: 'Спасибо!', e: '🙏' },
      { w: 'Please', t: 'пли:з', ru: 'Пожалуйста', e: '🥺' },
      { w: 'Yes', t: 'йес', ru: 'Да', e: '👍' },
      { w: 'No', t: 'но́у', ru: 'Нет', e: '👎' },
      { w: 'Sorry', t: 'со́ри', ru: 'Извини', e: '😔' }
    ],
    phrases: [
      { w: 'My name is Sasha.', ru: 'Меня зовут Саша.', e: '🙋‍♂️' },
      { w: 'What is your name?', ru: 'Как тебя зовут?', e: '❓' },
      { w: 'How are you?', ru: 'Как дела?', e: '🙂' },
      { w: 'I am fine, thank you!', ru: 'Хорошо, спасибо!', e: '😊' },
      { w: 'I am seven.', ru: 'Мне семь лет.', e: '7️⃣' }
    ]
  },
  {
    id: 'abc', title: 'Алфавит', en: 'ABC', icon: '🔤', tint: '#D7F3F0',
    items: [
      { w: 'A', t: 'эй', ru: 'apple — яблоко', L: 'Aa', e: '🍎' },
      { w: 'B', t: 'би:', ru: 'ball — мяч', L: 'Bb', e: '⚽' },
      { w: 'C', t: 'си:', ru: 'cat — кошка', L: 'Cc', e: '🐱' },
      { w: 'D', t: 'ди:', ru: 'dog — собака', L: 'Dd', e: '🐶' },
      { w: 'E', t: 'и:', ru: 'egg — яйцо', L: 'Ee', e: '🥚' },
      { w: 'F', t: 'эф', ru: 'fish — рыба', L: 'Ff', e: '🐟' },
      { w: 'G', t: 'джи:', ru: 'girl — девочка', L: 'Gg', e: '👧' },
      { w: 'H', t: 'эйч', ru: 'house — дом', L: 'Hh', e: '🏠' },
      { w: 'I', t: 'ай', ru: 'ice cream — мороженое', L: 'Ii', e: '🍦' },
      { w: 'J', t: 'джей', ru: 'juice — сок', L: 'Jj', e: '🧃' },
      { w: 'K', t: 'кей', ru: 'kite — воздушный змей', L: 'Kk', e: '🪁' },
      { w: 'L', t: 'эл', ru: 'lemon — лимон', L: 'Ll', e: '🍋' },
      { w: 'M', t: 'эм', ru: 'mouse — мышка', L: 'Mm', e: '🐭' },
      { w: 'N', t: 'эн', ru: 'nose — нос', L: 'Nn', e: '👃' },
      { w: 'O', t: 'о́у', ru: 'orange — апельсин', L: 'Oo', e: '🍊' },
      { w: 'P', t: 'пи:', ru: 'pig — свинья', L: 'Pp', e: '🐷' },
      { w: 'Q', t: 'кью:', ru: 'queen — королева', L: 'Qq', e: '👸' },
      { w: 'R', t: 'а:', ru: 'robot — робот', L: 'Rr', e: '🤖' },
      { w: 'S', t: 'эс', ru: 'sun — солнце', L: 'Ss', e: '☀️' },
      { w: 'T', t: 'ти:', ru: 'tree — дерево', L: 'Tt', e: '🌳' },
      { w: 'U', t: 'ю:', ru: 'umbrella — зонтик', L: 'Uu', e: '☂️' },
      { w: 'V', t: 'ви:', ru: 'violin — скрипка', L: 'Vv', e: '🎻' },
      { w: 'W', t: 'дабл ю:', ru: 'window — окно', L: 'Ww', e: '🪟' },
      { w: 'X', t: 'экс', ru: 'fox — лиса', L: 'Xx', e: '🦊' },
      { w: 'Y', t: 'уа́й', ru: 'yo-yo — йо-йо', L: 'Yy', e: '🪀' },
      { w: 'Z', t: 'зэд', ru: 'zebra — зебра', L: 'Zz', e: '🦓' }
    ]
  },
  {
    id: 'toys', title: 'Игрушки', en: 'Toys', icon: '🧸', tint: '#FFE3C2',
    items: [
      { w: 'a ball', t: 'э бо:л', ru: 'мяч', e: '⚽' },
      { w: 'a doll', t: 'э дол', ru: 'кукла', e: '🪆' },
      { w: 'a car', t: 'э ка:', ru: 'машинка', e: '🚗' },
      { w: 'a train', t: 'э трэйн', ru: 'поезд', e: '🚂' },
      { w: 'a plane', t: 'э плэйн', ru: 'самолёт', e: '✈️' },
      { w: 'a robot', t: 'э ро́убот', ru: 'робот', e: '🤖' },
      { w: 'a kite', t: 'э кайт', ru: 'воздушный змей', e: '🪁' },
      { w: 'a teddy bear', t: 'э тэ́ди бэ́а', ru: 'плюшевый мишка', e: '🧸' },
      { w: 'a balloon', t: 'э бэлу́:н', ru: 'воздушный шарик', e: '🎈' },
      { w: 'a drum', t: 'э драм', ru: 'барабан', e: '🥁' }
    ],
    phrases: [
      { w: 'I have a red car.', ru: 'У меня есть красная машинка.', e: '🚗' },
      { w: 'Let’s play!', ru: 'Давай играть!', e: '🎲' },
      { w: 'My ball is big.', ru: 'Мой мяч большой.', e: '⚽' }
    ]
  },
  {
    id: 'school', title: 'В школе', en: 'School', icon: '🎒', tint: '#D9ECFF',
    items: [
      { w: 'a pen', t: 'э пэн', ru: 'ручка', e: '🖊️' },
      { w: 'a pencil', t: 'э пэнсл', ru: 'карандаш', e: '✏️' },
      { w: 'a book', t: 'э бук', ru: 'книга', e: '📕' },
      { w: 'a bag', t: 'э бэг', ru: 'портфель', e: '🎒' },
      { w: 'a ruler', t: 'э ру́:лэ', ru: 'линейка', e: '📏' },
      { w: 'scissors', t: 'сы́зэз', ru: 'ножницы', e: '✂️' },
      { w: 'a chair', t: 'э чэ́а', ru: 'стул', e: '🪑' },
      { w: 'a teacher', t: 'э ти́:чэ', ru: 'учитель', e: '🧑‍🏫' },
      { w: 'a school', t: 'э ску:л', ru: 'школа', e: '🏫' },
      { w: 'a clock', t: 'э клок', ru: 'часы', e: '🕐' }
    ],
    phrases: [
      { w: 'Stand up!', ru: 'Встаньте!', e: '🧍' },
      { w: 'Sit down!', ru: 'Садитесь!', e: '🪑' },
      { w: 'Open your books.', ru: 'Откройте книги.', e: '📖' },
      { w: 'Look at me!', ru: 'Посмотри на меня!', e: '👀' }
    ]
  },
  {
    id: 'body', title: 'Тело', en: 'My body', icon: '🙂', tint: '#FFE0E6',
    items: [
      { w: 'a head', t: 'э хэд', ru: 'голова', e: '🙂' },
      { w: 'eyes', t: 'айз', ru: 'глаза', e: '👀' },
      { w: 'a nose', t: 'э но́уз', ru: 'нос', e: '👃' },
      { w: 'a mouth', t: 'э ма́уф', ru: 'рот', e: '👄' },
      { w: 'ears', t: 'и́эз', ru: 'уши', e: '👂' },
      { w: 'a hand', t: 'э хэнд', ru: 'рука (кисть)', e: '✋' },
      { w: 'a leg', t: 'э лэг', ru: 'нога', e: '🦵' },
      { w: 'a foot', t: 'э фут', ru: 'ступня', e: '🦶' },
      { w: 'hair', t: 'хэ́а', ru: 'волосы', e: '💇‍♂️' }
    ],
    phrases: [
      { w: 'Clap your hands!', ru: 'Похлопай в ладоши!', e: '👏' },
      { w: 'Touch your nose!', ru: 'Дотронься до носа!', e: '👃' },
      { w: 'Shake your head!', ru: 'Покачай головой!', e: '🙃' }
    ]
  },
  {
    id: 'food', title: 'Еда', en: 'Food', icon: '🍕', tint: '#E3F5D8',
    items: [
      { w: 'bread', t: 'брэд', ru: 'хлеб', e: '🍞' },
      { w: 'milk', t: 'милк', ru: 'молоко', e: '🥛' },
      { w: 'cheese', t: 'чи:з', ru: 'сыр', e: '🧀' },
      { w: 'an egg', t: 'эн эг', ru: 'яйцо', e: '🥚' },
      { w: 'a cake', t: 'э кэйк', ru: 'торт', e: '🍰' },
      { w: 'ice cream', t: 'айс кри:м', ru: 'мороженое', e: '🍦' },
      { w: 'juice', t: 'джу:с', ru: 'сок', e: '🧃' },
      { w: 'tea', t: 'ти:', ru: 'чай', e: '🍵' },
      { w: 'soup', t: 'су:п', ru: 'суп', e: '🍲' },
      { w: 'pizza', t: 'пи́:тсэ', ru: 'пицца', e: '🍕' },
      { w: 'sweets', t: 'сви:тс', ru: 'конфеты', e: '🍬' }
    ],
    phrases: [
      { w: 'I am hungry.', ru: 'Я голодный.', e: '😋' },
      { w: 'I like pizza.', ru: 'Я люблю пиццу.', e: '🍕' },
      { w: 'Milk, please!', ru: 'Молоко, пожалуйста!', e: '🥛' }
    ]
  },
  {
    id: 'numbers20', title: 'Числа до 20', en: 'Numbers 13–20', icon: '💯', tint: '#E6E1FF',
    items: [
      { w: 'thirteen', t: 'сё:ти́:н', ru: 'тринадцать', n: 13 },
      { w: 'fourteen', t: 'фо:ти́:н', ru: 'четырнадцать', n: 14 },
      { w: 'fifteen', t: 'фифти́:н', ru: 'пятнадцать', n: 15 },
      { w: 'sixteen', t: 'сыксти́:н', ru: 'шестнадцать', n: 16 },
      { w: 'seventeen', t: 'сэвнти́:н', ru: 'семнадцать', n: 17 },
      { w: 'eighteen', t: 'эйти́:н', ru: 'восемнадцать', n: 18 },
      { w: 'nineteen', t: 'найнти́:н', ru: 'девятнадцать', n: 19 },
      { w: 'twenty', t: 'тву́энти', ru: 'двадцать', n: 20 }
    ]
  }
];

// Свои рисунки для фруктов, которых нет среди эмодзи
const SVGS = {
  apricot: '<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M55 22c10-14 26-14 34-8-8 10-22 14-34 8z" fill="#4CAF50"/><circle cx="48" cy="58" r="32" fill="#F7A440"/><path d="M48 27c-8 12-8 50 0 63" stroke="#D9782A" stroke-width="3" fill="none" stroke-linecap="round"/><ellipse cx="34" cy="46" rx="8" ry="12" fill="#FFD08A" opacity=".7"/></svg>',
  plum: '<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M50 22c2-8 6-12 10-14" stroke="#6D4C2F" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M54 20c12-8 24-6 30 0-10 8-22 8-30 0z" fill="#4CAF50"/><ellipse cx="50" cy="58" rx="28" ry="34" fill="#5B3C9E"/><path d="M50 26c-6 14-6 50 0 66" stroke="#43297A" stroke-width="3" fill="none" stroke-linecap="round"/><ellipse cx="38" cy="46" rx="6" ry="11" fill="#9C82D6" opacity=".7"/></svg>'
};

// Наклейки: новая за каждые 10 звёзд
const STICKERS = ['🦖', '🚀', '🦄', '🐙', '🦁', '🏆', '⚽', '🐬', '🌈', '🦜', '🚒', '🐯', '🎸', '🐧', '🦋', '🛸', '🐳', '🍩', '🦊', '👑',
  '🐼', '🚁', '🦒', '🎯', '🐢', '🏰', '🐲', '🌟', '🦀', '🎡'];
