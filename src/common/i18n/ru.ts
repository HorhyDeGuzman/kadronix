export default {
  app: {
    title: 'Kadronix',
    tagline: 'Угадай фильм по кадрам и актёрам',
  },
  nav: {
    home: 'Главная',
  },
  theme: {
    light: 'Светлая',
    dark: 'Тёмная',
    toggle: 'Переключить тему',
  },
  language: {
    ru: 'Русский',
    en: 'English',
    toggle: 'Сменить язык',
  },
  home: {
    description:
      'Угадывай фильмы и сериалы по кадрам и фотографиям актёров. 10 раундов, фильтры по эпохам и жанрам.',
    chooseMode: 'Выбери режим',
    howItWorks: 'Как играть',
    steps: {
      pickMode: {
        title: 'Выбери режим',
        desc: 'По кадрам или по актёрам',
      },
      pickFilter: {
        title: 'Настрой категорию',
        desc: 'Эпоха, жанр, фильмы или сериалы',
      },
      guess: {
        title: 'Угадывай 10 раз',
        desc: 'Чем больше попаданий — тем выше счёт',
      },
    },
    modes: {
      framesChoice: {
        title: 'По кадрам',
        description: 'Угадай фильм по кадру. Выбери из четырёх вариантов.',
      },
      actorsChoice: {
        title: 'По актёрам',
        description: 'Угадай фильм по актёрам из его состава.',
      },
    },
    play: 'Играть',
    soon: 'Скоро',
  },
  footer: {
    tmdbCredit: 'Данные предоставлены TMDB',
    tmdbDisclaimer: 'Этот сайт использует TMDB API, но не одобрен и не аккредитован TMDB.',
  },
  game: {
    round: 'Раунд',
    score: 'Счёт',
    next: 'Дальше',
    skip: 'Пропустить',
    correct: 'Верно!',
    wrong: 'Неверно',
    answerWas: 'Правильный ответ: {title}',
    finish: 'Закончить',
    loading: 'Загрузка...',
    error: 'Что-то пошло не так',
    tokenMissing: 'Не задан токен TMDB. Открой файл .env.local и впиши свой токен.',
    prompt: {
      framesMovie: 'Что это за фильм?',
      framesTv: 'Что это за сериал?',
      actorsMovie: 'В каком фильме они снимались?',
      actorsTv: 'В каком сериале они снимались?',
    },
  },
  setup: {
    title: 'Настрой игру',
    contentType: 'Что угадываем',
    category: 'Категория',
    movies: 'Фильмы',
    tvShows: 'Сериалы',
    start: 'Начать игру',
  },
  filters: {
    all: 'Все',
    top: 'Топ',
    decade70: '70-е',
    decade80: '80-е',
    decade90: '90-е',
    decade2000: '2000-е',
    decade2010: '2010-е',
    decade2020: '2020-е',
    comedy: 'Комедии',
    drama: 'Драмы',
    action: 'Боевики',
    thriller: 'Триллеры',
    horror: 'Ужасы',
    scifi: 'Фантастика',
    crime: 'Криминал',
    romance: 'Мелодрамы',
    animation: 'Анимация',
  },
}
