# Library Management System

This project includes a PostgreSQL-backed Prisma data layer for a library catalog.

## Database setup

1. Copy `api/.env.example` to `api/.env` and set `DATABASE_URL` to your PostgreSQL connection string.
2. From `api/`, install dependencies with `npm install`.
3. Run `npm run db:migrate` to apply the checked-in migration.
4. Run `npm run db:generate` to generate the Prisma Client.
5. Run `npm run db:seed` to insert the sample genres and books. The seed uses upserts, so rerunning it does not duplicate catalog rows.

The connection string is intentionally a placeholder in the example file; provide database credentials through your local environment and do not commit them.
If a Supabase direct connection is unreachable on an IPv4-only network, use the project's Session pooler URI instead.

## Schema Decisions

`Book` references `Genre` through `genreId` instead of embedding genre details in each book. A normalized relation avoids repeating genre names and descriptions across many books, lets a genre's details be updated once, and allows the database to enforce that every book points to an existing genre. The one-to-many relationship also makes it straightforward to query all books in a genre.

`User` has a `Role` enum for the supported `PATRON` and `LIBRARIAN` roles. Reviews are modeled as their own relation between users and books, with one review per user per book.

One difference from a document database is that Prisma makes relationships and referential integrity explicit in the schema and database: a book's genre is connected by a foreign key rather than copied as a nested document.
