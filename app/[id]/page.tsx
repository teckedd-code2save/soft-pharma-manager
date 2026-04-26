export const dynamic = 'force-dynamic';

import {
  PillIcon,
  DollarSignIcon,
  PackageIcon,
  CalendarIcon,
  ArrowLeftIcon,
  BuildingIcon,
  FlaskConicalIcon,
  TrendingDownIcon,
  TrendingUpIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { fetchMedicineById, fetchMedicinesWithPagination } from '@/lib/db/queries-pharmacy';
import { fetchPriceComparison } from '@/lib/db/queries-price-comparison';
import { Photo } from '@/components/photo';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { QuantityEstimator } from '@/components/quantity-estimator';
import Link from 'next/link';
import { SearchParams, stringifySearchParams } from '@/lib/url-state';

// Prerender the first page of medicines when a database is reachable.
// Falls back to an empty list so builds succeed in environments without DB
// access (e.g. rehearsal sandboxes); pages still render on-demand at runtime.
export async function generateStaticParams() {
  try {
    const medicines = await fetchMedicinesWithPagination({});
    return medicines.map((medicine: any) => ({
      id: medicine.id.toString(),
    }));
  } catch {
    return [];
  }
}

export default async function Page(
  props: {
    params: Promise<{ id: string }>;
    searchParams: Promise<SearchParams>;
  }
) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const medicine = await fetchMedicineById(params.id);
  const priceComparison = await fetchPriceComparison(parseInt(params.id));

  if (!medicine) {
    return <div>Medicine not found</div>;
  }

  // Serialize data for client components
  const serializedMedicine = {
    ...medicine,
    suppliers: medicine.suppliers?.map((s: any) => ({
      ...s,
      unit_price: s.unit_price ? Number(s.unit_price) : null,
      price: s.price ? Number(s.price) : null,
    }))
  };

  const serializedPriceComparison = priceComparison ? {
    ...priceComparison,
    suppliers: priceComparison.suppliers.map((s: any) => ({
      ...s,
      price: Number(s.price),
      difference: Number(s.difference),
    })),
    summary: {
      ...priceComparison.summary,
      cheapest: {
        ...priceComparison.summary.cheapest,
        price: Number(priceComparison.summary.cheapest.price),
        savings: Number(priceComparison.summary.cheapest.savings),
      },
      mostExpensive: {
        ...priceComparison.summary.mostExpensive,
        price: Number(priceComparison.summary.mostExpensive.price),
      },
      averagePrice: Number(priceComparison.summary.averagePrice),
      priceRange: Number(priceComparison.summary.priceRange),
      savingsPercentage: Number(priceComparison.summary.savingsPercentage),
    }
  } : null;

  // Get minimum price from suppliers
  const minPrice = serializedMedicine.suppliers?.length > 0 
    ? Math.min(...serializedMedicine.suppliers.map((s: any) => s.unit_price || s.price || 0))
    : null;

  return (
    <ScrollArea className="px-4 h-full">
      <Button variant="ghost" className="mb-4" asChild>
        <Link href={`/?${stringifySearchParams(searchParams)}`}>
          <ArrowLeftIcon className="mr-2 h-4 w-4" /> Back to Medicines
        </Link>
      </Button>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-1/2 md:w-1/4 mx-auto md:mx-0">
          {medicine.image_url && medicine.thumbhash ? (
            <Photo
              src={medicine.image_url}
              title={medicine.brand_name || medicine.name}
              thumbhash={medicine.thumbhash}
              priority={true}
            />
          ) : (
            <div className="aspect-[3/4] w-full bg-muted rounded-md flex items-center justify-center">
              <PillIcon className="w-16 h-16 text-muted-foreground" />
            </div>
          )}
        </div>

        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            {serializedMedicine.brand_name || serializedMedicine.name}
          </h1>
          {serializedMedicine.generic_name && (
            <p className="text-lg text-gray-600 mb-2">{serializedMedicine.generic_name}</p>
          )}
          <div className="text-lg md:text-xl mb-4 text-blue-600">
            {serializedMedicine.brand.name}
          </div>

          {minPrice && (
            <div className="flex items-center mb-4">
              <DollarSignIcon className="w-5 h-5 mr-2 text-green-600" />
              <span className="text-2xl font-bold text-green-600">
                GH¢{minPrice.toFixed(2)}
              </span>
            </div>
          )}

          {serializedMedicine.description && (
            <p className="text-gray-700 mb-6">{serializedMedicine.description}</p>
          )}

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex items-center">
              <FlaskConicalIcon className="w-5 h-5 mr-2 text-gray-600" />
              <span>{serializedMedicine.formulation.name}</span>
            </div>
            {serializedMedicine.strength && (
              <div className="flex items-center">
                <PillIcon className="w-5 h-5 mr-2 text-gray-600" />
                <span>{serializedMedicine.strength}</span>
              </div>
            )}
            {serializedMedicine.pack_size && (
              <div className="flex items-center">
                <PackageIcon className="w-5 h-5 mr-2 text-gray-600" />
                <span>{serializedMedicine.pack_size}</span>
              </div>
            )}
          </div>

          {/* Quantity Estimator & Actions */}
          <Card className="mt-8">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Order Calculator</h3>
              <QuantityEstimator 
                medicine={serializedMedicine}
                priceComparison={serializedPriceComparison}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </ScrollArea>
  );
}