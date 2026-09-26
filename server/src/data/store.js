import bcrypt from 'bcryptjs';

export const demoProducts = [
  {
    id: 'prod-1',
    name: 'AeroMax Runner',
    price: 129.99,
    stock: 24,
    category: 'Footwear',
    description: 'Lightweight everyday sneakers with support for long walks and daily errands.',
    image:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'prod-2',
    name: 'Nimbus Smartwatch',
    price: 219.0,
    stock: 18,
    category: 'Electronics',
    description: 'Track fitness, notifications, and GPS with a premium everyday wearable.',
    image:
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'prod-3',
    name: 'Luma Laptop Stand',
    price: 89.5,
    stock: 35,
    category: 'Accessories',
    description: 'Ergonomic aluminum stand to elevate your workspace and improve posture.',
    image:
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'prod-4',
    name: 'Terra Ceramic Mug',
    price: 24.0,
    stock: 42,
    category: 'Home',
    description: 'A handmade ceramic mug designed for slow mornings and cozy routines.',
    image:
      'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'prod-5',
    name: 'Crest Headphones',
    price: 149.0,
    stock: 16,
    category: 'Electronics',
    description: 'Wireless over-ear audio with deep bass, long battery life, and comfort-driven design.',
    image:
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'prod-6',
    name: 'Harbor Backpack',
    price: 79.99,
    stock: 22,
    category: 'Travel',
    description: 'A durable everyday backpack built for commuting, travel, and weekend adventures.',
    image:
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80',
  },
];

const seedUsers = [
  {
    id: 'user-admin',
    name: 'Admin Manager',
    email: 'admin@shop.com',
    password: bcrypt.hashSync('admin123', 10),
    role: 'admin',
  },
  {
    id: 'user-demo',
    name: 'Demo Customer',
    email: 'user@shop.com',
    password: bcrypt.hashSync('user123', 10),
    role: 'user',
  },
];

export const appData = {
  products: demoProducts.map((product) => ({ ...product })),
  users: seedUsers.map((user) => ({ ...user })),
  orders: [],
};

export const formatUserResponse = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
});
