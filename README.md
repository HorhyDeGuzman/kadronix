# Kadronix

Игра-квиз про кино. Угадывай фильмы и сериалы по кадрам и фотографиям актёров. 10 раундов, фильтры по эпохам и жанрам.

## Стек

- **Vue 3** (Composition API) + **TypeScript**
- **Vite** — dev / build
- **Pinia** — стейт (тема, локаль)
- **Vue Router** — навигация
- **vue-i18n** — RU / EN
- **lucide-vue-next** — иконки
- **TMDB API** — данные о фильмах и сериалах (через свой DoH-прокси)

## Архитектура

Модульная (feature-based):

```
src/
├── core/          # router, api, infrastructure
├── common/        # styles, i18n, layout, shared store
├── modules/
│   ├── main/      # главная: hero, mode cards
│   └── game/      # игровая логика, оба режима, setup
└── pages/         # HomePage, SetupPage, GamePage
```

Каждый модуль экспортирует публичный API через `index.ts` (только из `components/`, `composables/`, `models/`).

## Локальный запуск

```bash
npm install
cp .env.example .env.local
# впиши свой VITE_TMDB_TOKEN (Read Access Token v4 с themoviedb.org)
npm run dev
```

## Деплой

`VITE_TMDB_API_BASE` и `VITE_TMDB_IMAGE_BASE` указывают на прокси, который проксирует запросы к TMDB через DoH (нужно для обхода блокировки в РФ). Прокси-сервер — отдельный Node-процесс на VPS.

## Атрибуция

Этот сайт использует [TMDB API](https://www.themoviedb.org/), но не одобрен и не аккредитован TMDB.
