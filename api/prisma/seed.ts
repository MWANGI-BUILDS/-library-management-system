import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const genres = [
  { name: "Fantasy", description: "Imaginative worlds and magical elements." },
  { name: "Science Fiction", description: "Speculative stories about science and technology." },
  { name: "Mystery", description: "Stories centered on solving a puzzle or crime." },
  { name: "Historical Fiction", description: "Fiction set in a past historical period." },
];

const books = [
  { title: "The Name of the Wind", author: "Patrick Rothfuss", isbn: "9780756404741", publishedYear: 2007, genre: "Fantasy" },
  { title: "A Wizard of Earthsea", author: "Ursula K. Le Guin", isbn: "9780547722023", publishedYear: 1968, genre: "Fantasy" },
  { title: "The Hobbit", author: "J.R.R. Tolkien", isbn: "9780547928227", publishedYear: 1937, genre: "Fantasy" },
  { title: "The Fifth Season", author: "N.K. Jemisin", isbn: "9780316229296", publishedYear: 2015, genre: "Fantasy" },
  { title: "Dune", author: "Frank Herbert", isbn: "9780441172719", publishedYear: 1965, genre: "Science Fiction" },
  { title: "Kindred", author: "Octavia E. Butler", isbn: "9780807083697", publishedYear: 1979, genre: "Science Fiction" },
  { title: "The Left Hand of Darkness", author: "Ursula K. Le Guin", isbn: "9780441478125", publishedYear: 1969, genre: "Science Fiction" },
  { title: "Neuromancer", author: "William Gibson", isbn: "9780441569595", publishedYear: 1984, genre: "Science Fiction" },
  { title: "The Big Sleep", author: "Raymond Chandler", isbn: "9780394758282", publishedYear: 1939, genre: "Mystery" },
  { title: "The Murder of Roger Ackroyd", author: "Agatha Christie", isbn: "9780062073563", publishedYear: 1926, genre: "Mystery" },
  { title: "The Daughter of Time", author: "Josephine Tey", isbn: "9780684803869", publishedYear: 1951, genre: "Mystery" },
  { title: "The Hound of the Baskervilles", author: "Arthur Conan Doyle", isbn: "9780140437867", publishedYear: 1902, genre: "Mystery" },
  { title: "Wolf Hall", author: "Hilary Mantel", isbn: "9780312429980", publishedYear: 2009, genre: "Historical Fiction" },
  { title: "The Book Thief", author: "Markus Zusak", isbn: "9780375842207", publishedYear: 2005, genre: "Historical Fiction" },
  { title: "The Nightingale", author: "Kristin Hannah", isbn: "9780312577223", publishedYear: 2015, genre: "Historical Fiction" },
  { title: "A Tale of Two Cities", author: "Charles Dickens", isbn: "9780141439600", publishedYear: 1859, genre: "Historical Fiction" },
];

async function main() {
  const genreIds = new Map<string, number>();

  for (const genre of genres) {
    const savedGenre = await prisma.genre.upsert({
      where: { name: genre.name },
      update: { description: genre.description },
      create: genre,
    });
    genreIds.set(savedGenre.name, savedGenre.id);
  }

  for (const book of books) {
    const genreId = genreIds.get(book.genre);
    if (genreId === undefined) {
      throw new Error(`Seed data references an unknown genre: ${book.genre}`);
    }

    await prisma.book.upsert({
      where: { isbn: book.isbn },
      update: {
        title: book.title,
        author: book.author,
        publishedYear: book.publishedYear,
        genreId,
      },
      create: {
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        publishedYear: book.publishedYear,
        genreId,
      },
    });
  }
}

main()
  .catch((error: unknown) => {
    console.error("Failed to seed the database:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
