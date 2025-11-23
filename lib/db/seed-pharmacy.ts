import { prisma } from './prisma';

async function main() {
  // Create brands
  const brands = await Promise.all([
    prisma.brand.upsert({
      where: { id: 'letonia' },
      update: {},
      create: { id: 'letonia', name: 'Letonia Pharmacy LTD' },
    }),
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
  ]);

  // Create wholesalers
  const wholesalers = await Promise.all([
    prisma.wholesaler.upsert({
      where: { id: 'letonia-pharmacy-ltd' },
      update: {},
      create: { id: 'letonia-pharmacy-ltd', name: 'LETONIA PHARMACY LTD' },
    }),
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
  ]);

  // Create formulations
  const formulations = await Promise.all([
    prisma.formulation.upsert({
      where: { id: 'tablet' },
      update: {},
      create: { id: 'tablet', name: 'Tablet' },
    }),
    prisma.formulation.upsert({
      where: { id: 'syrup' },
      update: {},
      create: { id: 'syrup', name: 'Syrup' },
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
  ]);

  // Create sample medicines with CSV data
  const medicineData = [
    {
      name: 'ANTASIL',
      brand_name: 'ANTASIL',
      generic_name: 'Aluminium Hydroxide + Magnesium Hydroxide + Simethicone',
      brand_id: 'letonia',
      formulation_id: 'tablet',
      strength: 'Null',
      pack_size: '50 x10 tabs',
      description: 'Antacid and anti-gas combination',
      unit_price: 46.5,
    },
    {
      name: 'CARDIOACE',
      brand_name: 'CARDIOACE',
      generic_name: 'Multivitamin + Minerals + Antioxidants (Vitabiotics formulation)',
      brand_id: 'letonia',
      formulation_id: 'tablet',
      strength: 'Varies',
      pack_size: 'X 30',
      description: 'Cardiovascular health supplement',
      unit_price: 174.45,
    },
    {
      name: 'CITRO C SYR',
      brand_name: 'CITRO C SYR',
      generic_name: 'Vitamin C (Ascorbic Acid)',
      brand_id: 'letonia',
      formulation_id: 'syrup',
      strength: '100ml',
      pack_size: 'Null',
      description: 'Vitamin C supplement syrup',
      unit_price: 12,
    },
    {
      name: 'CLARITYN ALLERGY RELIEF TAB 10MG',
      brand_name: 'CLARITYN ALLERGY RELIEF TAB 10MG',
      generic_name: 'Loratadine',
      brand_id: 'letonia',
      formulation_id: 'tablet',
      strength: '10mg',
      pack_size: "14'S",
      description: 'Antihistamine for allergies',
      unit_price: 83.01,
    },
    {
      name: "DAONIL 5MG 60'S TABS",
      brand_name: "DAONIL 5MG 60'S TABS",
      generic_name: 'Glibenclamide (Glyburide)',
      brand_id: 'letonia',
      formulation_id: 'tablet',
      strength: '5 mg',
      pack_size: "60'S",
      description: 'Antidiabetic medication',
      unit_price: 95,
    },
    {
      name: "ENAFEN TABS 400MG 600'",
      brand_name: "ENAFEN TABS 400MG 600'",
      generic_name: 'Ibuprofen',
      brand_id: 'letonia',
      formulation_id: 'tablet',
      strength: '400mg',
      pack_size: "500'",
      description: 'Non-steroidal anti-inflammatory drug',
      unit_price: 130,
    },
  ];

  for (const medicineInfo of medicineData) {
    const { unit_price, ...medicineCreate } = medicineInfo;

    // Check if medicine exists by name
    const existingMedicine = await prisma.medicine.findFirst({
      where: { name: medicineCreate.name },
    });

    let medicine;
    if (existingMedicine) {
      medicine = await prisma.medicine.update({
        where: { id: existingMedicine.id },
        data: {
          brand_name: medicineCreate.brand_name,
          generic_name: medicineCreate.generic_name,
        },
      });
    } else {
      const { brand_id, formulation_id, ...rest } = medicineCreate;
      medicine = await prisma.medicine.create({
        data: {
          ...rest,
          brand: {
            connect: { id: brand_id },
          },
          formulation: {
            connect: { id: formulation_id },
          },
        },
      });
    }

    // Create medicine supplier record with invoice data
    try {
      await prisma.medicineSupplier.upsert({
        where: {
          medicine_id_wholesaler_id: {
            medicine_id: medicine.id,
            wholesaler_id: 'letonia-pharmacy-ltd',
          },
        },
        update: {
          unit_price: parseFloat(unit_price.toString()),
          price: parseFloat(unit_price.toString()),
        },
        create: {
          medicine_id: medicine.id,
          wholesaler_id: 'letonia-pharmacy-ltd',
          invoice_number: 'LET001',
          invoice_date: new Date('2025-07-23'),
          unit_price: parseFloat(unit_price.toString()),
          price: parseFloat(unit_price.toString()),
          stock_quantity: 100,
          batch_number: `BATCH-${Math.random().toString(36).substr(2, 9)}`,
        },
      });
    } catch (error) {
      console.error(`Error creating supplier for ${medicine.name}:`, error);
    }
  }

  console.log('Pharmacy database seeded successfully!');
  console.log(`Created ${brands.length} brands`);
  console.log(`Created ${wholesalers.length} wholesalers`);
  console.log(`Created ${formulations.length} formulations`);
  console.log(`Created ${medicineData.length} medicines with supplier data`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });