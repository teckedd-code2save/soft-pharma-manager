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
    "brand_name" TEXT,
    "generic_name" TEXT,
    "brand_id" TEXT NOT NULL,
    "formulation_id" TEXT NOT NULL,
    "strength" TEXT,
    "pack_size" TEXT,
    "description" TEXT,
    "image_url" TEXT,
    "thumbhash" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "medicines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medicine_suppliers" (
    "id" SERIAL NOT NULL,
    "medicine_id" INTEGER NOT NULL,
    "wholesaler_id" TEXT NOT NULL,
    "invoice_number" TEXT,
    "invoice_date" TIMESTAMP(3),
    "unit_price" DECIMAL(10,2) NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "stock_quantity" INTEGER,
    "batch_number" TEXT,
    "expiry_date" TIMESTAMP(3),
    "last_updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "medicine_suppliers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_medicines_brand" ON "medicines"("brand_id");

-- CreateIndex
CREATE INDEX "idx_medicines_formulation" ON "medicines"("formulation_id");

-- CreateIndex
CREATE INDEX "idx_medicines_name" ON "medicines"("name");

-- CreateIndex
CREATE INDEX "idx_medicines_brand_name" ON "medicines"("brand_name");

-- CreateIndex
CREATE INDEX "idx_medicines_generic_name" ON "medicines"("generic_name");

-- CreateIndex
CREATE INDEX "idx_medicines_created_at" ON "medicines"("created_at");

-- CreateIndex
CREATE INDEX "idx_medicine_suppliers_medicine" ON "medicine_suppliers"("medicine_id");

-- CreateIndex
CREATE INDEX "idx_medicine_suppliers_wholesaler" ON "medicine_suppliers"("wholesaler_id");

-- CreateIndex
CREATE INDEX "idx_medicine_suppliers_price" ON "medicine_suppliers"("unit_price");

-- CreateIndex
CREATE INDEX "idx_medicine_suppliers_invoice_date" ON "medicine_suppliers"("invoice_date");

-- CreateIndex
CREATE UNIQUE INDEX "medicine_suppliers_medicine_id_wholesaler_id_key" ON "medicine_suppliers"("medicine_id", "wholesaler_id");

-- AddForeignKey
ALTER TABLE "medicines" ADD CONSTRAINT "medicines_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "brands"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medicines" ADD CONSTRAINT "medicines_formulation_id_fkey" FOREIGN KEY ("formulation_id") REFERENCES "formulations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medicine_suppliers" ADD CONSTRAINT "medicine_suppliers_medicine_id_fkey" FOREIGN KEY ("medicine_id") REFERENCES "medicines"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medicine_suppliers" ADD CONSTRAINT "medicine_suppliers_wholesaler_id_fkey" FOREIGN KEY ("wholesaler_id") REFERENCES "wholesalers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
