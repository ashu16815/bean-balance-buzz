
// Coffee types
export type CoffeeType = {
  id: string;
  name: string;
  description: string;
  price: number; // in credits
  image?: string;
};

export type MilkOption = 'Regular' | 'Trim' | 'Oat' | 'Almond';

export type MilkPrice = {
  option: MilkOption;
  extraCost: number;
};

export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';

export type Order = {
  id: string;
  userId: string;
  userName: string;
  coffeeType: CoffeeType;
  milkOption: MilkOption;
  status: OrderStatus;
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
};

// Array of coffee types
export const COFFEE_TYPES: CoffeeType[] = [
  {
    id: 'espresso',
    name: 'Espresso',
    description: 'Strong, concentrated coffee served in a small cup',
    price: 1,
    image: '☕',
  },
  {
    id: 'americano',
    name: 'Americano',
    description: 'Espresso diluted with hot water',
    price: 1,
    image: '🥤',
  },
  {
    id: 'latte',
    name: 'Latte',
    description: 'Espresso with steamed milk and a small layer of foam',
    price: 1,
    image: '🥛',
  },
  {
    id: 'cappuccino',
    name: 'Cappuccino',
    description: 'Equal parts espresso, steamed milk, and foam',
    price: 1,
    image: '☕',
  },
  {
    id: 'flat-white',
    name: 'Flat White',
    description: 'Espresso with steamed milk and minimal foam',
    price: 1,
    image: '🥛',
  },
  {
    id: 'mocha',
    name: 'Mocha',
    description: 'Espresso with chocolate and steamed milk',
    price: 1.5,
    image: '🍫',
  }
];

// Milk options with prices
export const MILK_PRICES: MilkPrice[] = [
  { option: 'Regular', extraCost: 0 },
  { option: 'Trim', extraCost: 0 },
  { option: 'Oat', extraCost: 0.5 },
  { option: 'Almond', extraCost: 0.5 }
];
