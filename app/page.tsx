import { Suspense } from 'react';
import { MedicinesGrid } from '@/components/grid';
import { BookPagination } from '@/components/book-pagination';
import { PharmacyFilters } from '@/components/pharmacy-filters';
import {
  estimateTotalMedicines,
  fetchMedicinesWithPagination,
  fetchBrands,
  fetchWholesalers,
  fetchFormulations,
  ITEMS_PER_PAGE,
} from '@/lib/db/queries-pharmacy';
import { parseSearchParams } from '@/lib/url-state';

export default async function Page(
  props: {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
  }
) {
  const searchParams = await props.searchParams;
  const parsedSearchParams = parseSearchParams(searchParams);

  const [medicines, estimatedTotal, brands, wholesalers, formulations] = await Promise.all([
    fetchMedicinesWithPagination(parsedSearchParams),
    estimateTotalMedicines(parsedSearchParams),
    fetchBrands(),
    fetchWholesalers(),
    fetchFormulations(),
  ]);

  const totalPages = Math.ceil(estimatedTotal / ITEMS_PER_PAGE);
  const currentPage = Math.max(1, Number(parsedSearchParams.page) || 1);

  return (
    <div className="flex flex-col h-full">
      <PharmacyFilters 
        brands={brands}
        wholesalers={wholesalers}
        formulations={formulations}
      />
      <div className="flex-grow overflow-auto min-h-[200px]">
        <div className="group-has-[[data-pending]]:animate-pulse p-4">
          <MedicinesGrid medicines={medicines} searchParams={parsedSearchParams} />
        </div>
      </div>
      <div className="mt-auto p-4 border-t">
        <Suspense fallback={null}>
          <BookPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalResults={estimatedTotal}
            searchParams={parsedSearchParams}
          />
        </Suspense>
      </div>
    </div>
  );
}
