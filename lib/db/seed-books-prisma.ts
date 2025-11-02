import path from 'path';
import { prisma } from './prisma';
import { processEntities } from './seed-utils-prisma';

const BATCH_SIZE = 900;
const CHECKPOINT_FILE = 'book_import_checkpoint.json';
const TOTAL_BOOKS = 4;

interface BookData {
  isbn: string | null;
  isbn13: string | null;
  title: string;
  authors: string[];
  publication_year: number | null;
  publisher: string | null;
  image_url: string | null;
  description: string | null;
  num_pages: number | null;
  language_code: string | null;
  text_reviews_count: number | null;
  ratings_count: number | null;
  average_rating: number | null;
  series: string[] | null;
  popular_shelves: Record<string, number>;
}

async function batchInsertBooks(batch: BookData[]) {
  return prisma.$transaction(async (tx) => {
    for (const book of batch) {
      const createdBook = await tx.book.upsert({
        where: { isbn: book.isbn || '' },
        update: {},
        create: {
          isbn: book.isbn,
          isbn13: book.isbn13,
          title: book.title,
          publication_year: book.publication_year,
          publisher: book.publisher,
          image_url: book.image_url,
          description: book.description,
          num_pages: book.num_pages,
          language_code: book.language_code,
          text_reviews_count: book.text_reviews_count,
          ratings_count: book.ratings_count,
          average_rating: book.average_rating?.toString(),
          series: book.series || [],
          popular_shelves: book.popular_shelves,
        },
      });

      // Create book-author relationships
      for (const authorName of book.authors) {
        // Create or find author
        const author = await tx.author.upsert({
          where: { id: authorName },
          update: {},
          create: {
            id: authorName,
            name: authorName,
          },
        });

        await tx.bookToAuthor.upsert({
          where: {
            bookId_authorId: {
              bookId: createdBook.id,
              authorId: author.id,
            },
          },
          update: {},
          create: {
            bookId: createdBook.id,
            authorId: author.id,
          },
        });
      }
    }
  });
}

async function main() {
  try {
    const bookCount = await processEntities<BookData>(
      path.resolve('./lib/db/books-full.json'),
      CHECKPOINT_FILE,
      BATCH_SIZE,
      batchInsertBooks,
      TOTAL_BOOKS
    );
    console.log(
      `Seeded ${bookCount.toLocaleString()} / ${TOTAL_BOOKS.toLocaleString()} books`
    );
  } catch (error) {
    console.error('Error seeding books:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(console.error);