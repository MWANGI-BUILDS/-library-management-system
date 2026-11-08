# Library Management System

This project includes a PostgreSQL-backed Prisma data layer for a library catalog.

## Database setup

1. Copy `api/.env.example` to `api/.env` and set `DATABASE_URL` to your PostgreSQL connection string.
2. From `api/`, install dependencies with `npm install`.
3. On a development database, use `npm run db:migrate:dev -- --name init` to create and apply the initial migration. This repository already has a checked-in migration; for an existing or hosted database, apply pending migrations with `npm run db:migrate`.
4. Run `npm run db:generate` to generate the Prisma Client.
5. Run `npm run db:seed` to insert or update the sample genres and books. The seed uses stable ISBNs and upserts, so rerunning it does not duplicate those catalog rows.
6. Run `npm run db:studio` to inspect the data in Prisma Studio.

The connection string is intentionally a placeholder in the example file; provide database credentials through your local environment and do not commit them.
If a Supabase direct connection is unreachable on an IPv4-only network, use the project's Session pooler URI instead.
Store password hashes, never plaintext passwords, in `User.password`.

## Schema Decisions

`Book` references `Genre` through `genreId` instead of embedding genre details in each book. A normalized relation avoids repeating genre names and descriptions across many books, lets a genre's details be updated once, and allows the database to enforce that every book points to an existing genre. The one-to-many relationship also makes it straightforward to query all books in a genre.

`Genre.slug` provides a unique, URL-friendly identifier. `Book` tracks total and available copy counts so catalog quantity and availability are explicit, while `User` uses a `Role` enum for the supported `PATRON` and `LIBRARIAN` roles. Reviews are modeled as their own relation between users and books, with one review per user per book.

One difference from a document database is that Prisma makes relationships and referential integrity explicit in the schema and database: a book's genre is connected by a foreign key rather than copied as a nested document.
