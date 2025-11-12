'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingDownIcon, TrendingUpIcon, DollarSignIcon } from 'lucide-react';

interface PriceComparisonProps {
  data: {
    medicine: {
      id: number;
      name: string;
      brand?: { name: string };
      formulation?: { name: string };
      strength?: string;
      generic_name?: string;
    };
    suppliers: {
      rank: number;
      wholesaler: { name: string };
      unit_price: number;
      price: number;
      difference: number;
      differencePercentage: number;
      stock_quantity?: number;
      last_updated: string | Date;
    }[];
    summary: {
      cheapest: { price: number; supplier: string; savings: number };
      mostExpensive: { price: number; supplier: string };
      averagePrice: number;
      totalSuppliers: number;
      priceRange: number;
      savingsPercentage: number;
    };
  };
}

export function PriceComparison({ data }: PriceComparisonProps) {
  return (
    <div className="space-y-6">
      {/* Medicine Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSignIcon className="w-5 h-5" />
            {data.medicine.name} {data.medicine.brand ? `(${data.medicine.brand.name})` : ''}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {data.medicine.generic_name && `Generic: ${data.medicine.generic_name}`}
            {data.medicine.generic_name && data.medicine.formulation ? ' • ' : ''}
            {data.medicine.formulation && data.medicine.formulation.name}
            {data.medicine.strength && ` • ${data.medicine.strength}`}
          </p>
        </CardHeader>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingDownIcon className="w-4 h-4 text-green-600" />
              <span className="text-xs font-medium text-muted-foreground">Cheapest Price</span>
            </div>
            <div className="mt-2">
              <div className="text-xl font-bold text-green-600">
                ₵{data.summary.cheapest.price.toFixed(2)}
              </div>
              <div className="text-xs text-muted-foreground line-clamp-2">
                {data.summary.cheapest.supplier}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUpIcon className="w-4 h-4 text-red-600" />
              <span className="text-xs font-medium text-muted-foreground">Highest Price</span>
            </div>
            <div className="mt-2">
              <div className="text-xl font-bold text-red-600">
                ₵{data.summary.mostExpensive.price.toFixed(2)}
              </div>
              <div className="text-xs text-muted-foreground line-clamp-2">
                {data.summary.mostExpensive.supplier}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSignIcon className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-medium text-muted-foreground">Savings %</span>
            </div>
            <div className="mt-2">
              <div className="text-xl font-bold text-blue-600">
                {data.summary.savingsPercentage.toFixed(1)}%
              </div>
              <div className="text-xs text-muted-foreground">
                vs highest
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSignIcon className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-medium text-muted-foreground">Unit Savings</span>
            </div>
            <div className="mt-2">
              <div className="text-xl font-bold text-emerald-600">
                ₵{data.summary.cheapest.savings.toFixed(2)}
              </div>
              <div className="text-xs text-muted-foreground">
                per unit
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Suppliers Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Suppliers ({data.summary.totalSuppliers})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Supplier</th>
                  <th className="text-right p-2">Unit Price</th>
                  <th className="text-right p-2">Difference</th>
                  <th className="text-right p-2">Stock</th>
                  <th className="text-left p-2">Last Update</th>
                </tr>
              </thead>
              <tbody>
                {data.suppliers.map((supplier) => {
                  const isCheapest = supplier.rank === 1;
                  const isMostExpensive = supplier.rank === data.summary.totalSuppliers;
                  return (
                    <tr
                      key={`${supplier.wholesaler.name}`}
                      className={`border-b transition-colors ${
                        isCheapest
                          ? 'bg-green-50 hover:bg-green-100'
                          : isMostExpensive
                            ? 'bg-red-50 hover:bg-red-100'
                            : 'hover:bg-muted/50'
                      }`}
                    >
                      <td className="p-2 font-medium">{supplier.wholesaler.name}</td>
                      <td className={`p-2 text-right font-semibold ${isCheapest ? 'text-green-600' : isMostExpensive ? 'text-red-600' : ''}`}>
                        ₵{(supplier.unit_price || supplier.price || 0).toFixed(2)}
                      </td>
                      <td className="p-2 text-right">
                        {supplier.difference === 0 ? (
                          <Badge className="bg-green-600">Best Price</Badge>
                        ) : (
                          <span className="text-red-600">
                            +₵{supplier.difference.toFixed(2)} ({supplier.differencePercentage.toFixed(1)}%)
                          </span>
                        )}
                      </td>
                      <td className="p-2 text-right">
                        <Badge variant={supplier.stock_quantity && supplier.stock_quantity > 0 ? 'default' : 'destructive'}>
                          {supplier.stock_quantity || 0}
                        </Badge>
                      </td>
                      <td className="p-2 text-xs text-muted-foreground">
                        {new Date(supplier.last_updated).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function PriceComparisonSearch({ onSearch, initialQuery = '' }: { onSearch: (query: string) => void; initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery);

  // Update query when initialQuery changes
  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query.trim());
      setShowSuggestions(false);
    }
  };

  const fetchSuggestions = async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/price-comparison/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      setSuggestions(data.slice(0, 5)); // Show top 5 suggestions
      setShowSuggestions(true);
    } catch (error) {
      console.error('Failed to fetch suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    
    // Debounce API calls
    const timeoutId = setTimeout(() => {
      fetchSuggestions(value);
    }, 300);
    
    return () => clearTimeout(timeoutId);
  };

  const selectSuggestion = (medicine: any) => {
    setQuery(medicine.name);
    setShowSuggestions(false);
    onSearch(medicine.name);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Price Comparison Search</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Input
                placeholder="Search for medicine to compare prices..."
                value={query}
                onChange={handleInputChange}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                className="w-full"
              />
              
              {/* Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 z-10 bg-white border border-gray-200 rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto">
                  {suggestions.map((medicine) => (
                    <div
                      key={medicine.id}
                      className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                      onClick={() => selectSuggestion(medicine)}
                    >
                      <div className="font-medium">{medicine.name}</div>
                      <div className="text-sm text-gray-600">
                        {medicine.brand?.name} • {medicine.formulation?.name}
                        {medicine.strength && ` • ${medicine.strength}`}
                      </div>
                      <div className="text-xs text-gray-500">
                        {medicine.suppliers?.length || 0} suppliers available
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {loading && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                </div>
              )}
            </div>
            <Button onClick={handleSearch}>Search</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}