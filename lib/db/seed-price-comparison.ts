import { prisma } from './prisma';

async function main() {
  // Create more comprehensive brands (Ghanaian & International)
  const brands = await Promise.all([
    prisma.brand.upsert({
      where: { id: 'himalaya' },
      update: {},
      create: { id: 'himalaya', name: 'Himalaya' },
    }),
    prisma.brand.upsert({
      where: { id: 'pfizer' },
      update: {},
      create: { id: 'pfizer', name: 'Pfizer' },
    }),
    prisma.brand.upsert({
      where: { id: 'glaxo-smith-kline' },
      update: {},
      create: { id: 'glaxo-smith-kline', name: 'GlaxoSmithKline' },
    }),
    prisma.brand.upsert({
      where: { id: 'johnson-johnson' },
      update: {},
      create: { id: 'johnson-johnson', name: 'Johnson & Johnson' },
    }),
    prisma.brand.upsert({
      where: { id: 'novartis' },
      update: {},
      create: { id: 'novartis', name: 'Novartis' },
    }),
    prisma.brand.upsert({
      where: { id: 'sanofi' },
      update: {},
      create: { id: 'sanofi', name: 'Sanofi' },
    }),
  ]);

  // Create Ghanaian wholesalers/retailers
  const wholesalers = await Promise.all([
    prisma.wholesaler.upsert({
      where: { id: 'medtb-warehouse' },
      update: {},
      create: { id: 'medtb-warehouse', name: 'ESTIMATED (MEDTB CNT. WAREHOUSE)' },
    }),
    prisma.wholesaler.upsert({
      where: { id: 'espat-pharmacy' },
      update: {},
      create: { id: 'espat-pharmacy', name: 'ESPAT PHARMACY' },
    }),
    prisma.wholesaler.upsert({
      where: { id: 'letonia-pharmacy' },
      update: {},
      create: { id: 'letonia-pharmacy', name: 'LETONIA PHARMACY LTD' },
    }),
    prisma.wholesaler.upsert({
      where: { id: 'damoah-pharmacy' },
      update: {},
      create: { id: 'damoah-pharmacy', name: 'DAMOAH PHARMACY' },
    }),
    prisma.wholesaler.upsert({
      where: { id: 'metro-pharmacy' },
      update: {},
      create: { id: 'metro-pharmacy', name: 'METRO PHARMACY' },
    }),
    prisma.wholesaler.upsert({
      where: { id: 'mckesson' },
      update: {},
      create: { id: 'mckesson', name: 'McKesson Corporation' },
    }),
  ]);

  // Create formulations
  const formulations = await Promise.all([
    prisma.formulation.upsert({
      where: { id: 'syrup' },
      update: {},
      create: { id: 'syrup', name: 'Syrup' },
    }),
    prisma.formulation.upsert({
      where: { id: 'tablet' },
      update: {},
      create: { id: 'tablet', name: 'Tablet' },
    }),
    prisma.formulation.upsert({
      where: { id: 'capsule' },
      update: {},
      create: { id: 'capsule', name: 'Capsule' },
    }),
    prisma.formulation.upsert({
      where: { id: 'injection' },
      update: {},
      create: { id: 'injection', name: 'Injection' },
    }),
    prisma.formulation.upsert({
      where: { id: 'cream' },
      update: {},
      create: { id: 'cream', name: 'Cream' },
    }),
  ]);

  // Create medicines with diverse suppliers for price comparison
  const mentalSyr = await prisma.medicine.upsert({
    where: { id: 10 },
    update: {},
    create: {
      name: 'Mentat Syr 100ml',
      brand_name: 'Mentat Syr 100ml',
      generic_name: 'Herbal Tonic (himalaya)',
      brand_id: 'himalaya',
      formulation_id: 'syrup',
      strength: '100ml',
      pack_size: '1 bottle',
      description: 'Cognitive enhancer and memory booster',
    },
  }).catch(() => prisma.medicine.findFirst({ where: { name: 'Mentat Syr 100ml' } }));

  const paracetamol500 = await prisma.medicine.upsert({
    where: { id: 11 },
    update: {},
    create: {
      name: 'Paracetamol 500mg',
      brand_name: 'Paracetamol 500mg',
      generic_name: 'Acetaminophen',
      brand_id: 'pfizer',
      formulation_id: 'tablet',
      strength: '500mg',
      pack_size: '20 tablets',
      description: 'Pain reliever and fever reducer',
    },
  }).catch(() => prisma.medicine.findFirst({ where: { name: 'Paracetamol 500mg' } }));

  const amoxicillin250 = await prisma.medicine.upsert({
    where: { id: 12 },
    update: {},
    create: {
      name: 'Amoxicillin 250mg',
      brand_name: 'Amoxicillin 250mg',
      generic_name: 'Amoxicillin trihydrate',
      brand_id: 'glaxo-smith-kline',
      formulation_id: 'capsule',
      strength: '250mg',
      pack_size: '21 capsules',
      description: 'Broad spectrum antibiotic',
    },
  }).catch(() => prisma.medicine.findFirst({ where: { name: 'Amoxicillin 250mg' } }));

  const ibuprofen400 = await prisma.medicine.upsert({
    where: { id: 13 },
    update: {},
    create: {
      name: 'Ibuprofen 400mg',
      brand_name: 'Ibuprofen 400mg',
      generic_name: 'Ibuprofen',
      brand_id: 'novartis',
      formulation_id: 'tablet',
      strength: '400mg',
      pack_size: '30 tablets',
      description: 'Anti-inflammatory pain relief',
    },
  }).catch(() => prisma.medicine.findFirst({ where: { name: 'Ibuprofen 400mg' } }));

  const vitamincSyrup = await prisma.medicine.upsert({
    where: { id: 14 },
    update: {},
    create: {
      name: 'Vitamin C Syrup 100ml',
      brand_name: 'Vitamin C Syrup',
      generic_name: 'Ascorbic Acid',
      brand_id: 'sanofi',
      formulation_id: 'syrup',
      strength: '100ml',
      pack_size: '1 bottle',
      description: 'Immune system booster',
    },
  }).catch(() => prisma.medicine.findFirst({ where: { name: 'Vitamin C Syrup 100ml' } }));

  const ciprofloxacin500 = await prisma.medicine.upsert({
    where: { id: 15 },
    update: {},
    create: {
      name: 'Ciprofloxacin 500mg',
      brand_name: 'Ciprofloxacin 500mg',
      generic_name: 'Ciprofloxacin HCl',
      brand_id: 'glaxo-smith-kline',
      formulation_id: 'tablet',
      strength: '500mg',
      pack_size: '10 tablets',
      description: 'Fluoroquinolone antibiotic',
    },
  }).catch(() => prisma.medicine.findFirst({ where: { name: 'Ciprofloxacin 500mg' } }));

  if (!mentalSyr || !paracetamol500 || !amoxicillin250 || !ibuprofen400 || !vitamincSyrup || !ciprofloxacin500) {
    console.error('Failed to create some medicines');
    return;
  }

  // Create suppliers with varied prices for price comparison
  const suppliers = [
    // Mentat Syr - 2 suppliers (like the image example)
    {
      medicine_id: mentalSyr.id,
      wholesaler_id: 'medtb-warehouse',
      unit_price: 67.69,
      price: 67.69,
      batch_number: 'MNT001',
      invoice_date: new Date('2025-09-19'),
    },
    {
      medicine_id: mentalSyr.id,
      wholesaler_id: 'espat-pharmacy',
      unit_price: 69.40,
      price: 69.40,
      batch_number: 'MNT002',
      invoice_date: new Date('2025-07-29'),
    },
    // Paracetamol - 3 suppliers
    {
      medicine_id: paracetamol500.id,
      wholesaler_id: 'letonia-pharmacy',
      unit_price: 5.50,
      price: 5.50,
      batch_number: 'PAR001',
      invoice_date: new Date('2025-10-15'),
    },
    {
      medicine_id: paracetamol500.id,
      wholesaler_id: 'damoah-pharmacy',
      unit_price: 5.99,
      price: 5.99,
      batch_number: 'PAR002',
      invoice_date: new Date('2025-10-10'),
    },
    {
      medicine_id: paracetamol500.id,
      wholesaler_id: 'metro-pharmacy',
      unit_price: 6.50,
      price: 6.50,
      batch_number: 'PAR003',
      invoice_date: new Date('2025-09-20'),
    },
    // Amoxicillin - 3 suppliers
    {
      medicine_id: amoxicillin250.id,
      wholesaler_id: 'medtb-warehouse',
      unit_price: 12.00,
      price: 12.00,
      batch_number: 'AMX001',
      invoice_date: new Date('2025-10-12'),
    },
    {
      medicine_id: amoxicillin250.id,
      wholesaler_id: 'letonia-pharmacy',
      unit_price: 12.50,
      price: 12.50,
      batch_number: 'AMX002',
      invoice_date: new Date('2025-10-05'),
    },
    {
      medicine_id: amoxicillin250.id,
      wholesaler_id: 'espat-pharmacy',
      unit_price: 13.75,
      price: 13.75,
      batch_number: 'AMX003',
      invoice_date: new Date('2025-09-28'),
    },
    // Ibuprofen - 4 suppliers
    {
      medicine_id: ibuprofen400.id,
      wholesaler_id: 'letonia-pharmacy',
      unit_price: 8.00,
      price: 8.00,
      batch_number: 'IBU001',
      invoice_date: new Date('2025-10-18'),
    },
    {
      medicine_id: ibuprofen400.id,
      wholesaler_id: 'damoah-pharmacy',
      unit_price: 8.75,
      price: 8.75,
      batch_number: 'IBU002',
      invoice_date: new Date('2025-10-08'),
    },
    {
      medicine_id: ibuprofen400.id,
      wholesaler_id: 'metro-pharmacy',
      unit_price: 9.50,
      price: 9.50,
      batch_number: 'IBU003',
      invoice_date: new Date('2025-10-01'),
    },
    {
      medicine_id: ibuprofen400.id,
      wholesaler_id: 'mckesson',
      unit_price: 10.25,
      price: 10.25,
      batch_number: 'IBU004',
      invoice_date: new Date('2025-09-15'),
    },
    // Vitamin C Syrup - 3 suppliers
    {
      medicine_id: vitamincSyrup.id,
      wholesaler_id: 'letonia-pharmacy',
      unit_price: 15.00,
      price: 15.00,
      batch_number: 'VIT001',
      invoice_date: new Date('2025-10-20'),
    },
    {
      medicine_id: vitamincSyrup.id,
      wholesaler_id: 'espat-pharmacy',
      unit_price: 16.50,
      price: 16.50,
      batch_number: 'VIT002',
      invoice_date: new Date('2025-10-09'),
    },
    {
      medicine_id: vitamincSyrup.id,
      wholesaler_id: 'damoah-pharmacy',
      unit_price: 17.25,
      price: 17.25,
      batch_number: 'VIT003',
      invoice_date: new Date('2025-09-30'),
    },
    // Ciprofloxacin - 4 suppliers
    {
      medicine_id: ciprofloxacin500.id,
      wholesaler_id: 'medtb-warehouse',
      unit_price: 22.50,
      price: 22.50,
      batch_number: 'CIP001',
      invoice_date: new Date('2025-10-16'),
    },
    {
      medicine_id: ciprofloxacin500.id,
      wholesaler_id: 'letonia-pharmacy',
      unit_price: 24.00,
      price: 24.00,
      batch_number: 'CIP002',
      invoice_date: new Date('2025-10-14'),
    },
    {
      medicine_id: ciprofloxacin500.id,
      wholesaler_id: 'espat-pharmacy',
      unit_price: 25.50,
      price: 25.50,
      batch_number: 'CIP003',
      invoice_date: new Date('2025-10-03'),
    },
    {
      medicine_id: ciprofloxacin500.id,
      wholesaler_id: 'metro-pharmacy',
      unit_price: 26.75,
      price: 26.75,
      batch_number: 'CIP004',
      invoice_date: new Date('2025-09-25'),
    },
  ];

  // Create suppliers
  for (const supplier of suppliers) {
    try {
      await prisma.medicineSupplier.upsert({
        where: {
          medicine_id_wholesaler_id: {
            medicine_id: supplier.medicine_id,
            wholesaler_id: supplier.wholesaler_id,
          },
        },
        update: {
          unit_price: supplier.unit_price,
          price: supplier.price,
          invoice_date: supplier.invoice_date,
        },
        create: {
          medicine_id: supplier.medicine_id,
          wholesaler_id: supplier.wholesaler_id,
          unit_price: supplier.unit_price,
          price: supplier.price,
          batch_number: supplier.batch_number,
          invoice_date: supplier.invoice_date,
          stock_quantity: Math.floor(Math.random() * 200) + 50,
        },
      });
    } catch (error) {
      console.error(`Error creating supplier for medicine ${supplier.medicine_id}:`, error);
    }
  }

  console.log('Price comparison database seeded successfully!');
  console.log(`Created ${brands.length} brands`);
  console.log(`Created ${wholesalers.length} wholesalers`);
  console.log(`Created ${formulations.length} formulations`);
  console.log('Created 6 medicines');
  console.log(`Created ${suppliers.length} supplier records for price comparison`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });