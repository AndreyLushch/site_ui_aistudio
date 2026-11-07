export interface GameCharacter {
  id: string;
  name: string;
  roleTitle: string;
  gameSlug: string;
  gameTitle: string;
  image: string;
  quote: string;
  description: string;
  badge: string;
  badgeColor: string;
}

export const CHARACTERS_FIXTURE: GameCharacter[] = [
  {
    id: 'sheriff',
    name: 'Шериф',
    roleTitle: 'Страж закона',
    gameSlug: 'gangs',
    gameTitle: 'Гангстеры',
    image: '/assets/games/gangs_sheriff.png',
    quote: '«В этом городе закон ещё что-то значит. И мой револьвер напомнит тебе об этом.»',
    description: 'Ночью проверяет подозрительных горожан и вычисляет членов преступного синдиката. Днём ведёт за собой следствие.',
    badge: 'Горожане',
    badgeColor: 'bg-emerald-950/85 text-emerald-300 border-emerald-500/40',
  },
  {
    id: 'boss',
    name: 'Босс гангстеров',
    roleTitle: 'Глава синдиката',
    gameSlug: 'gangs',
    gameTitle: 'Гангстеры',
    image: '/assets/games/gangs_boss.png',
    quote: '«Ничего личного. Только бизнес нашего стола.»',
    description: 'Координирует ночные вылазки банды, отдаёт решающие приказы и ловко путает мирных жителей на дневном голосовании.',
    badge: 'Гангстеры',
    badgeColor: 'bg-red-950/85 text-red-300 border-red-500/40',
  },
  {
    id: 'gangster',
    name: 'Гангстер',
    roleTitle: 'Боевик мафии',
    gameSlug: 'gangs',
    gameTitle: 'Гангстеры',
    image: '/assets/games/gangs_gangster.png',
    quote: '«Томпсон стреляет без лишних слов. Кто следующий?»',
    description: 'Верный исполнитель воли босса. Ночью выбирает цель для устранения, днём маскируется под тихого горожанина.',
    badge: 'Гангстеры',
    badgeColor: 'bg-red-950/85 text-red-300 border-red-500/40',
  },
  {
    id: 'citizen',
    name: 'Горожанин',
    roleTitle: 'Мирный житель',
    gameSlug: 'gangs',
    gameTitle: 'Гангстеры',
    image: '/assets/games/gangs_citizen.png',
    quote: '«Мы не позволим мафии захватить наш город!»',
    description: 'Основа города. Сила горожан — в сплочённости, внимательности к чужим словам и точном дневном голосовании.',
    badge: 'Горожане',
    badgeColor: 'bg-emerald-950/85 text-emerald-300 border-emerald-500/40',
  },
  {
    id: 'shelter_council',
    name: 'Совет бункера',
    roleTitle: 'Выжившие',
    gameSlug: 'shelter',
    gameTitle: 'Укрытие',
    image: '/assets/games/shelter_table_debate.png',
    quote: '«Ресурсов на всех не хватит. Каждый должен доказать свою пользу колонии.»',
    description: 'Собрание специалистов за картой катастрофы: врач, инженер, учёный, рабочий. Шансы выживания оценивает ИИ.',
    badge: 'Колония ИИ',
    badgeColor: 'bg-blue-950/85 text-blue-300 border-blue-500/40',
  },
  {
    id: 'shelter_gate',
    name: 'Кандидат у шлюза',
    roleTitle: 'Претендент на место',
    gameSlug: 'shelter',
    gameTitle: 'Укрытие',
    image: '/assets/games/shelter_door_entry.png',
    quote: '«Впусти меня! У меня есть навыки и то, что спасёт тебя и всю команду!»',
    description: 'Момент максимального накала дебатов: вскрытие карт здоровья, багажа и тайных фактов перед гермодверью.',
    badge: 'Дебаты',
    badgeColor: 'bg-purple-950/85 text-purple-300 border-purple-500/40',
  },
];
