import Link from 'next/link';
import { Photo } from './photo';
import { SearchParams, stringifySearchParams } from '@/lib/url-state';

type Medicine = {
  id: number;
  name: string;
  brand_name?: string;
  generic_name?: string;
  image_url: string | null;
  thumbhash: string | null;
  brand: { name: string };
  suppliers: Array<{ unit_price?: number; price?: number; wholesaler: { name: string } }>;
};

export async function MedicinesGrid({
  medicines,
  searchParams,
}: {
  medicines: any[];
  searchParams: SearchParams;
}) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {!medicines?.length ? (
        <p className="text-center text-muted-foreground col-span-full">
          No medicines found.
        </p>
      ) : (
        medicines.map((medicine, index) => (
          <MedicineLink
            key={medicine.id}
            priority={index < 10}
            medicine={medicine}
            searchParams={searchParams}
          />
        ))
      )}
    </div>
  );
}

function MedicineLink({
  priority,
  medicine,
  searchParams,
}: {
  priority: boolean;
  medicine: Medicine;
  searchParams: SearchParams;
}) {
  let noFilters = Object.values(searchParams).every((v) => v === undefined);
  
  // Get the best price from suppliers
  const minPrice = medicine.suppliers?.length > 0 
    ? Math.min(...medicine.suppliers.map(s => s.unit_price || s.price || 0))
    : null;

  return (
    <Link
      href={`/${medicine.id}?${stringifySearchParams(searchParams)}`}
      key={medicine.id}
      className="block transition ease-in-out md:hover:scale-105"
      prefetch={noFilters ? true : null}
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-md bg-white border shadow-sm hover:shadow-md">
        <div className="p-3 h-full flex flex-col">
          <div className="text-sm font-medium truncate mb-1">
            {medicine.brand_name || medicine.name}
          </div>
          {medicine.generic_name && (
            <div className="text-xs text-muted-foreground mb-1 line-clamp-2">
              {medicine.generic_name}
            </div>
          )}
          <div className="text-xs text-muted-foreground mb-2">{medicine.brand?.name}</div>
          <div className="mt-auto">
            {minPrice && (
              <div className="text-sm font-semibold text-green-600">
                GH¢{minPrice.toFixed(2)}
              </div>
            )}
            {medicine.suppliers?.length > 0 && (
              <div className="text-xs text-muted-foreground">
                {medicine.suppliers.length} supplier{medicine.suppliers.length !== 1 ? 's' : ''}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
