export default {
  app: {
    title: 'Kadronix',
    tagline: 'Guess the movie by frames and actors',
  },
  nav: {
    home: 'Home',
  },
  theme: {
    light: 'Light',
    dark: 'Dark',
    toggle: 'Toggle theme',
  },
  language: {
    ru: 'Русский',
    en: 'English',
    toggle: 'Change language',
  },
  home: {
    description:
      'A movie trivia game. Guess films and TV shows from their frames or cast photos. 10 rounds, filtered by decade or genre.',
    chooseMode: 'Choose a mode',
    howItWorks: 'How it works',
    steps: {
      pickMode: {
        title: 'Pick a mode',
        desc: 'Frames or cast — your call',
      },
      pickFilter: {
        title: 'Choose a category',
        desc: 'Decade, genre, movies or TV shows',
      },
      guess: {
        title: 'Guess 10 times',
        desc: 'Score higher with more correct picks',
      },
    },
    modes: {
      framesChoice: {
        title: 'Frames',
        description: 'Guess the movie from a frame. Pick one of four options.',
      },
      actorsChoice: {
        title: 'Actors',
        description: 'Guess the movie from its cast.',
      },
    },
    play: 'Play',
    soon: 'Soon',
  },
  footer: {
    tmdbCredit: 'Data provided by TMDB',
    tmdbDisclaimer:
      'This product uses the TMDB API but is not endorsed or certified by TMDB.',
  },
  game: {
    round: 'Round',
    score: 'Score',
    next: 'Next',
    skip: 'Skip',
    correct: 'Correct!',
    wrong: 'Wrong',
    answerWas: 'Correct answer: {title}',
    finish: 'Finish',
    loading: 'Loading...',
    error: 'Something went wrong',
    tokenMissing: 'TMDB token is not set. Open .env.local and paste your token.',
    prompt: {
      framesMovie: 'What movie is this?',
      framesTv: 'What show is this?',
      actorsMovie: 'What movie were they in?',
      actorsTv: 'What show were they in?',
    },
  },
  setup: {
    title: 'Set up your game',
    contentType: 'What to guess',
    category: 'Category',
    movies: 'Movies',
    tvShows: 'TV shows',
    start: 'Start',
  },
  filters: {
    all: 'All',
    top: 'Top',
    decade70: '70s',
    decade80: '80s',
    decade90: '90s',
    decade2000: '2000s',
    decade2010: '2010s',
    decade2020: '2020s',
    comedy: 'Comedy',
    drama: 'Drama',
    action: 'Action',
    thriller: 'Thriller',
    horror: 'Horror',
    scifi: 'Sci-Fi',
    crime: 'Crime',
    romance: 'Romance',
    animation: 'Animation',
  },
}
