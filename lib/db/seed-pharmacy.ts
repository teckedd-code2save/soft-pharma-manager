import { prisma } from './prisma';

async function main() {
  // Create brands
  const brands = await Promise.all([
    prisma.brand.upsert({
      where: { id: 'pfizer' },
      update: {},
      create: { id: 'pfizer', name: 'Pfizer' },
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
      where: { id: 'roche' },
      update: {},
      create: { id: 'roche', name: 'Roche' },
    }),
  ]);

  // Create wholesalers
  const wholesalers = await Promise.all([
    prisma.wholesaler.upsert({
      where: { id: 'mckesson' },
      update: {},
      create: { id: 'mckesson', name: 'McKesson Corporation' },
    }),
    prisma.wholesaler.upsert({
      where: { id: 'cardinal-health' },
      update: {},
      create: { id: 'cardinal-health', name: 'Cardinal Health' },
    }),
    prisma.wholesaler.upsert({
      where: { id: 'amerisource-bergen' },
      update: {},
      create: { id: 'amerisource-bergen', name: 'AmerisourceBergen' },
    }),
  ]);

  // Create formulations
  const formulations = await Promise.all([
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
      where: { id: 'syrup' },
      update: {},
      create: { id: 'syrup', name: 'Syrup' },
    }),
    prisma.formulation.upsert({
      where: { id: 'injection' },
      update: {},
      create: { id: 'injection', name: 'Injection' },
    }),
  ]);

  // Create sample medicines
  const medicines = [
    {
      name: 'Paracetamol',
      brand_id: 'pfizer',
      wholesaler_id: 'mckesson',
      formulation_id: 'tablet',
      strength: '500mg',
      pack_size: '20 tablets',
      price: 5.99,
      stock_quantity: 150,
      batch_number: 'PAR001',
      description: 'Pain reliever and fever reducer',
    },
    {
      name: 'Amoxicillin',
      brand_id: 'johnson-johnson',
      wholesaler_id: 'cardinal-health',
      formulation_id: 'capsule',
      strength: '250mg',
      pack_size: '21 capsules',
      price: 12.50,
      stock_quantity: 75,
      batch_number: 'AMX002',
      description: 'Antibiotic for bacterial infections',
    },
    {
      name: 'Ibuprofen',
      brand_id: 'novartis',
      wholesaler_id: 'amerisource-bergen',
      formulation_id: 'tablet',
      strength: '400mg',
      pack_size: '30 tablets',
      price: 8.75,
      stock_quantity: 200,
      batch_number: 'IBU003',
      description: 'Anti-inflammatory pain reliever',
    },
    {
      name: 'Cough Syrup',
      brand_id: 'roche',
      wholesaler_id: 'mckesson',
      formulation_id: 'syrup',
      strength: '100ml',
      pack_size: '1 bottle',
      price: 15.25,
      stock_quantity: 50,
      batch_number: 'CSY004',
      description: 'Cough suppressant and expectorant',
    },
    {
      name: 'Insulin',
      brand_id: 'novartis',
      wholesaler_id: 'cardinal-health',
      formulation_id: 'injection',
      strength: '100 units/ml',
      pack_size: '10ml vial',
      price: 45.00,
      stock_quantity: 25,
      batch_number: 'INS005',
      description: 'Diabetes medication',
    },
  ];

  for (const medicine of medicines) {
    await prisma.medicine.create({
      data: medicine,
    });
  }

  console.log('Pharmacy database seeded successfully!');
  console.log(`Created ${brands.length} brands`);
  console.log(`Created ${wholesalers.length} wholesalers`);
  console.log(`Created ${formulations.length} formulations`);
  console.log(`Created ${medicines.length} medicines`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });