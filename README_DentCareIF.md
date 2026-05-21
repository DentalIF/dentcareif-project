# DentCareIF – вебсайт стоматологічної клініки

> Дипломний проєкт на тему «Вебсайт стоматологічної клініки».

## Опис проєкту

DentCareIF – вебсайт стоматологічної клініки з CRM-функціоналом, системою онлайн-запису, адміністративною панеллю та REST API.

## Технологічний стек

### Frontend
- HTML5
- CSS3
- JavaScript
- Bootstrap
- AOS
- Owl Carousel
- intl-tel-input

### Backend
- Node.js
- Express.js
- Prisma ORM
- PostgreSQL
- JWT
- bcrypt
- dotenv
- cors

### Deployment
- Netlify
- Render
- Supabase

---

## Архітектура

```txt
DentCareIF/
├── client/
└── server/
```

Архітектура backend:

```txt
route → controller → service → prisma → database
```

---

## Основний функціонал

- стоматологічні послуги;
- лікарі;
- CRM пацієнтів;
- система запису;
- dashboard;
- телефонні заявки;
- контактні звернення;
- адміністративна панель;
- CRUD лікарів;
- CRUD послуг;
- графіки лікарів.

---

## Система запису

1. Вибір послуги.
2. Вибір лікаря.
3. Вибір дати.
4. Отримання доступних слотів.
5. Створення запису.

Endpoint:

```txt
GET /api/appointments/available-slots
POST /api/appointments
```

---

## API

### Public API

```txt
GET /api/services
GET /api/services/:slug
GET /api/doctors
GET /api/doctors/service/:serviceId
POST /api/contact
POST /api/phone-leads
```

### Admin API

```txt
GET /api/admin/dashboard
GET /api/admin/appointments
GET /api/admin/patients
GET /api/admin/services
GET /api/admin/doctors
```

---

## Локальний запуск

```bash
cd server
npm install
npx prisma generate
npx prisma db push
npm run seed
npm run dev
```

Frontend запускається через Live Server.

---

## Production URLs

Frontend:

```txt
https://willowy-gelato-57bffd.netlify.app
```

Backend:

```txt
https://dentcareif-project.onrender.com
```

---

## Деплой

### Backend
- Render

### Frontend
- Netlify

### Database
- Supabase

---

## Майбутні покращення

- SMS notifications
- Telegram notifications
- Google Calendar
- онлайн-оплата
- аналітика
- email notifications

---

# Автор

Цвіклик Каріна

Дипломний проєкт:
«Вебсайт стоматологічної клініки»
