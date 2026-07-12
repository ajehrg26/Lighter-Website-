export interface Lighter {
  id: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  category: 'Classic' | 'Electric' | 'Windproof' | 'Luxury' | 'Vintage';
  fuelType: 'Petrol' | 'Butane Jet' | 'USB Rechargeable' | 'Kerosene';
  material: string;
  weight: string;
  dimensions: string;
  features: string[];
  imageUrl: string;
  isCustomizable: boolean;
  stock: number;
}

export interface CartItem {
  lighter: Lighter;
  quantity: number;
  engravingText?: string;
  engravingFont?: string;
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

export interface FAQ {
  question: string;
  answer: string;
  category: string;
}
