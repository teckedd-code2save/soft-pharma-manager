import { prisma } from './prisma';

export const ITEMS_PER_PAGE = 28;

export interface PharmacySearchParams {
  page?: string;
  search?: string;
  brand?: string;
  wholesaler?: string;
  formulation?: string;
  minPrice?: string;
  maxPrice?: string;
  inStock?: string;
}

function buildWhereClause(searchParams: PharmacySearchParams) {
  const where: any = {};

  if (searchParams.search) {
    where.name = {
      contains: searchParams.search,
      mode: 'insensitive',
    };
  }

  if (searchParams.brand) {
    where.brand_id = searchParams.brand;
  }

  if (searchParams.wholesaler) {
    where.wholesaler_id = searchParams.wholesaler;
  }

  if (searchParams.formulation) {
    where.formulation_id = searchParams.formulation;
  }

  if (searchParams.minPrice || searchParams.maxPrice) {
    where.price = {};
    if (searchParams.minPrice) {
      where.price.gte = parseFloat(searchParams.minPrice);
    }
    if (searchParams.maxPrice) {
      where.price.lte = parseFloat(searchParams.maxPrice);
    }
  }

  if (searchParams.inStock === 'true') {
    where.stock_quantity = {
      gt: 0,
    };
  }

  return where;
}

export async function fetchMedicinesWithPagination(searchParams: PharmacySearchParams) {
  const requestedPage = Math.max(1, Number(searchParams?.page) || 1);
  const offset = (requestedPage - 1) * ITEMS_PER_PAGE;

  const where = buildWhereClause(searchParams);

  const medicines = await prisma.medicine.findMany({
    where,
    include: {
      brand: true,
      wholesaler: true,
      formulation: true,
    },
    orderBy: {
      id: 'asc',
    },
    skip: offset,
    take: ITEMS_PER_PAGE,
  });

  return medicines;
}

export async function estimateTotalMedicines(searchParams: PharmacySearchParams) {
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
      wholesaler: true,
      formulation: true,
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