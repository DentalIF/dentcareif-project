
# DentCareIF – вебсайт стоматологічної клініки

> Дипломний проєкт на тему «Вебсайт стоматологічної клініки».

---

# Зміст

- Опис проєкту
- Основний функціонал
- Технологічний стек
- Архітектурні рішення
- Структура проєкту
- Frontend
- Backend
- База даних
- Система запису на прийом
- Адміністративна панель
- API
- Авторизація адміністратора
- Локальний запуск
- Environment variables
- Seed даних
- Деплой
- Перевірка після деплою
- Безпека
- Майбутні покращення

---

# Опис проєкту

DentCareIF – це повноцінний вебсайт стоматологічної клініки з інтегрованою CRM-системою, адміністративною панеллю та REST API.

Проєкт включає:
- публічний вебсайт;
- систему онлайн-запису;
- CRM пацієнтів;
- систему телефонних заявок;
- контактні звернення;
- dashboard зі статистикою;
- CRUD для лікарів;
- CRUD для послуг;
- систему керування графіками лікарів;
- PostgreSQL базу даних;
- production deployment.

---

# Основний функціонал

## Публічна частина

- головна сторінка;
- сторінка про клініку;
- сторінка послуг;
- сторінка окремої послуги;
- сторінка лікарів;
- сторінка запису на прийом;
- сторінка контактів;
- адаптивна верстка;
- модальні вікна лікарів;
- модальні вікна послуг;
- телефонні заявки;
- контактні форми;
- форматування телефонних номерів;
- анімації під час скролу.

## CRM-функціонал

- пацієнти;
- записи;
- історія звернень;
- статуси записів;
- dashboard статистика;
- телефонні заявки;
- графіки лікарів.

## Адмінпанель

- dashboard;
- записи;
- пацієнти;
- лікарі;
- послуги;
- категорії послуг;
- звернення;
- телефонні заявки;
- статуси;
- CSV export.

---

# Технологічний стек

## Frontend

- HTML5
- CSS3
- JavaScript
- Bootstrap
- AOS
- Owl Carousel
- intl-tel-input

## Backend

- Node.js
- Express.js
- Prisma ORM
- PostgreSQL
- JWT
- bcrypt
- dotenv
- cors

## Database

- Supabase PostgreSQL

## Deployment

- Netlify – frontend
- Render – backend
- Supabase – база даних

---

# Архітектурні рішення

Проєкт побудований за принципом розділення frontend і backend.

```txt
DentCareIF/
├── client/
└── server/
```

## Frontend

Frontend є окремим статичним застосунком.

Основні задачі:
- рендер UI;
- взаємодія з API;
- робота з модальними вікнами;
- система запису;
- динамічне завантаження даних;
- UX логіка;
- форматування номерів телефону.

## Backend

Архітектура backend:

```txt
route → controller → service → prisma → database
```

Це дозволяє:
- відокремити бізнес-логіку;
- спростити підтримку коду;
- масштабувати API;
- уникати дублювання логіки.

## Database Layer

Для роботи з PostgreSQL використовується Prisma ORM.

Prisma забезпечує:
- типізовану роботу з БД;
- генерацію Prisma Client;
- seed даних;
- синхронізацію schema;
- роботу з relations.

---

# Структура проєкту

```txt
DentCareIF/
│
├── client/
│   ├── admin/
│   ├── assets/
│   │   ├── css/
│   │   ├── img/
│   │   └── js/
│   │
│   ├── index.html
│   ├── about.html
│   ├── service.html
│   ├── team.html
│   ├── appointment.html
│   ├── contact.html
│   └── price.html
│
└── server/
    ├── prisma/
    │   ├── schema.prisma
    │   ├── seed.js
    │   ├── seedAdmin.js
    │   └── seedDoctors.js
    │
    ├── src/
    │   ├── config/
    │   ├── controllers/
    │   ├── middleware/
    │   ├── routes/
    │   ├── services/
    │   ├── utils/
    │   ├── app.js
    │   └── server.js
    │
    └── package.json
```

---

# Frontend

Frontend розміщений у папці `client`.

