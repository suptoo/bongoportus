'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Deal {
  id: string;
  title: string;
  client: string;
  value: string;
  status: string;
  date: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState('overview');
  const [deals, setDeals] = useState<Deal[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check authentication
    const authData = localStorage.getItem('authToken');
    if (!authData) {
      router.push('/auth');
      return;
    }

    const userData = JSON.parse(authData);
    if (userData.email !== 'umorfaruksupto@gmail.com') {
      router.push('/user');
      return;
    }

    setIsAuthenticated(true);
    
    // Load deals from localStorage
    const savedDeals = localStorage.getItem('companyDeals');
    if (savedDeals) {
      setDeals(JSON.parse(savedDeals));
    }
  }, [router]);

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
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(118, 75, 162, 0.2));
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
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
          margin-bottom: 3rem;
        }
        .stat-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 2rem;
          transition: all 0.3s ease;
        }
        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
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
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
        }
        .btn-success {
          background: linear-gradient(135deg, #4facfe, #00f2fe);
          color: white;
        }
        .btn-danger {
          background: linear-gradient(135deg, #fa709a, #fee140);
          color: white;
        }
        .data-table {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          overflow: hidden;
        }
        .table {
          width: 100%;
          border-collapse: collapse;
        }
        .table th, .table td {
          padding: 1rem;
          text-align: left;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        .table th {
          background: rgba(255, 255, 255, 0.1);
          font-weight: 600;
          color: #ffffff;
        }
        .form-group {
          margin-bottom: 1.5rem;
        }
        .form-label {
          display: block;
          margin-bottom: 0.5rem;
          color: #b3b3d4;
          font-weight: 500;
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
          border-color: #667eea;
          box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
        }
        .modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
        }
        .modal-content {
          background: rgba(30, 30, 60, 0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 2rem;
          max-width: 500px;
          width: 90%;
          max-height: 80vh;
          overflow-y: auto;
        }
        @media (max-width: 768px) {
          .sidebar {
            transform: translateX(-100%);
          }
          .main-content {
            margin-left: 0;
          }
        }
      `}</style>

      {/* Sidebar */}
      <div className="sidebar">
        <div className="p-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            🚢 BongoPortus Admin
          </h2>
        </div>
        
        <nav className="px-4">
          <a
            href="#"
            className={`nav-item ${activeSection === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveSection('overview')}
          >
            <i className="fas fa-tachometer-alt"></i>
            Dashboard Overview
          </a>
          <a
            href="#"
            className={`nav-item ${activeSection === 'deals' ? 'active' : ''}`}
            onClick={() => setActiveSection('deals')}
          >
            <i className="fas fa-handshake"></i>
            Company Deals
          </a>
          <a
            href="#"
            className={`nav-item ${activeSection === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveSection('analytics')}
          >
            <i className="fas fa-chart-line"></i>
            Company Management
          </a>
          <a
            href="#"
            className={`nav-item ${activeSection === 'chat' ? 'active' : ''}`}
            onClick={() => setActiveSection('chat')}
          >
            <i className="fas fa-comments"></i>
            Business Chat
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
        {activeSection === 'overview' && <OverviewSection />}
        {activeSection === 'deals' && <DealsSection deals={deals} setDeals={setDeals} />}
        {activeSection === 'analytics' && <AnalyticsSection />}
        {activeSection === 'chat' && <ChatSection />}
      </div>
    </div>
  );
}

function OverviewSection() {
  return (
    <div>
      <div className="header">
        <h1 className="text-3xl font-bold">📊 Dashboard Overview</h1>
        <p className="text-gray-400 mt-2">Welcome to your comprehensive business management center</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-400">Total Revenue</h3>
              <p className="text-3xl font-bold text-green-400">$245,890</p>
            </div>
            <i className="fas fa-dollar-sign text-4xl text-green-400"></i>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-400">Active Deals</h3>
              <p className="text-3xl font-bold text-blue-400">24</p>
            </div>
            <i className="fas fa-handshake text-4xl text-blue-400"></i>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-400">Shipments</h3>
              <p className="text-3xl font-bold text-purple-400">1,456</p>
            </div>
            <i className="fas fa-ship text-4xl text-purple-400"></i>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-400">Performance</h3>
              <p className="text-3xl font-bold text-yellow-400">98.5%</p>
            </div>
            <i className="fas fa-chart-line text-4xl text-yellow-400"></i>
          </div>
        </div>
      </div>
    </div>
  );
}

function DealsSection({ deals, setDeals }: { deals: Deal[]; setDeals: (deals: Deal[]) => void }) {
  const [showModal, setShowModal] = useState(false);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    client: '',
    value: '',
    status: 'pending',
    date: ''
  });

  const saveDeal = () => {
    if (editingDeal) {
      const updatedDeals = deals.map(deal => 
        deal.id === editingDeal.id ? { ...formData, id: editingDeal.id } : deal
      );
      setDeals(updatedDeals);
      localStorage.setItem('companyDeals', JSON.stringify(updatedDeals));
    } else {
      const newDeal = { ...formData, id: Date.now().toString() };
      const updatedDeals = [...deals, newDeal];
      setDeals(updatedDeals);
      localStorage.setItem('companyDeals', JSON.stringify(updatedDeals));
    }
    setShowModal(false);
    setEditingDeal(null);
    setFormData({ title: '', client: '', value: '', status: 'pending', date: '' });
  };

  return (
    <div>
      <div className="header">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">🤝 Company Deals</h1>
            <p className="text-gray-400 mt-2">Manage your business deals and contracts</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="btn btn-primary"
          >
            <i className="fas fa-plus"></i>
            Add New Deal
          </button>
        </div>
      </div>

      <div className="data-table">
        <table className="table">
          <thead>
            <tr>
              <th>Deal Title</th>
              <th>Client</th>
              <th>Value</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {deals.map((deal) => (
              <tr key={deal.id}>
                <td>{deal.title}</td>
                <td>{deal.client}</td>
                <td>{deal.value}</td>
                <td>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold
                    ${deal.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                      deal.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'}`}>
                    {deal.status}
                  </span>
                </td>
                <td>{deal.date}</td>
                <td>
                  <button
                    onClick={() => {
                      setEditingDeal(deal);
                      setFormData(deal);
                      setShowModal(true);
                    }}
                    className="btn btn-primary mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      const updatedDeals = deals.filter(d => d.id !== deal.id);
                      setDeals(updatedDeals);
                      localStorage.setItem('companyDeals', JSON.stringify(updatedDeals));
                    }}
                    className="btn btn-danger"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2 className="text-2xl font-bold mb-4">
              {editingDeal ? 'Edit Deal' : 'Add New Deal'}
            </h2>
            <div className="form-group">
              <label className="form-label">Deal Title</label>
              <input
                type="text"
                className="form-input"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Client</label>
              <input
                type="text"
                className="form-input"
                value={formData.client}
                onChange={(e) => setFormData({ ...formData, client: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Value</label>
              <input
                type="text"
                className="form-input"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                className="form-input"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Date</label>
              <input
                type="date"
                className="form-input"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
            <div className="flex gap-3">
              <button onClick={saveDeal} className="btn btn-success">
                {editingDeal ? 'Update' : 'Save'} Deal
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingDeal(null);
                  setFormData({ title: '', client: '', value: '', status: 'pending', date: '' });
                }}
                className="btn btn-danger"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AnalyticsSection() {
  return (
    <div>
      <div className="header">
        <h1 className="text-3xl font-bold">📈 Company Management</h1>
        <p className="text-gray-400 mt-2">Financial insights and business analytics</p>
      </div>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3 className="text-xl font-semibold mb-4">Monthly Revenue</h3>
          <div className="text-3xl font-bold text-green-400">$85,420</div>
          <div className="text-sm text-green-400 mt-2">↗ +12.5% from last month</div>
        </div>
        
        <div className="stat-card">
          <h3 className="text-xl font-semibold mb-4">Active Clients</h3>
          <div className="text-3xl font-bold text-blue-400">142</div>
          <div className="text-sm text-blue-400 mt-2">↗ +8 new clients</div>
        </div>
        
        <div className="stat-card">
          <h3 className="text-xl font-semibold mb-4">Operational Costs</h3>
          <div className="text-3xl font-bold text-yellow-400">$24,680</div>
          <div className="text-sm text-yellow-400 mt-2">↘ -5.2% efficiency gain</div>
        </div>
        
        <div className="stat-card">
          <h3 className="text-xl font-semibold mb-4">Profit Margin</h3>
          <div className="text-3xl font-bold text-purple-400">71.2%</div>
          <div className="text-sm text-purple-400 mt-2">↗ +3.1% improvement</div>
        </div>
      </div>
    </div>
  );
}

function ChatSection() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Welcome to business chat!", sender: "system", time: "10:00 AM" },
    { id: 2, text: "How can I assist you today?", sender: "support", time: "10:01 AM" }
  ]);
  const [newMessage, setNewMessage] = useState('');

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: Date.now(),
        text: newMessage,
        sender: "admin",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([...messages, message]);
      setNewMessage('');
    }
  };

  return (
    <div>
      <div className="header">
        <h1 className="text-3xl font-bold">💬 Business Chat</h1>
        <p className="text-gray-400 mt-2">Communicate with your team and clients</p>
      </div>

      <div className="glassmorphism p-6 h-96 flex flex-col">
        <div className="flex-1 overflow-y-auto mb-4 space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-2xl ${
                  msg.sender === 'admin'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                    : 'bg-gray-700 text-white'
                }`}
              >
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
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type your message..."
            className="form-input flex-1"
          />
          <button onClick={sendMessage} className="btn btn-primary">
            <i className="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </div>
  );
}