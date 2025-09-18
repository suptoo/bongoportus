'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface Product {
  title: string;
  price: string;
  image: string;
  rating: string;
  url: string;
}

interface CartItem extends Product {
  id: string;
  quantity: number;
}

interface Order {
  id: string;
  items: CartItem[];
  total: string;
  date: string;
  status: string;
}

export default function UserDashboard() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Check authentication
    const authData = localStorage.getItem('authToken');
    if (!authData) {
      router.push('/auth');
      return;
    }

    const userData = JSON.parse(authData);
    if (userData.email === 'umorfaruksupto@gmail.com') {
      router.push('/admin');
      return;
    }

    setIsAuthenticated(true);
    
    // Load cart and orders from localStorage
    const savedCart = localStorage.getItem('userCart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
    
    const savedOrders = localStorage.getItem('userOrders');
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
  }, [router]);

  const searchProducts = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/products?category=${encodeURIComponent(searchQuery)}&count=8`);
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product: Product) => {
    const cartItem = { ...product, id: Date.now().toString(), quantity: 1 };
    const updatedCart = [...cart, cartItem];
    setCart(updatedCart);
    localStorage.setItem('userCart', JSON.stringify(updatedCart));
  };

  if (!isAuthenticated) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <style jsx global>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif;
          background: linear-gradient(135deg, #0f0f23 0%, #161632 50%, #1e1e3c 100%);
          color: #ffffff;
          overflow-x: hidden;
        }
        .glassmorphism {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
        }
        .glassmorphism:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.2);
        }
        .sidebar {
          width: 280px;
          background: rgba(22, 22, 50, 0.8);
          backdrop-filter: blur(20px);
          border-right: 1px solid rgba(255, 255, 255, 0.1);
          position: fixed;
          height: 100vh;
          z-index: 1000;
          transition: all 0.3s ease;
        }
        .main-content {
          margin-left: 280px;
          min-height: 100vh;
          padding: 2rem;
        }
        .nav-item {
          display: flex;
          align-items: center;
          padding: 1rem 1.5rem;
          color: #b3b3d4;
          text-decoration: none;
          transition: all 0.3s ease;
          border-radius: 12px;
          margin: 0.5rem;
        }
        .nav-item:hover, .nav-item.active {
          background: linear-gradient(135deg, rgba(67, 233, 123, 0.2), rgba(56, 249, 215, 0.2));
          color: #ffffff;
          transform: translateX(5px);
        }
        .nav-item i {
          margin-right: 1rem;
          width: 20px;
          text-align: center;
        }
        .header {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          padding: 1.5rem 2rem;
          border-radius: 20px;
          margin-bottom: 2rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .product-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
          margin-top: 2rem;
        }
        .product-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 15px;
          padding: 1.5rem;
          transition: all 0.3s ease;
          text-align: center;
        }
        .product-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          border-color: rgba(67, 233, 123, 0.3);
        }
        .product-image {
          width: 100%;
          height: 180px;
          object-fit: contain;
          border-radius: 10px;
          margin-bottom: 1rem;
          background: rgba(255, 255, 255, 0.05);
        }
        .btn {
          padding: 0.8rem 1.5rem;
          border: none;
          border-radius: 50px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }
        .btn-primary {
          background: linear-gradient(135deg, #4facfe, #00f2fe);
          color: white;
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(79, 172, 254, 0.4);
        }
        .btn-success {
          background: linear-gradient(135deg, #43e97b, #38f9d7);
          color: white;
        }
        .btn-danger {
          background: linear-gradient(135deg, #fa709a, #fee140);
          color: white;
        }
        .search-container {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 2rem;
          margin-bottom: 2rem;
        }
        .search-input {
          width: 100%;
          padding: 1rem 1.5rem;
          font-size: 1.1rem;
          border: 2px solid rgba(67, 233, 123, 0.3);
          border-radius: 50px;
          background: rgba(0, 0, 0, 0.7);
          color: white;
          margin-bottom: 1rem;
          transition: all 0.3s ease;
        }
        .search-input:focus {
          outline: none;
          border-color: #43e97b;
          box-shadow: 0 0 20px rgba(67, 233, 123, 0.3);
        }
        .form-input {
          width: 100%;
          padding: 0.8rem 1rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          color: white;
          font-size: 1rem;
        }
        .form-input:focus {
          outline: none;
          border-color: #43e97b;
          box-shadow: 0 0 0 2px rgba(67, 233, 123, 0.2);
        }
        @media (max-width: 768px) {
          .sidebar {
            transform: translateX(-100%);
            width: 100%;
            max-width: 320px;
            transition: transform 0.3s ease;
          }
          .sidebar.mobile-open {
            transform: translateX(0);
          }
          .main-content {
            margin-left: 0;
            padding: 1rem;
          }
          .hamburger-user {
            display: block;
            position: fixed;
            top: 1rem;
            left: 1rem;
            z-index: 1001;
            background: rgba(0, 0, 0, 0.8);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 8px;
            padding: 12px;
            color: white;
            cursor: pointer;
            font-size: 1.2rem;
          }
          .hamburger-user:hover {
            background: rgba(67, 233, 123, 0.8);
          }
          .mobile-overlay-user {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.7);
            z-index: 999;
            backdrop-filter: blur(5px);
          }
          .header {
            padding: 1rem;
            margin-bottom: 1.5rem;
            margin-top: 3rem;
          }
          .product-grid {
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1rem;
          }
          .product-card {
            padding: 1rem;
          }
          .search-container {
            padding: 1rem;
            margin: 1rem;
          }
        }
        .hamburger-user {
          display: none;
        }
      `}</style>

      {/* Mobile Hamburger Menu */}
      <button 
        className="hamburger-user"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle menu"
      >
        <i className="fas fa-bars"></i>
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="mobile-overlay-user"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="p-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
            🛍️ BongoPortus User
          </h2>
        </div>
        
        <nav className="px-4">
          <a
            href="#"
            className={`nav-item ${activeSection === 'dashboard' ? 'active' : ''}`}
            onClick={() => { setActiveSection('dashboard'); setIsMobileMenuOpen(false); }}
          >
            <i className="fas fa-home"></i>
            Dashboard
          </a>
          <a
            href="#"
            className={`nav-item ${activeSection === 'search' ? 'active' : ''}`}
            onClick={() => { setActiveSection('search'); setIsMobileMenuOpen(false); }}
          >
            <i className="fas fa-search"></i>
            Product Search
          </a>
          <a
            href="#"
            className={`nav-item ${activeSection === 'cart' ? 'active' : ''}`}
            onClick={() => { setActiveSection('cart'); setIsMobileMenuOpen(false); }}
          >
            <i className="fas fa-shopping-cart"></i>
            Shopping Cart ({cart.length})
          </a>
          <a
            href="#"
            className={`nav-item ${activeSection === 'orders' ? 'active' : ''}`}
            onClick={() => { setActiveSection('orders'); setIsMobileMenuOpen(false); }}
          >
            <i className="fas fa-box"></i>
            Order History
          </a>
          <a
            href="#"
            className={`nav-item ${activeSection === 'chat' ? 'active' : ''}`}
            onClick={() => { setActiveSection('chat'); setIsMobileMenuOpen(false); }}
          >
            <i className="fas fa-comments"></i>
            Support Chat
          </a>
          <a
            href="#"
            onClick={() => {
              localStorage.removeItem('authToken');
              router.push('/');
            }}
            className="nav-item"
          >
            <i className="fas fa-sign-out-alt"></i>
            Logout
          </a>
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {activeSection === 'dashboard' && <DashboardSection />}
        {activeSection === 'search' && (
          <SearchSection
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            searchProducts={searchProducts}
            products={products}
            loading={loading}
            addToCart={addToCart}
          />
        )}
        {activeSection === 'cart' && <CartSection cart={cart} setCart={setCart} />}
        {activeSection === 'orders' && <OrdersSection orders={orders} />}
        {activeSection === 'chat' && <ChatSection />}
      </div>
    </div>
  );
}

