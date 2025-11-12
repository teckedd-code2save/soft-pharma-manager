'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { FilterIcon, XIcon } from 'lucide-react';

interface PharmacyFiltersProps {
  brands: { id: string; name: string }[];
  wholesalers: { id: string; name: string }[];
  formulations: { id: string; name: string }[];
}

export function PharmacyFilters({ brands, wholesalers, formulations }: PharmacyFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete('page'); // Reset to first page
    router.push(`/?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push('/');
  };

  return (
    <div className="border-b bg-muted/50">
      {/* Mobile Filter Toggle */}
      <div className="md:hidden p-4">
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full justify-between"
        >
          <span className="flex items-center gap-2">
            <FilterIcon className="w-4 h-4" />
            Filters
          </span>
          {isOpen ? <XIcon className="w-4 h-4" /> : <FilterIcon className="w-4 h-4" />}
        </Button>
      </div>

      {/* Filters Content */}
      <div className={`p-4 ${isOpen ? 'block' : 'hidden'} md:block`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 items-end">
        <div>
          <Label htmlFor="search">Search</Label>
          <Input
            id="search"
            type="text"
            placeholder="Search medicines..."
            value={searchParams.get('search') || ''}
            onChange={(e) => updateFilter('search', e.target.value || null)}
            className="w-full"
          />
        </div>

        <div>
          <Label htmlFor="brand">Brand</Label>
          <Select
            value={searchParams.get('brand') || 'all'}
            onValueChange={(value) => updateFilter('brand', value === 'all' ? null : value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All brands" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All brands</SelectItem>
              {brands.map((brand) => (
                <SelectItem key={brand.id} value={brand.id}>
                  {brand.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="formulation">Formulation</Label>
          <Select
            value={searchParams.get('formulation') || 'all'}
            onValueChange={(value) => updateFilter('formulation', value === 'all' ? null : value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All formulations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All formulations</SelectItem>
              {formulations.map((formulation) => (
                <SelectItem key={formulation.id} value={formulation.id}>
                  {formulation.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="minPrice">Min Price</Label>
          <Input
            id="minPrice"
            type="number"
            placeholder="0"
            value={searchParams.get('minPrice') || ''}
            onChange={(e) => updateFilter('minPrice', e.target.value || null)}
          />
        </div>

        <div>
          <Label htmlFor="maxPrice">Max Price</Label>
          <Input
            id="maxPrice"
            type="number"
            placeholder="500"
            value={searchParams.get('maxPrice') || ''}
            onChange={(e) => updateFilter('maxPrice', e.target.value || null)}
          />
        </div>
      </div>

        <div className="mt-4">
          <Button variant="outline" onClick={clearFilters}>
            Clear Filters
          </Button>
        </div>
      </div>
    </div>
  );
}