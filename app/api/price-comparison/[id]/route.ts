import { NextRequest, NextResponse } from 'next/server';
import { fetchPriceComparison } from '@/lib/db/queries-price-comparison';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  try {
    const priceData = await fetchPriceComparison(parseInt(id));
    
    if (!priceData) {
      return NextResponse.json({ error: 'Medicine not found or no price data available' }, { status: 404 });
    }
    
    return NextResponse.json(priceData);
  } catch (error) {
    console.error('Price comparison error:', error);
    return NextResponse.json({ error: 'Failed to fetch price comparison' }, { status: 500 });
  }
}