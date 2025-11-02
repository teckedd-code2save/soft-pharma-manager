export interface SearchParams {
  search?: string;
  brand?: string;
  wholesaler?: string;
  formulation?: string;
  minPrice?: string;
  maxPrice?: string;
  inStock?: string;
  page?: string;
}

export function parseSearchParams(
  params: Record<string, string | string[] | undefined>
): SearchParams {
  return {
    search: typeof params.search === 'string' ? params.search : undefined,
    brand: typeof params.brand === 'string' ? params.brand : undefined,
    wholesaler: typeof params.wholesaler === 'string' ? params.wholesaler : undefined,
    formulation: typeof params.formulation === 'string' ? params.formulation : undefined,
    minPrice: typeof params.minPrice === 'string' ? params.minPrice : undefined,
    maxPrice: typeof params.maxPrice === 'string' ? params.maxPrice : undefined,
    inStock: typeof params.inStock === 'string' ? params.inStock : undefined,
    page: typeof params.page === 'string' ? params.page : undefined,
  };
}

export function stringifySearchParams(params: SearchParams): string {
  const urlParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      urlParams.append(key, value);
    }
  });
  return urlParams.toString();
}
