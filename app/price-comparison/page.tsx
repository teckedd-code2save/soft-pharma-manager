'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { PriceComparison, PriceComparisonSearch } from '@/components/price-comparison';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function PriceComparisonPage() {
  const searchParams = useSearchParams();
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedMedicine, setSelectedMedicine] = useState<any>(null);
  const [showComparison, setShowComparison] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [initialQuery, setInitialQuery] = useState('');

  // Auto-load medicine if ID is provided in URL
  useEffect(() => {
    const medicineId = searchParams.get('medicine');
    const medicineName = searchParams.get('name');
    
    if (medicineId) {
      handleSelectMedicine(parseInt(medicineId));
    }
    
    if (medicineName) {
      setInitialQuery(medicineName);
    }
  }, [searchParams]);

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/price-comparison/search?q=${encodeURIComponent(query)}`
      );
      const data = await response.json();
      setSearchResults(data);
      setShowComparison(false);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectMedicine = async (medicineId: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/price-comparison/${medicineId}`
      );
      const data = await response.json();
      setSelectedMedicine(data);
      setShowComparison(true);
      setSearchResults([]);
    } catch (error) {
      console.error('Error fetching medicine details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Medicine Price Comparison</h1>
        <p className="text-muted-foreground">
          Compare prices across different Ghanaian wholesalers to find the best deals
        </p>
      </div>

      <PriceComparisonSearch onSearch={handleSearch} initialQuery={initialQuery} />

      {isLoading && (
        <Card>
          <CardContent className="text-center py-8">
            <div className="text-muted-foreground">Loading...</div>
          </CardContent>
        </Card>
      )}

      {searchResults.length > 0 && !isLoading && (
        <Card>
          <CardHeader>
            <CardTitle>Search Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {searchResults.map((medicine) => (
                <div
                  key={medicine.id}
                  className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => handleSelectMedicine(medicine.id)}
                >
                  <div>
                    <div className="font-medium">
                      {medicine.name}
                      {medicine.brand && ` (${medicine.brand.name})`}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {medicine.generic_name && `Generic: ${medicine.generic_name}`}
                      {medicine.generic_name && medicine.formulation ? ' • ' : ''}
                      {medicine.formulation && medicine.formulation.name}
                      {medicine.strength && ` • ${medicine.strength}`}
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge>{medicine.suppliers.length} suppliers</Badge>
                    <div className="text-sm text-muted-foreground mt-1">
                      From ₵{Math.min(...medicine.suppliers.map((s: any) => s.unit_price)).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {showComparison && selectedMedicine && !isLoading && (
        <div className="space-y-6">
          <PriceComparison data={selectedMedicine} />
          
          {/* Additional Insights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Market Insights */}
            <Card>
              <CardHeader>
                <CardTitle>Market Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Price Volatility</span>
                  <Badge variant="outline" className="text-green-600">Low</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Market Trend</span>
                  <span className="text-sm font-medium text-blue-600">Stable</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Best Time to Buy</span>
                  <span className="text-sm font-medium">Now</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Demand Level</span>
                  <Badge variant="secondary">Medium</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Procurement Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle>Smart Procurement</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="text-sm font-medium text-green-800">Recommended Action</div>
                  <div className="text-sm text-green-700 mt-1">
                    Buy from {selectedMedicine.summary.cheapest.supplier} to save ₵{selectedMedicine.summary.cheapest.savings.toFixed(2)} per unit
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Bulk Order (100+ units)</span>
                    <span className="text-sm font-medium text-green-600">-5% discount</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Payment Terms</span>
                    <span className="text-sm font-medium">30 days</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Delivery Time</span>
                    <span className="text-sm font-medium">2-3 days</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Price History Chart Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle>Price History (Last 30 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-32 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <div className="text-sm">Price trend: Stable</div>
                  <div className="text-xs mt-1">Average: ₵{selectedMedicine.summary.averagePrice.toFixed(2)}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {!showComparison && searchResults.length === 0 && !isLoading && (
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-muted-foreground">
              Search for a medicine to compare prices across suppliers
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}