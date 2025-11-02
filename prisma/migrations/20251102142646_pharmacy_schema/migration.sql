/*
  Warnings:

  - You are about to drop the `authors` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `book_to_author` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `books` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."book_to_author" DROP CONSTRAINT "book_to_author_author_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."book_to_author" DROP CONSTRAINT "book_to_author_book_id_fkey";

-- DropTable
DROP TABLE "public"."authors";

-- DropTable
DROP TABLE "public"."book_to_author";

-- DropTable
DROP TABLE "public"."books";

-- CreateTable
CREATE TABLE "brands" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "brands_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wholesalers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "wholesalers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "formulations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "formulations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medicines" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "brand_id" TEXT NOT NULL,
    "wholesaler_id" TEXT NOT NULL,
    "formulation_id" TEXT NOT NULL,
    "strength" TEXT,
    "pack_size" TEXT,
    "price" DECIMAL(10,2),
    "stock_quantity" INTEGER,
    "expiry_date" TIMESTAMP(3),
    "batch_number" TEXT,
    "description" TEXT,
    "image_url" TEXT,
    "thumbhash" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "medicines_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_medicines_brand" ON "medicines"("brand_id");

-- CreateIndex
CREATE INDEX "idx_medicines_wholesaler" ON "medicines"("wholesaler_id");

-- CreateIndex
CREATE INDEX "idx_medicines_formulation" ON "medicines"("formulation_id");

-- CreateIndex
CREATE INDEX "idx_medicines_price" ON "medicines"("price");

-- CreateIndex
CREATE INDEX "idx_medicines_stock" ON "medicines"("stock_quantity");

-- CreateIndex
CREATE INDEX "idx_medicines_expiry" ON "medicines"("expiry_date");

-- CreateIndex
CREATE INDEX "idx_medicines_created_at" ON "medicines"("created_at");

-- AddForeignKey
ALTER TABLE "medicines" ADD CONSTRAINT "medicines_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "brands"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medicines" ADD CONSTRAINT "medicines_wholesaler_id_fkey" FOREIGN KEY ("wholesaler_id") REFERENCES "wholesalers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medicines" ADD CONSTRAINT "medicines_formulation_id_fkey" FOREIGN KEY ("formulation_id") REFERENCES "formulations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
