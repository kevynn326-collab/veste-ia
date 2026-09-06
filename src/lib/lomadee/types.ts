/** Raw shapes from GET /affiliate/products — inferred from live responses (undocumented). */

export interface LomadeePricing {
  price: number;
  listPrice: number;
}

export interface LomadeeOption {
  id: string;
  name: string;
  images?: { url: string }[];
  available: boolean;
  pricing: LomadeePricing[];
  brands?: { id: string; name: string }[];
  seller?: string | null;
}

export interface LomadeeCategory {
  id: number;
  name: string;
}

export interface LomadeeProduct {
  id: string;
  name: string;
  description?: string;
  available: boolean;
  categories: LomadeeCategory[];
  images: { url: string }[];
  options: LomadeeOption[];
  url: string;
}

export interface LomadeeSearchResponse {
  data: LomadeeProduct[];
}
