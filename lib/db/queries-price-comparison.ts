import { prisma } from './prisma';

export interface PriceComparisonData {
  medicine: {
    id: number;
    name: string;
    brand: { name: string };
    formulation: { name: string };
    strength?: string;
    pack_size?: string;
  };
  suppliers: {
    id: number;
    wholesaler: { id: string; name: string };
    price: number;
    stock_quantity?: number;
    last_updated: Date;
    rank: number;
    difference: number;
    differencePercentage: number;
  }[];
  summary: {
    cheapest: {
      price: number;
      supplier: string;
      savings: number;
    };
    mostExpensive: {
      price: number;
      supplier: string;
    };
    averagePrice: number;
    priceRange: number;
    totalSuppliers: number;
    savingsPercentage: number;
  };
}

export async function fetchPriceComparison(medicineId: number): Promise<PriceComparisonData | null> {
  const medicine = await prisma.medicine.findUnique({
    where: { id: medicineId },
    include: {
      brand: true,
      formulation: true,
    },
  });

  if (!medicine) return null;

  const suppliers = await prisma.medicineSupplier.findMany({
    where: { medicine_id: medicineId },
    include: {
      wholesaler: true,
    },
    orderBy: {
      price: 'asc',
    },
  });

  if (suppliers.length === 0) {
    return null;
  }

  const prices = suppliers.map(s => Number(s.price));
  const cheapestPrice = Math.min(...prices);
  const mostExpensivePrice = Math.max(...prices);
  const averagePrice = prices.reduce((a, b) => a + b, 0) / prices.length;

  const suppliersWithRank = suppliers.map((supplier, index) => ({
    id: supplier.id,
    wholesaler: supplier.wholesaler,
    price: Number(supplier.price),
    stock_quantity: supplier.stock_quantity || undefined,
    last_updated: supplier.last_updated,
    rank: index + 1,
    difference: Number(supplier.price) - cheapestPrice,
    differencePercentage: ((Number(supplier.price) - cheapestPrice) / cheapestPrice) * 100,
  }));

  const cheapestSupplier = suppliersWithRank[0];
  const mostExpensiveSupplier = suppliersWithRank[suppliersWithRank.length - 1];

  return {
    medicine: {
      id: medicine.id,
      name: medicine.name,
      brand: medicine.brand,
      formulation: medicine.formulation,
      strength: medicine.strength || undefined,
      pack_size: medicine.pack_size || undefined,
    },
    suppliers: suppliersWithRank,
    summary: {
      cheapest: {
        price: cheapestPrice,
        supplier: cheapestSupplier.wholesaler.name,
        savings: mostExpensivePrice - cheapestPrice,
      },
      mostExpensive: {
        price: mostExpensivePrice,
        supplier: mostExpensiveSupplier.wholesaler.name,
      },
      averagePrice,
      priceRange: mostExpensivePrice - cheapestPrice,
      totalSuppliers: suppliersWithRank.length,
      savingsPercentage: ((mostExpensivePrice - cheapestPrice) / mostExpensivePrice) * 100,
    },
  };
}

export async function searchMedicinesForComparison(query: string) {
  const medicines = await prisma.medicine.findMany({
    where: {
      name: {
        contains: query,
        mode: 'insensitive',
      },
    },
    include: {
      brand: true,
      formulation: true,
    },
    take: 10,
  });

  // Get suppliers for each medicine
  const medicinesWithSuppliers = await Promise.all(
    medicines.map(async (medicine) => {
      const suppliers = await prisma.medicineSupplier.findMany({
        where: { medicine_id: medicine.id },
        include: {
          wholesaler: true,
        },
      });
      return {
        ...medicine,
        suppliers,
      };
    })
  );

  return medicinesWithSuppliers;
}