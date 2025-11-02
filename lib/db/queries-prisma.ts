import { prisma } from './prisma';
import { SearchParams } from '@/lib/url-state';
export const ITEMS_PER_PAGE = 28;
export const EMPTY_IMAGE_URL =
  'https://s.gr-assets.com/assets/nophoto/book/111x148-bcc042a9c91a29c1d680899eff700a03.png';

function buildWhereClause(searchParams: SearchParams) {
  const where: any = {
    AND: [
      // Image filter
      {
        image_url: {
          not: null,
        },
      },
      {
        image_url: {
          not: EMPTY_IMAGE_URL,
        },
      },
    ],
  };

  // Year filter
  if (searchParams.yr) {
    const maxYear = Math.max(1950, Math.min(2023, Number(searchParams.yr)));
    where.publication_year = {
      gte: 1950,
      lte: maxYear,
    };
  } else {
    where.publication_year = {
      gte: 1950,
      lte: 2023,
    };
  }

  // Rating filter
  if (searchParams.rtg) {
    const minRating = Number(searchParams.rtg);
    where.average_rating = {
      gte: minRating.toString(),
    };
  }

  // Language filter
  if (searchParams.lng) {
    if (searchParams.lng === 'en') {
      where.language_code = {
        in: ['eng', 'en-US', 'en-GB'],
      };
    } else {
      where.language_code = searchParams.lng;
    }
  }

  // Pages filter
  if (searchParams.pgs) {
    const maxPages = Math.min(1000, Number(searchParams.pgs));
    where.num_pages = {
      lte: maxPages,
    };
  } else {
    where.num_pages = {
      lte: 1000,
    };
  }

  // Search filter
  if (searchParams.search) {
    where.title = {
      contains: searchParams.search,
      mode: 'insensitive',
    };
  }

  // ISBN filter
  if (searchParams.isbn) {
    const isbnArray = searchParams.isbn.split(',').map((id) => id.trim());
    where.isbn = {
      in: isbnArray,
    };
  }

  return where;
}

export async function fetchBooksWithPagination(searchParams: SearchParams) {
  const requestedPage = Math.max(1, Number(searchParams?.page) || 1);
  const offset = (requestedPage - 1) * ITEMS_PER_PAGE;

  const where = buildWhereClause(searchParams);

  const books = await prisma.book.findMany({
    where,
    select: {
      id: true,
      title: true,
      image_url: true,
      thumbhash: true,
    },
    orderBy: {
      id: 'asc',
    },
    skip: offset,
    take: ITEMS_PER_PAGE,
  });

  return books;
}

export async function estimateTotalBooks(searchParams: SearchParams) {
  const where = buildWhereClause(searchParams);

  const count = await prisma.book.count({
    where,
  });

  return count;
}

export async function fetchBookById(id: string) {
  const book = await prisma.book.findUnique({
    where: {
      id: parseInt(id),
    },
    include: {
      bookToAuthor: {
        include: {
          author: true,
        },
      },
    },
  });

  if (!book) return null;

  return {
    ...book,
    authors: book.bookToAuthor.map((ba: any) => ba.author.name),
  };
}