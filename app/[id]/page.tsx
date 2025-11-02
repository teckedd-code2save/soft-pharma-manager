import {
  PillIcon,
  DollarSignIcon,
  PackageIcon,
  CalendarIcon,
  ArrowLeftIcon,
  BuildingIcon,
  FlaskConicalIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { fetchMedicineById, fetchMedicinesWithPagination } from '@/lib/db/queries-pharmacy';
import { Photo } from '@/components/photo';
import { ScrollArea } from '@/components/ui/scroll-area';
import Link from 'next/link';
import { SearchParams, stringifySearchParams } from '@/lib/url-state';

// Prerender the first page of medicines
export async function generateStaticParams() {
  const medicines = await fetchMedicinesWithPagination({});

  return medicines.map((medicine: any) => ({
    id: medicine.id.toString(),
  }));
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

  if (!medicine) {
    return <div>Medicine not found</div>;
  }

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
              title={medicine.name}
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
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{medicine.name}</h1>
          <div className="text-lg md:text-xl mb-4 text-blue-600">
            {medicine.brand.name}
          </div>

          {medicine.price && (
            <div className="flex items-center mb-4">
              <DollarSignIcon className="w-5 h-5 mr-2 text-green-600" />
              <span className="text-2xl font-bold text-green-600">
                ${medicine.price}
              </span>
            </div>
          )}

          {medicine.description && (
            <p className="text-gray-700 mb-6">{medicine.description}</p>
          )}

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex items-center">
              <FlaskConicalIcon className="w-5 h-5 mr-2 text-gray-600" />
              <span>{medicine.formulation.name}</span>
            </div>
            <div className="flex items-center">
              <BuildingIcon className="w-5 h-5 mr-2 text-gray-600" />
              <span>{medicine.wholesaler.name}</span>
            </div>
            {medicine.strength && (
              <div className="flex items-center">
                <PillIcon className="w-5 h-5 mr-2 text-gray-600" />
                <span>{medicine.strength}</span>
              </div>
            )}
            {medicine.pack_size && (
              <div className="flex items-center">
                <PackageIcon className="w-5 h-5 mr-2 text-gray-600" />
                <span>{medicine.pack_size}</span>
              </div>
            )}
            <div className="flex items-center">
              <span>Stock: {medicine.stock_quantity || 0}</span>
            </div>
            {medicine.batch_number && (
              <div className="flex items-center">
                <span>Batch: {medicine.batch_number}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}