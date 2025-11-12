import { prisma } from './prisma';
import { SearchParams } from '@/lib/url-state';

export const ITEMS_PER_PAGE = 28;

function buildWhereClause(searchParams: SearchParams) {
  const where: any = {};

  if (searchParams.search) {
    where.OR = [
      {
        name: {
          contains: searchParams.search,
          mode: 'insensitive',
        },
      },
      {
        brand_name: {
          contains: searchParams.search,
          mode: 'insensitive',
        },
      },
      {
        generic_name: {
          contains: searchParams.search,
          mode: 'insensitive',
        },
      },
    ];
  }

  if (searchParams.brand) {
    where.brand_id = searchParams.brand;
  }

  if (searchParams.formulation) {
    where.formulation_id = searchParams.formulation;
  }

  if (searchParams.minPrice || searchParams.maxPrice) {
    where.suppliers = {
      some: {
        unit_price: {},
      },
    };
    if (searchParams.minPrice) {
      where.suppliers.some.unit_price.gte = parseFloat(searchParams.minPrice);
    }
    if (searchParams.maxPrice) {
      where.suppliers.some.unit_price.lte = parseFloat(searchParams.maxPrice);
    }
  }

  return where;
}

export async function fetchMedicinesWithPagination(searchParams: SearchParams) {
  const requestedPage = Math.max(1, Number(searchParams?.page) || 1);
  const offset = (requestedPage - 1) * ITEMS_PER_PAGE;

  const where = buildWhereClause(searchParams);

  const medicines = await prisma.medicine.findMany({
    where,
    include: {
      brand: true,
      formulation: true,
      suppliers: {
        include: {
          wholesaler: true,
        },
      },
    },
    orderBy: {
      id: 'asc',
    },
    skip: offset,
    take: ITEMS_PER_PAGE,
  });

  return medicines;
}

export async function estimateTotalMedicines(searchParams: SearchParams) {
  const where = buildWhereClause(searchParams);

  const count = await prisma.medicine.count({
    where,
  });

  return count;
}

export async function fetchMedicineById(id: string) {
  const medicine = await prisma.medicine.findUnique({
    where: {
      id: parseInt(id),
    },
    include: {
      brand: true,
      formulation: true,
      suppliers: {
        include: {
          wholesaler: true,
        },
      },
    },
  });

  return medicine;
}

export async function fetchBrands() {
  return prisma.brand.findMany({
    orderBy: { name: 'asc' },
  });
}

export async function fetchWholesalers() {
  return prisma.wholesaler.findMany({
    orderBy: { name: 'asc' },
  });
}

export async function fetchFormulations() {
  return prisma.formulation.findMany({
    orderBy: { name: 'asc' },
  });
}