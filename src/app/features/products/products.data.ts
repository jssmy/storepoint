export type ProductCategory =
  | 'todos'
  | 'abarrotes'
  | 'bebidas'
  | 'lacteos'
  | 'snacks'
  | 'limpieza'
  | 'higiene'
  | 'panaderia'
  | 'carnes';

export interface Product {
  id: number;
  name: string;
  category: Exclude<ProductCategory, 'todos'>;
  price: number;
  stock: number;
  imageUrl?: string;
  unit: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  todos: 'Todos',
  abarrotes: 'Abarrotes',
  bebidas: 'Bebidas',
  lacteos: 'Lácteos',
  snacks: 'Snacks',
  limpieza: 'Limpieza',
  higiene: 'Higiene',
  panaderia: 'Panadería',
  carnes: 'Carnes',
};

export const CATEGORY_ICONS: Record<ProductCategory, string> = {
  todos:     '🏪',
  abarrotes: '🌾',
  bebidas:   '🥤',
  lacteos:   '🥛',
  snacks:    '🍿',
  limpieza:  '🧹',
  higiene:   '🧴',
  panaderia: '🍞',
  carnes:    '🥩',
};

export const MOCK_PRODUCTS: Product[] = [
  { id: 1,  name: 'Arroz Costeño 5kg',      category: 'abarrotes', price: 28.50, stock: 42,  unit: 'saco' },
  { id: 2,  name: 'Aceite Primor 1L',        category: 'abarrotes', price: 8.90,  stock: 30,  unit: 'botella' },
  { id: 3,  name: 'Azúcar rubia 1kg',        category: 'abarrotes', price: 4.50,  stock: 55,  unit: 'bolsa' },
  { id: 4,  name: 'Fideo Lavaggi 500g',      category: 'abarrotes', price: 3.20,  stock: 80,  unit: 'bolsa' },
  { id: 5,  name: 'Lentejas 500g',           category: 'abarrotes', price: 3.80,  stock: 25,  unit: 'bolsa' },
  { id: 6,  name: 'Sal marina 1kg',          category: 'abarrotes', price: 1.50,  stock: 60,  unit: 'bolsa' },
  { id: 7,  name: 'Coca-Cola 1.5L',          category: 'bebidas',   price: 5.50,  stock: 36,  unit: 'botella' },
  { id: 8,  name: 'Inca Kola 1.5L',          category: 'bebidas',   price: 5.50,  stock: 40,  unit: 'botella' },
  { id: 9,  name: 'Agua San Luis 600ml',     category: 'bebidas',   price: 1.80,  stock: 120, unit: 'botella' },
  { id: 10, name: 'Jugo Pulp Durazno 1L',    category: 'bebidas',   price: 6.00,  stock: 18,  unit: 'caja' },
  { id: 11, name: 'Leche Gloria Tarro',      category: 'lacteos',   price: 7.90,  stock: 48,  unit: 'tarro' },
  { id: 12, name: 'Yogurt Gloria 1kg',       category: 'lacteos',   price: 9.50,  stock: 12,  unit: 'vaso' },
  { id: 13, name: 'Mantequilla Laive 200g',  category: 'lacteos',   price: 8.20,  stock: 3,   unit: 'paquete' },
  { id: 14, name: 'Queso Edam 250g',         category: 'lacteos',   price: 12.00, stock: 8,   unit: 'paquete' },
  { id: 15, name: 'Cheetos 100g',            category: 'snacks',    price: 4.00,  stock: 50,  unit: 'bolsa' },
  { id: 16, name: 'Doritos Nacho 150g',      category: 'snacks',    price: 5.50,  stock: 35,  unit: 'bolsa' },
  { id: 17, name: 'Galletas Oreo 119g',      category: 'snacks',    price: 3.50,  stock: 45,  unit: 'paquete' },
  { id: 18, name: 'Chocolate Sublime',       category: 'snacks',    price: 1.50,  stock: 90,  unit: 'unidad' },
  { id: 19, name: 'Jabón Bolivar 360g',      category: 'limpieza',  price: 4.80,  stock: 24,  unit: 'barra' },
  { id: 20, name: 'Detergente Ariel 1kg',    category: 'limpieza',  price: 14.50, stock: 20,  unit: 'bolsa' },
  { id: 21, name: 'Lejía Clorox 1L',         category: 'limpieza',  price: 5.00,  stock: 30,  unit: 'botella' },
  { id: 22, name: 'Esponja Limpiahogar',     category: 'limpieza',  price: 1.00,  stock: 0,   unit: 'unidad' },
  { id: 23, name: 'Shampoo Head&Shoulders',  category: 'higiene',   price: 18.00, stock: 15,  unit: 'botella' },
  { id: 24, name: 'Jabón Dove 90g',          category: 'higiene',   price: 3.50,  stock: 40,  unit: 'barra' },
  { id: 25, name: 'Papel Higiénico Elite',   category: 'higiene',   price: 12.00, stock: 28,  unit: 'paquete' },
  { id: 26, name: 'Pan de Molde Bimbo',      category: 'panaderia', price: 7.90,  stock: 6,   unit: 'bolsa' },
  { id: 27, name: 'Galleta Soda San Jorge',  category: 'panaderia', price: 2.50,  stock: 30,  unit: 'paquete' },
  { id: 28, name: 'Pollo entero kg',         category: 'carnes',    price: 10.00, stock: 5,   unit: 'kg' },
  { id: 29, name: 'Huevos blancos x12',      category: 'carnes',    price: 10.50, stock: 20,  unit: 'cartón' },
];
