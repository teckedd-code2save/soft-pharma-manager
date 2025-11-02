-- CreateTable
CREATE TABLE "authors" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "average_rating" DECIMAL(3,2),
    "text_reviews_count" INTEGER,
    "ratings_count" INTEGER,

    CONSTRAINT "authors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "books" (
    "id" SERIAL NOT NULL,
    "isbn" TEXT,
    "isbn13" TEXT,
    "title" TEXT NOT NULL,
    "publication_year" INTEGER,
    "publisher" TEXT,
    "image_url" TEXT,
    "description" TEXT,
    "num_pages" INTEGER,
    "language_code" TEXT,
    "text_reviews_count" INTEGER,
    "ratings_count" INTEGER,
    "average_rating" DECIMAL(3,2),
    "series" TEXT[],
    "popular_shelves" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB,
    "thumbhash" TEXT,

    CONSTRAINT "books_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "book_to_author" (
    "book_id" INTEGER NOT NULL,
    "author_id" TEXT NOT NULL,

    CONSTRAINT "book_to_author_pkey" PRIMARY KEY ("book_id","author_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "books_isbn_key" ON "books"("isbn");

-- CreateIndex
CREATE INDEX "idx_books_publication_year" ON "books"("publication_year");

-- CreateIndex
CREATE INDEX "idx_books_average_rating" ON "books"("average_rating");

-- CreateIndex
CREATE INDEX "idx_books_language_code" ON "books"("language_code");

-- CreateIndex
CREATE INDEX "idx_books_num_pages" ON "books"("num_pages");

-- CreateIndex
CREATE INDEX "idx_books_created_at" ON "books"("created_at");

-- CreateIndex
CREATE INDEX "idx_books_isbn" ON "books"("isbn");

-- CreateIndex
CREATE INDEX "idx_books_id_title_image_url_thumbhash" ON "books"("id", "title", "image_url", "thumbhash");

-- AddForeignKey
ALTER TABLE "book_to_author" ADD CONSTRAINT "book_to_author_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "books"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "book_to_author" ADD CONSTRAINT "book_to_author_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "authors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
