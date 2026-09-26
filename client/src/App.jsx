import { HashRouter, Link, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || '/api';
const CART_KEY = 'northstar-cart';
const TOKEN_KEY = 'northstar-token';
const USER_KEY = 'northstar-user';
const PRODUCTS_KEY = 'northstar-products';
const USERS_KEY = 'northstar-users';
const ORDERS_KEY = 'northstar-orders';

const demoProducts = [
  {
    id: 'prod-1',
    name: 'AeroMax Runner',
    price: 129.99,
    stock: 24,
    category: 'Footwear',
    description: 'Lightweight everyday sneakers built for comfort, movement, and all-day wear.',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'prod-7',
    name: 'Velvet Luxe Dress',
    price: 189.0,
    stock: 12,
    category: 'Women',
    description: 'A statement evening dress designed for graceful silhouettes and standout nights.',
    image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'prod-8',
    name: 'Rose Aura Blazer',
    price: 219.0,
    stock: 9,
    category: 'Women',
    description: 'Sharp tailoring with a feminine finish for elevated office-to-evening styling.',
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'prod-2',
    name: 'Nimbus Smartwatch',
    price: 219,
    stock: 18,
    category: 'Electronics',
    description: 'Premium wearable tech for fitness, notifications, and everyday productivity.',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'prod-3',
    name: 'Luma Laptop Stand',
    price: 89.5,
    stock: 35,
    category: 'Accessories',
    description: 'A refined aluminum stand that lifts your setup for better posture and focus.',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'prod-4',
    name: 'Terra Ceramic Mug',
    price: 24,
    stock: 42,
    category: 'Home',
    description: 'Handcrafted warmth for slow mornings, tea breaks, and cozy rituals.',
    image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'prod-5',
    name: 'Crest Headphones',
    price: 149,
    stock: 16,
    category: 'Electronics',
    description: 'Immersive wireless audio with crisp detail and all-day comfort.',
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'prod-6',
    name: 'Harbor Backpack',
    price: 79.99,
    stock: 22,
    category: 'Travel',
    description: 'A sleek, durable backpack for commutes, campus days, and city escapes.',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80',
  },
];

const demoUsers = [
  { id: 'admin-demo', name: 'Admin Manager', email: 'admin@shop.com', password: 'admin123', role: 'admin' },
  { id: 'user-demo', name: 'Demo Customer', email: 'user@shop.com', password: 'user123', role: 'user' },
];

const readLocalStorageArray = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const readSession = () => {
  const storedToken = localStorage.getItem(TOKEN_KEY) || '';
  const storedUser = localStorage.getItem(USER_KEY);

  return {
    token: storedToken,
    user: storedUser ? JSON.parse(storedUser) : null,
  };
};

const api = axios.create({
  baseURL: API_URL,
});

const authHeaders = (token) => ({
  Authorization: `Bearer ${token}`,
});

const formatPrice = (value) => {
  const amount = Number(value || 0);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

const Header = ({ user, onLogout, cartCount }) => (
  <header className="topbar">
    <div className="brand-wrap">
      <Link to="/" className="brand">
        Northstar Commerce
      </Link>
    </div>

    <nav className="nav-links">
      <Link to="/">Home</Link>
      <Link to="/orders">Orders</Link>
      {user?.role === 'admin' && <Link to="/admin">Admin</Link>}
      {!user ? (
        <Link to="/login">Login</Link>
      ) : (
        <button className="ghost-button" onClick={onLogout}>
          Logout
        </button>
      )}
      <Link to="/checkout" className="cart-pill">Cart: {cartCount}</Link>
    </nav>
  </header>
);

const PaymentCard = ({ total, userName }) => (
  <div className="upi-card">
    <div className="upi-header">
      <div className="kotak-logo">
        <span className="kotak-mark">kotak</span>
        <span className="kotak-slash">/</span>
      </div>
    </div>

    <div className="upi-title">Scan to pay with any UPI app</div>

    <div className="qr-shell">
      <div className="qr-code" aria-label="UPI QR code">
        <span className="qr-block qr-block-a" />
        <span className="qr-block qr-block-b" />
        <span className="qr-block qr-block-c" />
        <span className="qr-block qr-block-d" />
        <span className="qr-block qr-block-e" />
        <span className="qr-block qr-block-f" />
        <span className="qr-block qr-block-g" />
        <span className="qr-block qr-block-h" />
        <span className="qr-block qr-block-i" />
        <span className="qr-block qr-block-j" />
        <span className="qr-block qr-block-k" />
        <span className="qr-block qr-block-l" />
      </div>
    </div>

    <div className="payer-name">{(userName || 'PIYUSH PARMANAND').toUpperCase()}</div>
    <div className="upi-id-row">
      <span>UPI ID:</span>
      <strong>8459727473@kotakbank</strong>
    </div>

    <div className="payment-footer">
      <span className="payment-badge">Kotak811</span>
    </div>
  </div>
);

const HomePage = ({ products, cart, addToCart, updateCartQuantity, checkout, removeFromCart, user }) => {
  const navigate = useNavigate();
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const finalTotal = subtotal > 75 ? subtotal : subtotal + 12;

  return (
    <main className="page-shell">
      <section className="hero-banner">
        <div className="hero-copy">
          <p className="eyebrow">Fresh arrivals</p>
          <h1>Modern essentials for everyday life.</h1>
          <p className="hero-text">
            Discover elevated essentials, smart tech, and curated everyday upgrades for home, work, and travel.
          </p>
          <div className="hero-actions">
            <a href="#catalog" className="primary-link">Shop now</a>
            <span className="mini-badge">Free shipping over $75</span>
          </div>
        </div>
        <div className="hero-highlight">
          <span className="highlight-label">Trending now</span>
          <h3>New season drop</h3>
          <div className="feature-pills">
            <span>Premium</span>
            <span>Fast delivery</span>
            <span>Clean design</span>
          </div>
        </div>
      </section>

      <section className="feature-strip">
        <div className="feature-card dark-card">
          <span>New in</span>
          <strong>Girls Collection</strong>
          <small>Bold silhouettes. Everyday elegance.</small>
        </div>
        <div className="feature-card accent-card">
          <span>Limited drop</span>
          <strong>Spring edit</strong>
          <small>Fresh styles in soft neutrals.</small>
        </div>
      </section>

      <section className="collection-banner">
        <div className="collection-copy">
          <p className="eyebrow">Girls Collection</p>
          <h2>Elegant essentials for every mood.</h2>
        </div>
        <button className="collection-button">Explore collection</button>
      </section>

      <section id="catalog" className="catalog">
        <div className="section-header">
          <div>
            <p className="eyebrow">Featured products</p>
            <h2>Build your everyday essentials</h2>
          </div>
        </div>

        <div className="product-grid">
          {products.map((product) => (
            <article className="product-card" key={product.id}>
              <img src={product.image} alt={product.name} />
              <div className="product-meta">
                <span className="category-tag">{product.category}</span>
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <div className="product-row">
                  <strong>{formatPrice(product.price)}</strong>
                  <span>{product.stock} in stock</span>
                </div>
                <button onClick={() => addToCart(product)}>Add to cart</button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <aside className="cart-panel">
        <h2>Shopping cart</h2>
        {cart.length === 0 ? (
          <p className="empty-state">Your cart is empty. Add a few essentials to get started.</p>
        ) : (
          <>
            {cart.map((item) => (
              <div className="cart-item" key={item.id}>
                <div className="cart-item-main">
                  <div className="cart-thumb" style={{ backgroundImage: `url(${products.find((product) => product.id === item.id)?.image || 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80'})` }} />
                  <div className="cart-copy">
                    <h4>{item.name}</h4>
                    <p>{formatPrice(item.price)} each</p>
                  </div>
                </div>

                <div className="cart-actions-wrap">
                  <div className="cart-actions">
                    <button onClick={() => updateCartQuantity(item.id, -1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateCartQuantity(item.id, 1)}>+</button>
                  </div>
                  <button className="remove-item" onClick={() => removeFromCart(item.id)}>Remove</button>
                </div>
              </div>
            ))}

            <div className="totals">
              <div className="total-row">
                <span>Subtotal</span>
                <strong>{formatPrice(subtotal)}</strong>
              </div>
              <div className="total-row muted-row">
                <span>Shipping</span>
                <strong>{subtotal > 75 ? 'Free' : formatPrice(12)}</strong>
              </div>
              <div className="total-row grand-total">
                <span>Total</span>
                <strong>{formatPrice(subtotal > 75 ? subtotal : subtotal + 12)}</strong>
              </div>
            </div>

            <div className="payment-panel">
              <PaymentCard total={finalTotal} userName={user?.name} />
            </div>

            <button
              className="checkout-button"
              onClick={() => {
                if (!user) {
                  navigate('/login');
                  return;
                }
                navigate('/checkout');
              }}
            >
              {user ? 'Go to checkout' : 'Login to checkout'}
            </button>
          </>
        )}
      </aside>
    </main>
  );
};

const AuthPage = ({ onLogin, onRegister, loading }) => {
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({
    name: '',
    email: 'user@shop.com',
    password: 'user123',
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (mode === 'login') {
      await onLogin({ email: form.email, password: form.password });
    } else {
      await onRegister({
        name: form.name,
        email: form.email,
        password: form.password,
      });
    }
    navigate('/');
  };

  return (
    <main className="auth-shell">
      <div className="auth-card">
        <div className="auth-toggle">
          <button
            className={mode === 'login' ? 'active' : ''}
            onClick={() => setMode('login')}
            type="button"
          >
            Login
          </button>
          <button
            className={mode === 'register' ? 'active' : ''}
            onClick={() => setMode('register')}
            type="button"
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="form-stack">
          {mode === 'register' && (
            <label>
              Full name
              <input
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                placeholder="Jane Smith"
              />
            </label>
          )}

          <label>
            Email
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              placeholder="you@example.com"
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              placeholder="********"
            />
          </label>

          <button type="submit" className="primary-button" disabled={loading}>
            {loading ? 'Processing...' : mode === 'login' ? 'Login' : 'Create account'}
          </button>
        </form>

        <div className="demo-box">
          <small>Demo credentials</small>
          <p>Admin: admin@shop.com / admin123</p>
          <p>Customer: user@shop.com / user123</p>
        </div>
      </div>
    </main>
  );
};

const CartPage = ({ cart, products, user, updateCartQuantity, removeFromCart, checkout }) => {
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <main className="content-page cart-empty-wrap">
        <div className="empty-cart-card">
          <p className="eyebrow">Your cart is empty</p>
          <h1>Looks like you haven’t added anything yet.</h1>
          <p>Explore new arrivals and build your perfect pick.</p>
          <button className="primary-button" onClick={() => navigate('/')}>
            Continue shopping
          </button>
        </div>
      </main>
    );
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 75 ? 0 : 12;
  const total = subtotal + shipping;

  return (
    <main className="content-page cart-page">
      <div className="page-header cart-header">
        <div>
          <p className="eyebrow">Shopping cart</p>
          <h1>Review your order</h1>
        </div>
        <span className="cart-total-badge">{cart.reduce((sum, item) => sum + item.quantity, 0)} items</span>
      </div>

      <div className="cart-layout">
        <section className="cart-items-panel">
          {cart.map((item) => {
            const product = products.find((entry) => entry.id === item.id);

            return (
              <article className="amazon-cart-item" key={item.id}>
                <div className="amazon-cart-image" style={{ backgroundImage: `url(${product?.image || 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80'})` }} />

                <div className="amazon-cart-info">
                  <div className="amazon-cart-topline">
                    <div>
                      <h3>{item.name}</h3>
                      <span>{product?.category || 'Featured'}</span>
                    </div>
                    <strong>{formatPrice(item.price * item.quantity)}</strong>
                  </div>

                  <p>{product?.description || 'Premium quality selection for everyday life.'}</p>

                  <div className="amazon-cart-controls">
                    <div className="cart-actions">
                      <button onClick={() => updateCartQuantity(item.id, -1)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateCartQuantity(item.id, 1)}>+</button>
                    </div>

                    <button className="link-button" onClick={() => removeFromCart(item.id)}>Delete</button>
                  </div>
                </div>
              </article>
            );
          })}
        </section>

        <aside className="checkout-summary">
          <div className="summary-box">
            <div className="delivery-box">
              <span>Delivery to</span>
              <strong>{user?.name || 'Guest shopper'}</strong>
              <small>Fast doorstep delivery</small>
            </div>

            <div className="summary-totals">
              <div className="total-row">
                <span>Subtotal</span>
                <strong>{formatPrice(subtotal)}</strong>
              </div>
              <div className="total-row muted-row">
                <span>Shipping</span>
                <strong>{shipping === 0 ? 'Free' : formatPrice(shipping)}</strong>
              </div>
              <div className="total-row grand-total">
                <span>Total</span>
                <strong>{formatPrice(total)}</strong>
              </div>
            </div>

            <button
              className="checkout-button amazon-button"
              onClick={() => {
                if (!user) {
                  navigate('/login');
                  return;
                }
                checkout();
              }}
            >
              Proceed to secure checkout
            </button>
          </div>

          <PaymentCard total={total} userName={user?.name} />
        </aside>
      </div>
    </main>
  );
};

const OrdersPage = ({ orders, user }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <main className="content-page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Order tracking</p>
          <h1>Your purchases</h1>
        </div>
      </div>

      <div className="orders-list">
        {orders.length === 0 ? (
          <div className="empty-card">No orders yet. Start shopping to see them here.</div>
        ) : (
          orders.map((order) => (
            <article key={order.id} className="order-card">
              <div className="order-topline">
                <div>
                  <span className="order-title">Order #{order.id.slice(0, 8)}</span>
                  <small>{new Date(order.createdAt).toLocaleDateString()}</small>
                </div>
                <span className={`status-pill ${order.status.toLowerCase()}`}>{order.status}</span>
              </div>

              <ul>
                {order.items.map((item) => (
                  <li key={`${order.id}-${item.id}`}>
                    {item.name} × {item.quantity}
                  </li>
                ))}
              </ul>

              <div className="order-footer">
                <strong>Total: {formatPrice(order.total)}</strong>
              </div>
            </article>
          ))
        )}
      </div>
    </main>
  );
};

const AdminPage = ({ products, onCreateProduct, onUpdateStatus, orders }) => {
  const [form, setForm] = useState({
    name: '',
    description: '',
    category: 'Accessories',
    price: '',
    stock: '10',
    image: '',
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onCreateProduct(form);
    setForm({
      name: '',
      description: '',
      category: 'Accessories',
      price: '',
      stock: '10',
      image: '',
    });
  };

  return (
    <main className="content-page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Admin workspace</p>
          <h1>Manage inventory and orders</h1>
        </div>
      </div>

      <div className="admin-grid">
        <form onSubmit={handleSubmit} className="admin-form">
          <h2>Add a product</h2>
          <label>
            Name
            <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
          </label>
          <label>
            Description
            <textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
          </label>
          <div className="two-col">
            <label>
              Category
              <input value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} />
            </label>
            <label>
              Price
              <input type="number" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} />
            </label>
          </div>
          <div className="two-col">
            <label>
              Stock
              <input type="number" value={form.stock} onChange={(event) => setForm({ ...form, stock: event.target.value })} />
            </label>
            <label>
              Image URL
              <input value={form.image} onChange={(event) => setForm({ ...form, image: event.target.value })} />
            </label>
          </div>
          <button type="submit" className="primary-button">Save product</button>
        </form>

        <div className="admin-orders">
          <h2>Recent orders</h2>
          {orders.length === 0 ? (
            <p className="empty-state">No orders yet.</p>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="admin-order-item">
                <div>
                  <strong>{order.userName}</strong>
                  <small>{order.items.length} items</small>
                </div>
                <div>
                  <span className={`status-pill ${order.status.toLowerCase()}`}>{order.status}</span>
                  <select value={order.status} onChange={(event) => onUpdateStatus(order.id, event.target.value)}>
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="inventory-panel">
        <h2>Inventory</h2>
        <div className="inventory-list">
          {products.map((product) => (
            <div key={product.id} className="inventory-row">
              <span>{product.name}</span>
              <span>{product.stock} units</span>
              <span>{formatPrice(product.price)}</span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

const App = () => {
  const initialSession = readSession();
  const [user, setUser] = useState(initialSession.user);
  const [token, setToken] = useState(initialSession.token);
  const [products, setProducts] = useState(() => readLocalStorageArray(PRODUCTS_KEY, demoProducts));
  const [orders, setOrders] = useState(() => readLocalStorageArray(ORDERS_KEY, []));
  const [cart, setCart] = useState(() => readLocalStorageArray(CART_KEY, []));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  }, [orders]);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/products');
      setProducts(data);
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(data));
    } catch (error) {
      const fallback = readLocalStorageArray(PRODUCTS_KEY, demoProducts);
      setProducts(fallback);
    }
  };

  const fetchOrders = async () => {
    if (!token) return;

    try {
      const { data } = await api.get('/orders', { headers: authHeaders(token) });
      setOrders(data);
    } catch (error) {
      const storedOrders = readLocalStorageArray(ORDERS_KEY, []);
      setOrders(storedOrders.filter((order) => order.userId === user?.id || user?.role === 'admin'));
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [token]);

  const addToCart = (product) => {
    const existingItem = cart.find((item) => item.id === product.id);

    if (existingItem) {
      setCart((currentCart) =>
        currentCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        ),
      );
      return;
    }

    setCart((currentCart) => [
      ...currentCart,
      {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
      },
    ]);
  };

  const updateCartQuantity = (productId, change) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === productId ? { ...item, quantity: item.quantity + change } : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const removeFromCart = (productId) => {
    setCart((currentCart) => currentCart.filter((item) => item.id !== productId));
    toast.success('Item removed from cart.');
  };

  const handleLogin = async (values) => {
    setLoading(true);

    try {
      const { data } = await api.post('/auth/login', values);
      setUser(data.user);
      setToken(data.token);
      toast.success(`Welcome back, ${data.user.name}!`);
    } catch (error) {
      const savedUsers = readLocalStorageArray(USERS_KEY, demoUsers);
      const matchedUser = savedUsers.find(
        (entry) =>
          entry.email.toLowerCase() === values.email.toLowerCase() && entry.password === values.password,
      );

      if (matchedUser) {
        const userSession = { id: matchedUser.id, name: matchedUser.name, email: matchedUser.email, role: matchedUser.role };
        setUser(userSession);
        setToken('demo-token');
        localStorage.setItem(USER_KEY, JSON.stringify(userSession));
        toast.success(`Welcome back, ${matchedUser.name}!`);
      } else {
        toast.error(error.response?.data?.message || 'Login failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (values) => {
    setLoading(true);

    try {
      const { data } = await api.post('/auth/register', values);
      setUser(data.user);
      setToken(data.token);
      toast.success('Account created successfully!');
    } catch (error) {
      const savedUsers = readLocalStorageArray(USERS_KEY, demoUsers);
      const existingUser = savedUsers.find((entry) => entry.email.toLowerCase() === values.email.toLowerCase());

      if (existingUser) {
        toast.error('A user with this email already exists.');
      } else {
        const newUser = {
          id: `user-${Date.now()}`,
          name: values.name,
          email: values.email.toLowerCase(),
          password: values.password,
          role: 'user',
        };
        savedUsers.push(newUser);
        localStorage.setItem(USERS_KEY, JSON.stringify(savedUsers));
        const userSession = { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role };
        setUser(userSession);
        setToken('demo-token');
        toast.success('Account created successfully!');
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken('');
    setCart([]);
    toast.success('Logged out successfully.');
  };

  const checkout = async () => {
    if (!user || !token) {
      toast.error('Please log in before checkout.');
      return;
    }

    if (cart.length === 0) {
      toast.error('Your cart is empty.');
      return;
    }

    const orderPayload = {
      id: `order-${Date.now()}`,
      userId: user.id,
      userName: user.name,
      items: cart,
      total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
      status: 'Pending',
      shippingAddress: { city: 'Remote', country: 'USA' },
      createdAt: new Date().toISOString(),
    };

    try {
      const { data } = await api.post(
        '/orders',
        {
          items: cart,
          shippingAddress: {
            city: 'Remote',
            country: 'USA',
          },
        },
        { headers: authHeaders(token) },
      );

      setOrders((currentOrders) => [data, ...currentOrders]);
      setCart([]);
      toast.success(`Order placed! Total ${formatPrice(data.total)}`);
    } catch (error) {
      const nextOrders = [orderPayload, ...readLocalStorageArray(ORDERS_KEY, [])];
      localStorage.setItem(ORDERS_KEY, JSON.stringify(nextOrders));
      setOrders(nextOrders);
      setCart([]);
      toast.success(`Order placed! Total ${formatPrice(orderPayload.total)}`);
    }
  };

  const createProduct = async (values) => {
    if (!token) return;

    const productPayload = {
      id: `prod-${Date.now()}`,
      name: values.name,
      description: values.description,
      price: Number(values.price || 0),
      stock: Number(values.stock || 0),
      category: values.category,
      image: values.image || 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80',
    };

    try {
      const { data } = await api.post('/products', values, { headers: authHeaders(token) });
      setProducts((currentProducts) => [data, ...currentProducts]);
      toast.success(`Product added: ${data.name}`);
    } catch (error) {
      const nextProducts = [productPayload, ...products];
      setProducts(nextProducts);
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(nextProducts));
      toast.success(`Product added: ${productPayload.name}`);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const { data } = await api.patch(`/orders/${orderId}/status`, { status }, { headers: authHeaders(token) });
      setOrders((currentOrders) => currentOrders.map((order) => (order.id === orderId ? data : order)));
      toast.success(`Order updated to ${status}`);
    } catch (error) {
      const updatedOrders = orders.map((order) => (order.id === orderId ? { ...order, status } : order));
      setOrders(updatedOrders);
      localStorage.setItem(ORDERS_KEY, JSON.stringify(updatedOrders));
      toast.success(`Order updated to ${status}`);
    }
  };

  return (
    <HashRouter>
      <div className="app-shell">
        <Header user={user} onLogout={logout} cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)} />
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                products={products}
                cart={cart}
                addToCart={addToCart}
                updateCartQuantity={updateCartQuantity}
                checkout={checkout}
                removeFromCart={removeFromCart}
                user={user}
              />
            }
          />
          <Route
            path="/checkout"
            element={
              <CartPage
                cart={cart}
                products={products}
                user={user}
                updateCartQuantity={updateCartQuantity}
                removeFromCart={removeFromCart}
                checkout={checkout}
              />
            }
          />
          <Route
            path="/cart"
            element={
              <CartPage
                cart={cart}
                products={products}
                user={user}
                updateCartQuantity={updateCartQuantity}
                removeFromCart={removeFromCart}
                checkout={checkout}
              />
            }
          />
          <Route path="/login" element={<AuthPage onLogin={handleLogin} onRegister={handleRegister} loading={loading} />} />
          <Route path="/orders" element={<OrdersPage orders={orders} user={user} />} />
          <Route
            path="/admin"
            element={
              user?.role === 'admin' ? (
                <AdminPage products={products} onCreateProduct={createProduct} onUpdateStatus={updateOrderStatus} orders={orders} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      </div>
      <Toaster position="top-right" />
    </HashRouter>
  );
};

export default App;
