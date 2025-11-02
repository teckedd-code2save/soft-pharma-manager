import Link from 'next/link';
import { Photo } from './photo';
import { SearchParams, stringifySearchParams } from '@/lib/url-state';

type Book = {
  id: number;
  title: string;
  image_url: string | null;
  thumbhash: string | null;
};

export async function BooksGrid({
  books,
  searchParams,
}: {
  books: any[];
  searchParams: SearchParams;
}) {
  console.log('Books data:', books?.length, books?.[0]); // Debug log
  
  return (
    <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7">
      {!books?.length ? (
        <p className="text-center text-muted-foreground col-span-full">
          No books found.
        </p>
      ) : (
        books.map((book, index) => (
          <BookLink
            key={book.id}
            priority={index < 10}
            book={book}
            searchParams={searchParams}
          />
        ))
      )}
    </div>
  );
}

function BookLink({
  priority,
  book,
  searchParams,
}: {
  priority: boolean;
  book: any;
  searchParams: SearchParams;
}) {
  let noFilters = Object.values(searchParams).every((v) => v === undefined);

  // Show book even without thumbhash, with fallback
  return (
    <Link
      href={`/${book.id}?${stringifySearchParams(searchParams)}`}
      key={book.id}
      className="block transition ease-in-out md:hover:scale-105"
      prefetch={noFilters ? true : null}
    >
      {book.thumbhash ? (
        <Photo
          src={book.image_url!}
          title={book.title}
          thumbhash={book.thumbhash}
          priority={priority}
        />
      ) : (
        <div className="relative aspect-[2/3] w-full overflow-hidden rounded-md bg-muted shadow-md flex items-center justify-center">
          <div className="text-center p-2">
            <div className="text-sm font-medium truncate">{book.title}</div>
            <div className="text-xs text-muted-foreground mt-1">No Image</div>
          </div>
        </div>
      )}
    </Link>
  );
}