function DashboardSection() {
  return (
    <div>
      <div className="header">
        <h1 className="text-3xl font-bold">🏠 User Dashboard</h1>
        <p className="text-gray-400 mt-2">Welcome to your personal shopping center</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="glassmorphism p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-400">Cart Items</h3>
              <p className="text-3xl font-bold text-green-400">0</p>
            </div>
            <i className="fas fa-shopping-cart text-4xl text-green-400"></i>
          </div>
        </div>
        
        <div className="glassmorphism p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-400">Total Orders</h3>
              <p className="text-3xl font-bold text-blue-400">0</p>
            </div>
            <i className="fas fa-box text-4xl text-blue-400"></i>
          </div>
        </div>
        
        <div className="glassmorphism p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-400">Saved Items</h3>
              <p className="text-3xl font-bold text-purple-400">0</p>
            </div>
            <i className="fas fa-heart text-4xl text-purple-400"></i>
          </div>
        </div>
      </div>

      <div className="mt-8 glassmorphism p-6">
        <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="btn btn-primary w-full">
            <i className="fas fa-search"></i>
            Search Products
          </button>
          <button className="btn btn-success w-full">
            <i className="fas fa-shopping-cart"></i>
            View Cart
          </button>
          <button className="btn btn-primary w-full">
            <i className="fas fa-box"></i>
            Order History
          </button>
          <button className="btn btn-success w-full">
            <i className="fas fa-comments"></i>
            Support Chat
          </button>
        </div>
      </div>
    </div>
  );
}

