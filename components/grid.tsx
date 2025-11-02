import Link from 'next/link';
import { Photo } from './photo';
import { SearchParams, stringifySearchParams } from '@/lib/url-state';

type Medicine = {
  id: number;
  name: string;
  image_url: string | null;
  thumbhash: string | null;
  brand: { name: string };
  price: number | null;
  stock_quantity: number | null;
};

export async function MedicinesGrid({
  medicines,
  searchParams,
}: {
  medicines: any[];
  searchParams: SearchParams;
}) {
  console.log('Medicines data:', medicines?.length, medicines?.[0]); // Debug log
  
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
  medicine: any;
  searchParams: SearchParams;
}) {
  let noFilters = Object.values(searchParams).every((v) => v === undefined);

  return (
    <Link
      href={`/${medicine.id}?${stringifySearchParams(searchParams)}`}
      key={medicine.id}
      className="block transition ease-in-out md:hover:scale-105"
      prefetch={noFilters ? true : null}
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-md bg-white border shadow-sm">
        <div className="p-3 h-full flex flex-col">
          <div className="text-sm font-medium truncate mb-1">{medicine.name}</div>
          <div className="text-xs text-muted-foreground mb-2">{medicine.brand?.name}</div>
          <div className="mt-auto">
            {medicine.price && (
              <div className="text-sm font-semibold text-green-600">
                ${medicine.price.toString()}
              </div>
            )}
            <div className="text-xs text-muted-foreground">
              Stock: {medicine.stock_quantity || 0}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
