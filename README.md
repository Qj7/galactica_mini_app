# Galactica Admin

Веб-админка для просмотра запросов `parser_requests` из Supabase — записей, которые создаются при нажатии **Register** в Telegram-боте. Для каждого запроса отображается связанный товар из таблицы `products`.

## Стек

- **Next.js 16** (App Router, Server Components)
- **React 19**
- **Tailwind CSS 4**
- **Supabase JS** — чтение данных через REST API
- **date-fns** — форматирование дат

## Быстрый старт

```bash
cd admin
cp .env.local.example .env.local
# заполните NEXT_PUBLIC_SUPABASE_URL и NEXT_PUBLIC_SUPABASE_ANON_KEY
npm install
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000).

Значения `SUPABASE_URL` и `SUPABASE_KEY` из корневого `.env` проекта можно использовать как `NEXT_PUBLIC_SUPABASE_URL` и `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

## Запуск web + worker (Foreman)

Из папки `admin/`:

```bash
bundle install          # один раз
bundle exec foreman start
```

- **web** — Next.js admin на http://localhost:3000
- **worker** — Python-воркер из корня репозитория (нужен `.venv` и `.env` там)

Остановка: `Ctrl+C`.

## Features

- List of all registrations with join on `products`
- Filter by status: pending, processing, done, failed
- Status summary on desktop
- Responsive UI: table on desktop, cards on mobile
- **Set timeout** — schedule periodic API re-checks per request; changes are logged and shown in the admin panel
- Auto-refresh every 30 seconds (ISR)

## Database setup

Run the monitor migration in Supabase SQL Editor (or via CLI):

```bash
# from repo root
supabase db execute --file supabase/migrate_request_monitor.sql
```

Also apply updated RLS policies from `supabase/policies.sql` if not already applied.

The worker must be running for periodic checks to execute.

## Скрипты

| Команда       | Описание              |
|---------------|-----------------------|
| `npm run dev` | dev-сервер            |
| `npm run build` | production-сборка   |
| `npm start`   | запуск production     |
| `npm run lint`| ESLint                |

## Безопасность

Для production рекомендуется ограничить доступ к админке (Basic Auth, VPN, Supabase RLS с auth) — сейчас используется anon key с политиками чтения из `supabase/policies.sql`.
