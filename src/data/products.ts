export interface Product {
  id: number
  name: string
  category: 'Electronics' | 'Home' | 'Sports' | 'Books' | 'Toys'
  price: number
  stock: number
  rating: number
}

export const products: Product[] = [
  { id: 1, name: 'Wireless Earbuds', category: 'Electronics', price: 79.99, stock: 24, rating: 4.4 },
  { id: 2, name: 'Mechanical Keyboard', category: 'Electronics', price: 119.0, stock: 0, rating: 4.7 },
  { id: 3, name: '4K Monitor', category: 'Electronics', price: 329.5, stock: 8, rating: 4.5 },
  { id: 4, name: 'USB-C Hub', category: 'Electronics', price: 34.99, stock: 51, rating: 4.1 },
  { id: 5, name: 'Cast Iron Skillet', category: 'Home', price: 42.0, stock: 17, rating: 4.8 },
  { id: 6, name: 'Ceramic Mug Set', category: 'Home', price: 28.5, stock: 0, rating: 4.2 },
  { id: 7, name: 'Standing Desk', category: 'Home', price: 289.0, stock: 5, rating: 4.3 },
  { id: 8, name: 'Linen Throw Blanket', category: 'Home', price: 54.0, stock: 12, rating: 4.6 },
  { id: 9, name: 'Yoga Mat', category: 'Sports', price: 24.99, stock: 33, rating: 4.5 },
  { id: 10, name: 'Adjustable Dumbbells', category: 'Sports', price: 189.0, stock: 3, rating: 4.6 },
  { id: 11, name: 'Running Shoes', category: 'Sports', price: 99.0, stock: 19, rating: 4.0 },
  { id: 12, name: 'Insulated Water Bottle', category: 'Sports', price: 19.5, stock: 0, rating: 4.3 },
  { id: 13, name: 'Atomic Habits', category: 'Books', price: 14.99, stock: 41, rating: 4.9 },
  { id: 14, name: 'Deep Work', category: 'Books', price: 12.5, stock: 22, rating: 4.7 },
  { id: 15, name: 'CSS Secrets', category: 'Books', price: 27.0, stock: 6, rating: 4.8 },
  { id: 16, name: 'Building a Second Brain', category: 'Books', price: 15.99, stock: 0, rating: 4.2 },
  { id: 17, name: 'Wooden Building Blocks', category: 'Toys', price: 32.0, stock: 14, rating: 4.6 },
  { id: 18, name: 'Remote Control Car', category: 'Toys', price: 45.0, stock: 9, rating: 4.1 },
  { id: 19, name: 'Puzzle 1000pc', category: 'Toys', price: 18.0, stock: 27, rating: 4.4 },
  { id: 20, name: 'Board Game Night Bundle', category: 'Toys', price: 62.5, stock: 0, rating: 4.5 },
]
