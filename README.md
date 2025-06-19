# Books Review Backend

A Node.js backend API for managing books, user reviews, favorites, authentication, and more. Built with Express, Sequelize (PostgreSQL), and Redis caching. Designed for scalability and easy integration with frontend clients.

---

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the Application](#running-the-application)
- [API Overview](#api-overview)
- [Project Structure](#project-structure)
- [Testing](#testing)
- [Docker Support](#docker-support)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **User Authentication** (JWT-based)
- **Book Management** (CRUD operations)
- **User Reviews** (add, edit, delete, fetch reviews)
- **Favorites** (add/remove favorite books)
- **Role-based Access Control**
- **Caching with Redis**
- **PostgreSQL Database** (via Sequelize ORM)
- **Dockerized Deployment**
- **Extensible API structure**

---

## Architecture

- **Node.js** with **Express.js** for RESTful API
- **Sequelize** ORM for PostgreSQL
- **Redis** for caching
- **JWT** for authentication
- Modular folder structure for scalability

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14+ recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Docker](https://www.docker.com/) (optional, for containerized setup)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/books-review-backend.git
   cd books-review-backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

### Environment Variables

Copy `.env.example` to `.env` and fill in your configuration:

```env

# PostgreSQL Database Configuration
DB_POSTGRES_HOST=localhost
DB_POSTGRES_USERNAME=postgres
DB_POSTGRES_PASSWORD=postgres
DB_POSTGRES_DBNAME=training_postgres
DB_POSTGRES_PORT=5432

# Redis Configuration
DB_REDIS_HOST=localhost
DB_REDIS_PORT=
```

### Running the Application

**Locally:**
```bash
npm start
```

**With Docker:**
```bash
docker-compose up --build
```

---

## API Overview

- **Auth:** `/auth`
  - `POST /login` - User login
  - `POST /register` - User registration

- **Books:** `/books`
  - `GET /` - List all books
  - `POST /` - Add a new book
  - `GET /:id` - Get book details
  - `PUT /:id` - Update book
  - `DELETE /:id` - Delete book

- **Reviews:** `/reviews`
  - `GET /book/:bookId` - List reviews for a book
  - `POST /book/:bookId` - Add review to a book

- **Favorites:** `/favorites`
  - `GET /` - List user favorites
  - `POST /:bookId` - Add book to favorites
  - `DELETE /:bookId` - Remove book from favorites

- **Users:** `/users`
  - `GET /me` - Get current user profile

- **Roles:** `/roles`
  - Manage user roles (admin, user, etc.)

*See [`traning_nurosoft_insomnia_LMS.yaml`](traning_nurosoft_insomnia_LMS.yaml) for API request examples.*

---

## Project Structure

```
books-review-backend/
│
├── auth/           # Authentication logic (JWT, middleware)
├── books/          # Book CRUD endpoints
├── reviews/        # Review endpoints
├── favorites/      # Favorites endpoints
├── users/          # User management
├── roles/          # Role-based access
├── database/       # Sequelize and Redis setup
├── utils/          # Utility functions
│
├── index.js        # Main entry point
├── Dockerfile      # Docker configuration
├── docker-compose.yaml
├── package.json
├── .env            # Environment variables
└── README.md
```

---

## Testing

- Use [Insomnia](https://insomnia.rest/) or [Postman](https://www.postman.com/) with the provided YAML collection: [`traning_nurosoft_insomnia_LMS.yaml`](traning_nurosoft_insomnia_LMS.yaml).
- Automated tests can be added in the `tests/` directory (not included by default).

---

## Docker Support

**Build and run with Docker Compose:**
```bash
docker-compose up --build
```
- PostgreSQL and Redis data are persisted in `postgres_data/` and `redis_data/`.

---

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

---

## License

This project is Free and Opensource for Portofolio purpose.

---

## Contact

For questions or support, open an issue or contact [widjojo.daniel98@gmail.com](mailto:widjojo.daniel98@gmail.com).