function SearchSection({ 
  searchQuery, 
  setSearchQuery, 
  searchProducts, 
  products, 
  loading, 
  addToCart 
}: {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchProducts: () => void;
  products: Product[];
  loading: boolean;
  addToCart: (product: Product) => void;
}) {
  return (
    <div>
      <div className="header">
        <h1 className="text-3xl font-bold">🔍 Product Search</h1>
        <p className="text-gray-400 mt-2">Find amazing products from Amazon</p>
      </div>

      <div className="search-container">
        <div className="flex gap-3 flex-col sm:flex-row">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && searchProducts()}
            placeholder="Search for products (e.g., iPhone, Sony, Samsung)..."
            className="search-input flex-1"
          />
          <button
            onClick={searchProducts}
            disabled={loading}
            className="btn btn-success"
          >
            {loading ? 'Searching...' : '🔍 Search'}
          </button>
        </div>
      </div>

      {products.length > 0 && (
        <div className="product-grid">
          {products.map((product: Product, index: number) => (
            <div key={index} className="product-card">
              <Image
                src={product.image}
                alt={product.title}
                width={300}
                height={300}
                className="product-image"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder-product.png';
                }}
              />
              <h3 className="text-lg font-semibold mb-2 line-clamp-2">{product.title}</h3>
              <div className="text-xl font-bold text-green-400 mb-2">{product.price}</div>
              <div className="text-yellow-400 mb-4">⭐ {product.rating}</div>
              <div className="flex gap-2">
                <button
                  onClick={() => addToCart(product)}
                  className="btn btn-success flex-1"
                >
                  <i className="fas fa-cart-plus"></i>
                  Add to Cart
                </button>
                <button
                  onClick={() => window.open(product.url, '_blank')}
                  className="btn btn-primary flex-1"
                >
                  <i className="fas fa-external-link-alt"></i>
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CartSection({ cart, setCart }: { cart: CartItem[]; setCart: (cart: CartItem[]) => void }) {
  const removeFromCart = (id: string) => {
    const updatedCart = cart.filter((item: CartItem) => item.id !== id);
    setCart(updatedCart);
    localStorage.setItem('userCart', JSON.stringify(updatedCart));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('userCart');
  };

  return (
    <div>
      <div className="header">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">🛒 Shopping Cart</h1>
            <p className="text-gray-400 mt-2">Review your selected items</p>
          </div>
          {cart.length > 0 && (
            <button onClick={clearCart} className="btn btn-danger">
              <i className="fas fa-trash"></i>
              Clear Cart
            </button>
          )}
        </div>
      </div>

      {cart.length === 0 ? (
        <div className="glassmorphism p-8 text-center">
          <i className="fas fa-shopping-cart text-6xl text-gray-400 mb-4"></i>
          <h3 className="text-2xl font-bold mb-2">Your cart is empty</h3>
          <p className="text-gray-400">Start shopping to add items to your cart</p>
        </div>
      ) : (
        <div className="space-y-4">
          {cart.map((item: CartItem) => (
            <div key={item.id} className="glassmorphism p-4 flex items-center gap-4">
              <Image
                src={item.image}
                alt={item.title}
                width={80}
                height={80}
                className="w-20 h-20 object-contain rounded-lg"
              />
              <div className="flex-1">
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-green-400 font-bold">{item.price}</p>
              </div>
              <button
                onClick={() => removeFromCart(item.id)}
                className="btn btn-danger"
              >
                <i className="fas fa-trash"></i>
              </button>
            </div>
          ))}
          
          <div className="glassmorphism p-6 text-center">
            <button className="btn btn-success">
              <i className="fas fa-credit-card"></i>
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function OrdersSection({ orders }: { orders: Order[] }) {
  return (
    <div>
      <div className="header">
        <h1 className="text-3xl font-bold">📦 Order History</h1>
        <p className="text-gray-400 mt-2">Track your previous orders</p>
      </div>

      {orders.length === 0 ? (
        <div className="glassmorphism p-8 text-center">
          <i className="fas fa-box text-6xl text-gray-400 mb-4"></i>
          <h3 className="text-2xl font-bold mb-2">No orders yet</h3>
          <p className="text-gray-400">Your order history will appear here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order: Order) => (
            <div key={order.id} className="glassmorphism p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold">Order #{order.id}</h3>
                  <p className="text-gray-400">Date: {order.date}</p>
                  <p className="text-green-400 font-bold">Total: {order.total}</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-400">
                  {order.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ChatSection() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Welcome! How can we help you today?", sender: "support", time: "10:00 AM", customerName: "Support Team" }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const sendMessage = async () => {
    if (!newMessage.trim() || !customerName.trim() || !customerEmail.trim()) {
      setError('Please fill in your name, email, and message');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerName: customerName.trim(),
          customerEmail: customerEmail.trim(),
          subject: subject.trim() || 'Support Request',
          message: newMessage.trim(),
          type: 'new'
        }),
      });

      const result = await response.json();

      if (result.success) {
        const message = {
          id: Date.now(),
          text: newMessage,
          sender: "user",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          customerName: customerName
        };
        setMessages([...messages, message]);
        setNewMessage('');
        setSuccess('Message sent successfully! Our team will respond soon.');
        
        // Auto reply
        setTimeout(() => {
          const reply = {
            id: Date.now() + 1,
            text: "Thank you for contacting us! We have received your message and will get back to you within 24 hours.",
            sender: "support",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            customerName: "Support Team"
          };
          setMessages(prev => [...prev, reply]);
        }, 1500);
      } else {
        setError(result.error || 'Failed to send message');
      }
    } catch (err) {
      setError('Failed to send message. Please try again.');
      console.error('Message error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="header">
        <h1 className="text-3xl font-bold">💬 Support Chat</h1>
        <p className="text-gray-400 mt-2">Get help from our support team - we&apos;ll see your name and respond personally</p>
      </div>

      {/* Customer Information Form */}
      <div className="glassmorphism p-6 mb-6">
        <h3 className="text-xl font-bold mb-4 text-green-400">Your Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Your Name *</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => { setCustomerName(e.target.value); setError(''); }}
              placeholder="Enter your full name"
              className="form-input"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Email Address *</label>
            <input
              type="email"
              value={customerEmail}
              onChange={(e) => { setCustomerEmail(e.target.value); setError(''); }}
              placeholder="Enter your email"
              className="form-input"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">Subject (Optional)</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="What is your message about?"
            className="form-input"
          />
        </div>
      </div>

      {success && (
        <div className="glassmorphism p-4 mb-4" style={{ background: 'rgba(76, 175, 80, 0.1)', borderColor: 'rgba(76, 175, 80, 0.3)' }}>
          <div className="text-green-400 font-semibold">
            <i className="fas fa-check-circle mr-2"></i>
            {success}
          </div>
        </div>
      )}

      {error && (
        <div className="glassmorphism p-4 mb-4" style={{ background: 'rgba(244, 67, 54, 0.1)', borderColor: 'rgba(244, 67, 54, 0.3)' }}>
          <div className="text-red-400 font-semibold">
            <i className="fas fa-exclamation-circle mr-2"></i>
            {error}
          </div>
        </div>
      )}

      <div className="glassmorphism p-6 h-96 flex flex-col">
        <div className="flex-1 overflow-y-auto mb-4 space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs px-4 py-3 rounded-2xl ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-green-500 to-blue-600 text-white'
                    : 'bg-gray-700 text-white'
                }`}
              >
                <div className="flex items-center mb-1">
                  <strong className="text-sm">
                    {msg.sender === 'user' ? msg.customerName || 'You' : 'Support Team'}
                  </strong>
                </div>
                <p className="text-sm">{msg.text}</p>
                <p className="text-xs opacity-70 mt-1">{msg.time}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex gap-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => { setNewMessage(e.target.value); setError(''); setSuccess(''); }}
            onKeyPress={(e) => e.key === 'Enter' && !loading && sendMessage()}
            placeholder="Type your message..."
            className="form-input flex-1"
            disabled={loading}
          />
          <button 
            onClick={sendMessage} 
            disabled={loading || !customerName.trim() || !customerEmail.trim()}
            className="btn btn-success"
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
              </>
            ) : (
              <i className="fas fa-paper-plane"></i>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}