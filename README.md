# 🌦️ Proa Weather API

This project is part of the **PROA Coding Challenge**, designed to showcase how to structure and build a full-stack application using NestJS, TypeORM, and MySQL. The application exposes a RESTful API to access weather stations, variables, and measurements stored in a relational database.

---

## 📦 Technologies Used

- **NestJS** — Node.js framework for scalable server-side applications
- **TypeORM** — ORM for working with MySQL database
- **MySQL** — Relational database for storing weather data
- **dotenv** — Environment configuration
- **ts-node** — For running TypeScript scripts like CSV imports

---

## 🚀 Project Setup

Clone the repository and install dependencies:

```bash
git clone https://github.com/DinithAU/proa-weather-api.git
cd proa-weather-api
npm install
```

Create a `.env` file in the root with your database configuration:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=yourpassword
DB_NAME=weather_db
TYPEORM_SYNCHRONIZE=true
```

---

## 🛠️ Compile & Run

### Development

```bash
npm run start
```

### Watch Mode (Hot Reload)

```bash
npm run start:dev
```

---

## 📥 Run the Import Script


```bash
npx ts-node src/scripts/import.ts
```

Make sure the database is up and the `.env` is configured correctly before running this.

---