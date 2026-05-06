<div align="center">

# 🎬 Kadronix

**Игра-квиз про кино.** Угадывай фильмы и сериалы по кадрам и фотографиям актёров.

[![Vue 3](https://img.shields.io/badge/Vue-3-4FC08D?logo=vuedotjs&logoColor=white)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Pinia](https://img.shields.io/badge/Pinia-3-FFD75A?logo=pinia&logoColor=black)](https://pinia.vuejs.org/)
[![TMDB](https://img.shields.io/badge/TMDB-API-01B4E4?logo=themoviedatabase&logoColor=white)](https://www.themoviedb.org/)

[**🎮 Играть**](https://kadronix.ru) · [Архитектура](#-архитектура) · [Запуск](#-локальный-запуск) · [Деплой](#-как-это-задеплоено)

</div>

---

## ✨ Что это

Веб-игра, где тебе показывают **кадр из фильма** или **трио актёров** — а ты угадываешь название из четырёх вариантов. 10 раундов, счётчик попаданий.

Можно выбрать тип контента (фильмы или сериалы) и категорию: эпоха (от 70-х до 2020-х), жанр (комедии, ужасы, фантастика и др.), топ-рейтинг или просто популярное.

## 🎮 Возможности

- 🎬 **Два режима** — по кадрам и по составу актёров
- 📽 **Фильмы и сериалы** — переключение в один клик
- 🗓 **6 декад + 9 жанров** — для разнообразия пула
- 🌗 **Светлая и тёмная темы** — без FOUC при загрузке
- 🌍 **RU / EN** — локализация интерфейса и контента TMDB
- 📱 **Адаптив** — игра на мобильном, планшете и десктопе
- 🎨 **Кинематографичный дизайн** — золотой акцент, плавные переходы, blurred backdrop
- 🌐 **Работает без VPN из РФ** — благодаря собственному DoH-прокси для TMDB

## 🎯 Как играть

1. Выбери режим — **кадры** или **актёры**
2. Настрой категорию — фильмы или сериалы, эпоха или жанр
3. Угадай 10 раз — чем больше попаданий, тем выше счёт

## 🛠 Стек

| Слой | Технологии |
|------|------------|
| **Фронт** | Vue 3 (Composition API), TypeScript, Vite |
| **Стейт** | Pinia (тема, локаль), composables (игровая логика) |
| **Роутинг** | Vue Router 4 |
| **i18n** | vue-i18n 11 (RU / EN) |
| **Иконки** | lucide-vue-next |
| **Бэкенд** | Node.js (нативный http) + undici, systemd-сервис |
| **Прокси-фронтенд** | nginx + Let's Encrypt |
| **Источник данных** | TMDB API через DoH-резолв |

## 🏗 Архитектура

Модульная (feature-based / domain-driven). В корне `src/`:

```
src/
├── core/           # router, api/tmdb-client (HTTP-обёртка)
├── common/         # styles, i18n, layout, theme/locale stores
├── modules/
│   ├── main/       # Главная: hero, mode-cards
│   └── game/       # Игра: типы, сервисы, composables, components
│       ├── components/    # frames-choice-game, actors-choice-game
│       ├── composables/   # use-frames-choice-game, use-actors-choice-game, use-game-setup
│       ├── consts/        # filters, game (private)
│       ├── helpers/       # shuffle, pickRandom (private)
│       ├── models/        # типы (movie, round, setup, game-mode)
│       ├── services/      # tmdb-api, movie-pool (private)
│       └── index.ts       # ← публичный API модуля
└── pages/          # HomePage, SetupPage, GamePage (роуты)
```

**Соглашение:** другие модули и страницы могут импортировать **только** через `index.ts` модуля и **только** из `components/`, `composables/`, `models/`. Сервисы, helpers и константы — приватные.

### Поток данных в игре

```
[Браузер]
   ↓ GET kadronix.ru
[nginx] → отдаёт SPA (index.html + assets)
   ↓ Vue Router → setup screen → /play/:mode?type=movie&filter=90s
[useFramesChoiceGame composable]
   ↓ читает фильтр из route, вызывает loadMoviePool
[movie-pool.service]
   ↓ HTTP → api.kadronix.ru/api/discover/...
[nginx] → проксирует на 127.0.0.1:9002 (с кешем для /img/)
[Node-прокси]
   ↓ DoH-резолв → реальный IP TMDB → fetch с Bearer токеном
[TMDB API]
```

## 🌐 TMDB прокси (workaround для РКН)

В России TMDB заблокирован на DNS-уровне (TSPU подменяет ответы DNS на `127.0.0.1`). Решение — **собственный прокси-сервер** на Node.js, который:

- 🔍 Резолвит TMDB через **DoH** (DNS-over-HTTPS) — Cloudflare и Google как fallback
- 🛡 **Фильтрует приватные IP** в DoH-ответах (защита от подмены)
- 🎲 **Случайный выбор IP** из пула A-записей (round-robin к BunnyCDN)
- 🔁 **Auto-retry** при 403/5xx с инвалидацией кеша
- ⚡ **Кеш картинок в nginx** на 30 дней (2 ГБ диска) — снижает трафик и ускоряет
- 🔐 **TMDB-токен на сервере** — не утекает в браузер
- 🚀 **systemd-сервис** — автозапуск, перезапуск при падении

Подробнее в [`server/proxy.mjs`](server/proxy.mjs) (если хочешь поднять свой — забирай).

## 🚀 Локальный запуск

**Требования:** Node.js 22+, npm

```bash
# Клонировать
git clone https://github.com/HorhyDeGuzman/kadronix.git
cd kadronix

# Установить зависимости
npm install

# Создать .env.local
cp .env.example .env.local
```

В `.env.local` укажи URL прокси (готовый или свой):

```env
VITE_TMDB_API_BASE=https://api.kadronix.ru/api
VITE_TMDB_IMAGE_BASE=https://api.kadronix.ru/img
```

Запустить dev-сервер:

```bash
npm run dev
# → http://localhost:5173
```

## 📦 Скрипты

```bash
npm run dev       # Vite dev-сервер с HMR
npm run build     # Production-сборка → dist/
npm run preview   # Локальный preview production-бандла
```

## 🏭 Как это задеплоено

- **Фронт** ([kadronix.ru](https://kadronix.ru)) — статичный билд `dist/` под nginx + Let's Encrypt SSL
- **Прокси** ([api.kadronix.ru](https://api.kadronix.ru)) — Node-сервис под systemd, проксируется через тот же nginx
- **Хостинг** — российский VPS (1 vCPU / 1 ГБ RAM / 15 ГБ диска) с ispmanager
- **DNS** — Beget (`A`-записи на IP VPS)

CORS на прокси ограничен до `kadronix.ru` (плюс localhost для dev) — токен TMDB не доступен сторонним сайтам.

## 🤝 Кредиты

Этот сайт использует [**TMDB**](https://www.themoviedb.org/) для данных о фильмах, сериалах и актёрах.  
Этот продукт использует TMDB API, но **не одобрен и не аккредитован TMDB**.

<div align="center">
  <a href="https://www.themoviedb.org/">
    <img src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg" width="120" alt="TMDB"/>
  </a>
</div>

---

<div align="center">
  Сделано с ❤️ для любителей кино.<br/>
  <sub>Vue 3 · TypeScript · Pinia · BEM · Модульная архитектура · Реактивная композиция · DoH-прокси · Кеширование на edge</sub>
</div>
