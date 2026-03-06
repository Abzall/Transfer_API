# Transfer API — перевод детей между спортивными центрами

API для обработки обращений CHANGE_PROVIDER.  
Стек **NestJS, TypeScript, Prisma, PostgreSQL**.

## Техническое решение

- **Архитектура**:
  - `Controller` — тонкий слой для HTTP-запросов
  - `AppealsService` — orchestrator бизнес-логики
  - `TransferService` — перенос детей между программами
  - `Repositories` — работа с базой через Prisma
  - `Utils` — парсинг сообщения обращения
- **Безопасность данных**:
  - Каждому ребёнку создаётся новая запись enrollment с `status: PENDING`
  - Обработка ошибок для каждого ребёнка отдельно (`results[]`)
  - Если все переведены — обращение закрывается (`status: RESOLVED`)
  - 
- **Seed** для тестовых данных: создаются центры, программы, дети, enrollments и обращение

## Установка

Клонируем репозиторий:

```bash
git clone https://github.com/Abzall/Transfer_API.git
cd transfer-api
npm install

DATABASE_URL="postgresql://user:password@localhost:5432/dbname?schema=public"

Применяем схему и seed:
npx prisma db push
npx prisma db seed

Запускаем проект:
npm run start:dev

Эндпойнт:
POST /api/appeals/:id/transfer
