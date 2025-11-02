'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface PharmacyFiltersProps {
  brands: { id: string; name: string }[];
  wholesalers: { id: string; name: string }[];
  formulations: { id: string; name: string }[];
}

export function PharmacyFilters({ brands, wholesalers, formulations }: PharmacyFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

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
    <div className="p-4 border-b bg-muted/50">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 items-end">
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
          <Label htmlFor="wholesaler">Wholesaler</Label>
          <Select
            value={searchParams.get('wholesaler') || 'all'}
            onValueChange={(value) => updateFilter('wholesaler', value === 'all' ? null : value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All wholesalers" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All wholesalers</SelectItem>
              {wholesalers.map((wholesaler) => (
                <SelectItem key={wholesaler.id} value={wholesaler.id}>
                  {wholesaler.name}
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
            placeholder="100"
            value={searchParams.get('maxPrice') || ''}
            onChange={(e) => updateFilter('maxPrice', e.target.value || null)}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="inStock"
            checked={searchParams.get('inStock') === 'true'}
            onCheckedChange={(checked) => updateFilter('inStock', checked ? 'true' : null)}
          />
          <Label htmlFor="inStock">In Stock Only</Label>
        </div>
      </div>

      <div className="mt-4">
        <Button variant="outline" onClick={clearFilters}>
          Clear Filters
        </Button>
      </div>
    </div>
  );
}