Використовується статичний frontend із динамічним отриманням даних через REST API.

## Основні сторінки

| Сторінка | Призначення |
|---|---|
| index.html | Головна сторінка |
| about.html | Інформація про клініку |
| service.html | Список послуг |
| team.html | Лікарі |
| appointment.html | Онлайн-запис |
| contact.html | Контакти |
| admin/login.html | Логін адміністратора |
| admin/dashboard.html | Адмінпанель |

## Frontend JavaScript

### config.js

Містить production API URL:

```js
window.API_BASE_URL = 'https://dentcareif-project.onrender.com'
```

### main.js

Відповідає за:
- динамічні послуги;
- динамічних лікарів;
- модальні вікна;
- систему запису;
- часові слоти;
- контактні форми;
- телефонні заявки.

### dashboard.js

Відповідає за:
- dashboard статистику;
- CRUD;
- таблиці записів;
- таблиці пацієнтів;
- статуси;
- телефонні заявки.

---

# Backend

Backend розміщений у папці `server`.

## package.json scripts

```json
{
  "dev": "nodemon src/server.js",
  "start": "node src/server.js",
  "seed": "node prisma/seed.js",
  "seed:admin": "node prisma/seedAdmin.js",
  "seed:doctors": "node prisma/seedDoctors.js"
}
```

## Основні залежності

| Бібліотека | Призначення |
|---|---|
| express | REST API |
| prisma | ORM |
| @prisma/client | Prisma Client |
| bcrypt | Хешування паролів |
| jsonwebtoken | JWT |
| cors | CORS |
| dotenv | Environment variables |

---

# База даних

У проєкті використовується PostgreSQL через Supabase.

## Основні сутності

### ServiceCategory
Категорії стоматологічних послуг.

### Service
Стоматологічні послуги:
- title;
- slug;
- shortDesc;
- fullDesc;
- price;
- duration;
- image;
- FAQ;
- steps;
- included;
- indications.

### Doctor
Лікарі клініки:
- ім’я;
- прізвище;
- спеціалізація;
- досвід;
- освіта;
- сертифікати;
- фото.

### DoctorService
Many-to-many таблиця між лікарями та послугами.

### DoctorSchedule
Графік роботи лікарів.

### Appointment
Онлайн-записи пацієнтів.

### Patient
CRM-картки пацієнтів.

### ContactMessage
Контактні звернення.

### PhoneLead
Телефонні заявки.

### AdminUser
Адміністратори системи.

---

# Система запису на прийом

Система запису є одним із ключових модулів проєкту.

## Алгоритм роботи

### 1. Вибір послуги

Frontend отримує:

```txt
GET /api/services
```

### 2. Завантаження лікарів

```txt
GET /api/doctors/service/:serviceId
```

### 3. Вибір дати

Користувач обирає дату прийому.

### 4. Отримання слотів

```txt
GET /api/appointments/available-slots
```

Backend враховує:
- графік лікаря;
- тривалість послуги;
- зайняті записи;
- статуси записів;
- конфлікти часу.

### 5. Створення запису

```txt
POST /api/appointments
```

Backend:
- перевіряє конфлікти;
- створює запис;
- створює або оновлює пацієнта;
- зберігає дані у БД.

## Статуси записів

```txt
NEW
CONFIRMED
COMPLETED
CANCELED
```

---

# Адміністративна панель

Production URL:

```txt
https://willowy-gelato-57bffd.netlify.app/admin/dashboard.html
```

## Dashboard

Показує:
- нові записи;
- сьогоднішні записи;
- пацієнтів;
- звернення;
- телефонні заявки.

## Записи

Можливості:
- перегляд;
- зміна статусів;
- сортування;
- перегляд пацієнта;
- перегляд лікаря;
- перегляд послуги.

## Пацієнти

CRM-картки:
- ПІБ;
- телефон;
- історія записів.

## Лікарі

CRUD:
- створення;
- редагування;
- графіки роботи;
- прив’язка послуг.

## Послуги

CRUD стоматологічних послуг.

## Телефонні заявки

- перегляд номерів;
- статуси;
- CSV export.

