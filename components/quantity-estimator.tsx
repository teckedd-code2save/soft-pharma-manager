'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calculator, TrendingDown, ShoppingCart } from 'lucide-react';
import Link from 'next/link';

interface QuantityEstimatorProps {
  medicine: any;
  priceComparison: any;
}

export function QuantityEstimator({ medicine, priceComparison }: QuantityEstimatorProps) {
  const [quantity, setQuantity] = useState(100);
  
  if (!priceComparison) {
    return (
      <div className="text-center py-8">
        <div className="text-muted-foreground mb-4">
          Price comparison data not available
        </div>
        <Button asChild>
          <Link href={`/price-comparison?medicine=${medicine.id}&name=${encodeURIComponent(medicine.name)}`}>
            <Calculator className="w-4 h-4 mr-2" />
            Compare Prices & Calculate Orders
          </Link>
        </Button>
      </div>
    );
  }

  const cheapestTotal = quantity * priceComparison.summary.cheapest.price;
  const expensiveTotal = quantity * priceComparison.summary.mostExpensive.price;
  const totalSavings = expensiveTotal - cheapestTotal;

  return (
    <div className="space-y-6">
      {/* Quantity Input */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div>
          <Label htmlFor="quantity">Quantity Needed</Label>
          <Input
            id="quantity"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            min="1"
            className="text-lg font-semibold"
          />
        </div>
        
        <div className="text-center">
          <div className="text-sm text-muted-foreground">Best Price</div>
          <div className="text-xl font-bold text-green-600">
            ₵{priceComparison.summary.cheapest.price.toFixed(2)}
          </div>
          <div className="text-xs text-muted-foreground">
            {priceComparison.summary.cheapest.supplier}
          </div>
        </div>

        <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
          <Link href={`/price-comparison?medicine=${medicine.id}&name=${encodeURIComponent(medicine.name)}&quantity=${quantity}`}>
            <Calculator className="w-4 h-4 mr-2" />
            Detailed Analysis
          </Link>
        </Button>
      </div>

      {/* Cost Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4 text-center">
            <div className="text-sm text-green-700 mb-1">Best Option Total</div>
            <div className="text-2xl font-bold text-green-600">
              ₵{cheapestTotal.toFixed(2)}
            </div>
            <Badge className="bg-green-600 mt-2">
              <TrendingDown className="w-3 h-3 mr-1" />
              Recommended
            </Badge>
          </CardContent>
        </Card>

        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4 text-center">
            <div className="text-sm text-red-700 mb-1">Most Expensive Total</div>
            <div className="text-2xl font-bold text-red-600">
              ₵{expensiveTotal.toFixed(2)}
            </div>
            <div className="text-xs text-red-600 mt-2">
              {priceComparison.summary.mostExpensive.supplier}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4 text-center">
            <div className="text-sm text-blue-700 mb-1">Total Savings</div>
            <div className="text-2xl font-bold text-blue-600">
              ₵{totalSavings.toFixed(2)}
            </div>
            <div className="text-xs text-blue-600 mt-2">
              {((totalSavings / expensiveTotal) * 100).toFixed(1)}% saved
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button variant="outline" className="flex-1">
          <ShoppingCart className="w-4 h-4 mr-2" />
          Add to Cart ({quantity} units)
        </Button>
        
        <Button variant="outline" className="flex-1">
          Request Quote
        </Button>
        
        <Button asChild variant="secondary" className="flex-1">
          <Link href={`/price-comparison?medicine=${medicine.id}&name=${encodeURIComponent(medicine.name)}&quantity=${quantity}`}>
            View All {priceComparison.summary.totalSuppliers} Suppliers
          </Link>
        </Button>
      </div>

      {/* Quick Insights */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="text-sm font-medium text-amber-800 mb-2">💡 Smart Tip</div>
        <div className="text-sm text-amber-700">
          Ordering {quantity} units from {priceComparison.summary.cheapest.supplier} saves you{' '}
          <span className="font-semibold">₵{totalSavings.toFixed(2)}</span> compared to the most expensive option.
          {quantity >= 100 && ' Consider bulk discounts for orders over 100 units.'}
        </div>
      </div>
    </div>
  );
}