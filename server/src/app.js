import crypto from 'crypto';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import bcrypt from 'bcryptjs';
import { appData, demoProducts, formatUserResponse } from './data/store.js';
import { protect, requireRole, signToken } from './middleware/auth.js';

export const createApp = () => {
  const app = express();
  const store = {
    products: appData.products.map((product) => ({ ...product })),
    users: appData.users.map((user) => ({ ...user })),
    orders: appData.orders.map((order) => ({ ...order })),
  };

  app.use(cors());
  app.use(express.json());
  app.use(helmet());
  app.use(morgan('dev'));

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'E-commerce API is running.' });
  });

  app.post('/api/auth/register', async (req, res) => {
    const { name, email, password, role = 'user' } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    const existingUser = store.users.find((user) => user.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      return res.status(409).json({ message: 'A user with this email already exists.' });
    }

    const newUser = {
      id: crypto.randomUUID(),
      name,
      email: email.toLowerCase(),
      password: await bcrypt.hash(password, 10),
      role,
    };

    store.users.push(newUser);

    return res.status(201).json({
      user: formatUserResponse(newUser),
      token: signToken(newUser),
    });
  });

  app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = store.users.find((entry) => entry.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    return res.json({
      user: formatUserResponse(user),
      token: signToken(user),
    });
  });

  app.get('/api/products', (req, res) => {
    res.json(store.products);
  });

  app.post('/api/products', protect, requireRole('admin'), (req, res) => {
    const { name, description, price, category, stock = 0, image } = req.body;

    if (!name || !description || !category || price == null) {
      return res.status(400).json({ message: 'Product name, description, category, and price are required.' });
    }

    const newProduct = {
      id: crypto.randomUUID(),
      name,
      description,
      price: Number(price),
      stock: Number(stock),
      category,
      image: image || 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80',
    };

    store.products.push(newProduct);
    return res.status(201).json(newProduct);
  });

  app.put('/api/products/:id', protect, requireRole('admin'), (req, res) => {
    const { id } = req.params;
    const index = store.products.findIndex((product) => product.id === id);

    if (index === -1) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    store.products[index] = { ...store.products[index], ...req.body, id };
    return res.json(store.products[index]);
  });

  app.delete('/api/products/:id', protect, requireRole('admin'), (req, res) => {
    const { id } = req.params;
    const productIndex = store.products.findIndex((product) => product.id === id);

    if (productIndex === -1) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    const [deletedProduct] = store.products.splice(productIndex, 1);
    return res.json({ message: 'Product deleted.', product: deletedProduct });
  });

  app.get('/api/orders', protect, (req, res) => {
    if (req.user.role === 'admin') {
      return res.json(store.orders);
    }

    return res.json(store.orders.filter((order) => order.userId === req.user.id));
  });

  app.get('/api/orders/:id', protect, (req, res) => {
    const order = store.orders.find((entry) => entry.id === req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    if (req.user.role !== 'admin' && order.userId !== req.user.id) {
      return res.status(403).json({ message: 'You cannot view this order.' });
    }

    return res.json(order);
  });

  app.post('/api/orders', protect, (req, res) => {
    const { items, shippingAddress } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'At least one product is required to place an order.' });
    }

    const subtotal = items.reduce((sum, item) => {
      const safeQuantity = Number(item.quantity || 1);
      return sum + Number(item.price) * safeQuantity;
    }, 0);

    const order = {
      id: crypto.randomUUID(),
      userId: req.user.id,
      userName: req.user.name,
      items,
      total: Number(subtotal.toFixed(2)),
      status: 'Pending',
      shippingAddress: shippingAddress || { city: 'N/A', country: 'N/A' },
      createdAt: new Date().toISOString(),
    };

    store.orders.push(order);
    return res.status(201).json(order);
  });

  app.patch('/api/orders/:id/status', protect, requireRole('admin'), (req, res) => {
    const { status } = req.body;
    const order = store.orders.find((entry) => entry.id === req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    if (!status) {
      return res.status(400).json({ message: 'A valid status is required.' });
    }

    order.status = status;
    return res.json(order);
  });

  return app;
};
