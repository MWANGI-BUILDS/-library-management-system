DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "User") THEN
        RAISE EXCEPTION 'Cannot add required User.password while users exist; set secure password hashes before applying this migration.';
    END IF;
END $$;

ALTER TABLE "User"
    ADD COLUMN "password" TEXT NOT NULL;

ALTER TABLE "Genre"
    ADD COLUMN "slug" TEXT;

UPDATE "Genre"
SET "slug" = lower(trim(both '-' FROM regexp_replace("name", '[^a-zA-Z0-9]+', '-', 'g')))
WHERE "slug" IS NULL;

ALTER TABLE "Genre"
    ALTER COLUMN "slug" SET NOT NULL;

CREATE UNIQUE INDEX "Genre_slug_key" ON "Genre"("slug");

ALTER TABLE "Book"
    ADD COLUMN "coverImage" TEXT,
    ADD COLUMN "totalCopies" INTEGER NOT NULL DEFAULT 1,
    ADD COLUMN "availableCopies" INTEGER NOT NULL DEFAULT 1;

UPDATE "Book"
SET "description" = "title" || ' by ' || "author" || '.'
WHERE "description" IS NULL;

ALTER TABLE "Book"
    ALTER COLUMN "description" SET NOT NULL;
