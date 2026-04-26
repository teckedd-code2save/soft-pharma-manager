import { prisma } from '@/lib/db/prisma';

export interface LowStockExportRow {
  medicineId: number;
  medicineName: string;
  wholesalerId: string;
  wholesalerName: string;
  stockQuantity: number;
  threshold: number;
}

export async function exportLowStockCsv(threshold: number): Promise<string> {
  const suppliers = await prisma.medicineSupplier.findMany({
    where: {
      stock_quantity: { lte: threshold },
    },
    include: {
      medicine: true,
      wholesaler: true,
    },
    orderBy: {
      last_updated: 'desc',
    },
  });

  const header = [
    'medicine_id',
    'medicine_name',
    'wholesaler_id',
    'wholesaler_name',
    'stock_quantity',
    'threshold',
  ].join(',');

  const rows = suppliers.map((supplier) =>
    [
      supplier.medicine_id,
      supplier.medicine.name,
      supplier.wholesaler_id,
      supplier.wholesaler.name,
      supplier.stock_quantity ?? 0,
      threshold,
    ]
      .map((value) => `"${String(value).replace(/"/g, '""')}"`)
      .join(',')
  );

  return [header, ...rows].join('\n');
}
