# Book my Show API Project

## Description

This project is a REST API for a book my show clone. It is built with Node and Express.
For the DB it uses a new and upcoming ORM called Drizzle.
Drizzle has a very sql-like syntax and is very easy to use. And also handles migrations and seeding.

## Installation

```bash
$ pnpm install
```

## Running the app

```bash
$ pnpm run start
```

## The following endpoints are available

```bash

Movie Routes
$ GET /movies
$ GET /movies/:id
$ POST /movies
$ PUT /movies/:id
$ DELETE /movies/:id
$ GET /movies/:id/bookings
$ GET /movies/:id/bookings/:id

Booking Routes
$ GET /bookings
$ GET /bookings/:id
$ POST /bookings
$ PUT /bookings/:id
$ DELETE /bookings/:id

User Routes
$ GET /users
$ GET /users/:id
$ POST /users
$ PUT /users/:id
$ DELETE /users/:id
$ GET /users/:id/bookings
$ GET /users/:id/bookings/:id

```
