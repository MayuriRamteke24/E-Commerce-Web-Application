import { HashRouter, Link, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || '/api';
const CART_KEY = 'northstar-cart';
const TOKEN_KEY = 'northstar-token';
const USER_KEY = 'northstar-user';

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
      <span className="cart-pill">Cart: {cartCount}</span>
    </nav>
  </header>
);

const HomePage = ({ products, cart, addToCart, updateCartQuantity, checkout, user }) => {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <main className="page-grid">
      <section className="catalog">
        <div className="section-header">
          <div>
            <p className="eyebrow">Featured products</p>
            <h1>Build your everyday essentials</h1>
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
                <div>
                  <h4>{item.name}</h4>
                  <p>{formatPrice(item.price)} each</p>
                </div>

                <div className="cart-actions">
                  <button onClick={() => updateCartQuantity(item.id, -1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateCartQuantity(item.id, 1)}>+</button>
                </div>
              </div>
            ))}

            <div className="totals">
              <div>
                <span>Subtotal</span>
                <strong>{formatPrice(subtotal)}</strong>
              </div>
            </div>

            <button className="checkout-button" onClick={checkout} disabled={!user}>
              {user ? 'Checkout' : 'Login to checkout'}
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
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem(CART_KEY) || '[]'));
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

  const fetchProducts = async () => {
    const { data } = await api.get('/products');
    setProducts(data);
  };

  const fetchOrders = async () => {
    if (!token) return;

    const { data } = await api.get('/orders', { headers: authHeaders(token) });
    setOrders(data);
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

  const handleLogin = async (values) => {
    setLoading(true);

    try {
      const { data } = await api.post('/auth/login', values);
      setUser(data.user);
      setToken(data.token);
      toast.success(`Welcome back, ${data.user.name}!`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed.');
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
      toast.error(error.response?.data?.message || 'Registration failed.');
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
      toast.error(error.response?.data?.message || 'Checkout failed.');
    }
  };

  const createProduct = async (values) => {
    if (!token) return;

    try {
      const { data } = await api.post('/products', values, { headers: authHeaders(token) });
      setProducts((currentProducts) => [data, ...currentProducts]);
      toast.success(`Product added: ${data.name}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to add product.');
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const { data } = await api.patch(`/orders/${orderId}/status`, { status }, { headers: authHeaders(token) });
      setOrders((currentOrders) => currentOrders.map((order) => (order.id === orderId ? data : order)));
      toast.success(`Order updated to ${status}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Status update failed.');
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
                user={user}
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