---

# API

## Публічні endpoint

| Method | Endpoint |
|---|---|
| GET | /api/health |
| GET | /api/services |
| GET | /api/services/:slug |
| GET | /api/doctors |
| GET | /api/doctors/service/:serviceId |
| GET | /api/appointments/available-slots |
| POST | /api/appointments |
| POST | /api/contact |
| POST | /api/phone-leads |
| POST | /api/auth/login |

## Admin endpoint

| Method | Endpoint |
|---|---|
| GET | /api/admin/dashboard |
| GET | /api/admin/appointments |
| PATCH | /api/admin/appointments/:id/status |
| GET | /api/admin/patients |
| GET | /api/admin/contacts |
| GET | /api/admin/phone-leads |
| GET | /api/admin/services |
| POST | /api/admin/services |
| PUT | /api/admin/services/:id |
| GET | /api/admin/doctors |
| POST | /api/admin/doctors |
| PUT | /api/admin/doctors/:id |

---

# Авторизація адміністратора

У проєкті використовується JWT авторизація.

Алгоритм:
1. Адміністратор логіниться.
2. Backend генерує JWT token.
3. Token зберігається у localStorage.
4. Protected routes перевіряють token.

---

# Локальний запуск

## 1. Клонування репозиторію

```bash
git clone https://github.com/DentalIF/dentcareif-project.git
```

## 2. Backend

```bash
cd server
npm install
```

## 3. .env

```env
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
JWT_SECRET="dentcare_secret_key"
CLIENT_URL="http://127.0.0.1:5500"
```

## 4. Prisma

```bash
npx prisma generate
npx prisma db push
```

## 5. Seed

```bash
npm run seed
npm run seed:admin
```

## 6. Backend

```bash
npm run dev
```

## 7. Frontend

Відкрити папку `client` через Live Server.

---

# Environment variables

| Variable | Призначення |
|---|---|
| DATABASE_URL | PostgreSQL connection |
| DIRECT_URL | Prisma direct URL |
| JWT_SECRET | JWT secret |
| CLIENT_URL | Frontend URL |
| PORT | Port сервера |

---

# Seed даних

## seed.js

Створює:
- категорії;
- послуги;
- лікарів;
- графіки роботи.

## seedAdmin.js

Створює адміністратора.

## seedDoctors.js

Створює тестових лікарів.

---

# Деплой

## Production архітектура

```txt
Frontend → Netlify
Backend → Render
Database → Supabase
```

## Render

### Root Directory

```txt
server
```

### Build Command

```bash
npm install && npx prisma generate
```

### Start Command

```bash
npx prisma generate && npm start
```

## Netlify

### Base directory

```txt
client
```

### Publish directory

```txt
.
```

---

# Production URLs

## Frontend

```txt
https://willowy-gelato-57bffd.netlify.app
```

## Backend

```txt
https://dentcareif-project.onrender.com
```

---

# Перевірка після деплою

## Публічна частина

- головна сторінка;
- послуги;
- лікарі;
- запис;
- контакти;
- телефонні заявки;
- модальні вікна.

## Онлайн-запис

- вибір послуги;
- вибір лікаря;
- часові слоти;
- success modal.

## Адмінка

- dashboard;
- записи;
- пацієнти;
- CRUD;
- телефонні заявки;
- CSV export.

---

# Безпека

Реалізовано:
- JWT авторизацію;
- bcrypt hashing;
- protected routes;
- CORS;
- environment variables;
- відсутність .env у GitHub.

---

# Майбутні покращення

- SMS notifications;
- Telegram notifications;
- Google Calendar integration;
- онлайн-оплата;
- email notifications;
- storage для фото;
- pagination;
- аналітика;
- розширена CRM.

---

# Призначення проєкту

Проєкт демонструє:
- frontend/backend архітектуру;
- REST API;
- PostgreSQL;
- Prisma ORM;
- JWT авторизацію;
- CRM-функціонал;
- систему онлайн-запису;
- production deployment.

---

# Автор

Цвіклик Каріна

Дипломний проєкт:
«Вебсайт стоматологічної клініки»
