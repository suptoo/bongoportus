'use client';
import Link from 'next/link';
import ProductSearch from '@/components/ProductSearch';

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      <style jsx global>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
          overflow-x: hidden; background: #000; color: #fff;
        }
        .navbar {
          position: fixed; top: 0; width: 100%; z-index: 1000;
          background: rgba(0, 0, 0, 0.95); backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(76, 175, 80, 0.3);
        }
        .nav-container {
          max-width: 1200px; margin: 0 auto; display: flex;
          justify-content: space-between; align-items: center; padding: 1rem 2rem;
        }
        .logo {
          font-size: 2rem; font-weight: bold;
          background: linear-gradient(45deg, #4CAF50, #81C784);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          text-transform: uppercase; letter-spacing: 2px;
        }
        .nav-links { display: flex; gap: 2rem; list-style: none; }
        .nav-links a {
          color: #fff; text-decoration: none; font-weight: 500;
          padding: 0.5rem 1rem; border-radius: 25px; transition: all 0.3s ease;
        }
        .nav-links a:hover { color: #4CAF50; transform: translateY(-3px); }
        .admin-btn {
          background: linear-gradient(45deg, #4CAF50, #81C784) !important;
          color: white !important; padding: 0.7rem 1.5rem !important;
          font-weight: 600; text-transform: uppercase;
        }
        .hero {
          height: 100vh; position: relative; display: flex;
          align-items: center; justify-content: center;
          background: linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%);
          overflow: hidden;
        }
        .hero::before {
          content: ""; position: absolute; top: 0; left: 0; right: 0; bottom: 0;
          background: radial-gradient(circle at 20% 20%, rgba(76, 175, 80, 0.1) 0%, transparent 50%);
          animation: pulse 8s ease-in-out infinite;
        }
        @keyframes pulse { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }
        .hero-content { text-align: center; z-index: 2; max-width: 800px; padding: 0 2rem; }
        .hero-title {
          font-size: 4rem; font-weight: 900; margin-bottom: 1rem;
          background: linear-gradient(45deg, #4CAF50, #81C784, #A5D6A7);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          text-transform: uppercase; letter-spacing: 3px;
        }
        .hero-subtitle { font-size: 1.5rem; margin-bottom: 2rem; color: #ccc; }
        .hero-buttons { display: flex; gap: 2rem; justify-content: center; flex-wrap: wrap; }
        .cta-button {
          padding: 1rem 2.5rem; font-size: 1.1rem; font-weight: 600;
          text-decoration: none; border-radius: 50px; transition: all 0.4s ease;
          text-transform: uppercase; letter-spacing: 1px;
        }
        .cta-primary {
          background: linear-gradient(45deg, #4CAF50, #81C784); color: white;
          box-shadow: 0 10px 30px rgba(76, 175, 80, 0.3);
        }
        .cta-primary:hover { transform: translateY(-5px); box-shadow: 0 20px 40px rgba(76, 175, 80, 0.5); }
        .cta-secondary {
          background: transparent; color: #4CAF50; border: 2px solid #4CAF50;
        }
        .cta-secondary:hover { background: #4CAF50; color: white; transform: translateY(-5px); }
        .services {
          padding: 8rem 2rem; background: linear-gradient(135deg, #1a1a1a 0%, #000000 100%);
        }
        .container { max-width: 1200px; margin: 0 auto; }
        .section-title {
          text-align: center; font-size: 3rem; font-weight: 800; margin-bottom: 4rem;
          background: linear-gradient(45deg, #4CAF50, #81C784);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          text-transform: uppercase; letter-spacing: 2px;
        }
        .services-grid {
          display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 3rem; margin-top: 4rem;
        }
        .service-card {
          background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(10px);
          border: 1px solid rgba(76, 175, 80, 0.2); border-radius: 20px;
          padding: 3rem 2rem; text-align: center; transition: all 0.4s ease;
        }
        .service-card:hover {
          transform: translateY(-15px); box-shadow: 0 25px 50px rgba(76, 175, 80, 0.3);
          border-color: rgba(76, 175, 80, 0.5);
        }
        .service-icon {
          font-size: 4rem; color: #4CAF50; margin-bottom: 2rem; display: block;
        }
        .service-title { font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem; color: #fff; }
        .service-description { color: #ccc; line-height: 1.6; }
        .stats {
          padding: 6rem 2rem; background: rgba(76, 175, 80, 0.1);
          border-top: 1px solid rgba(76, 175, 80, 0.3);
          border-bottom: 1px solid rgba(76, 175, 80, 0.3);
        }
        .stats-grid {
          display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 3rem; max-width: 1000px; margin: 0 auto;
        }
        .stat-item { text-align: center; }
        .stat-number {
          font-size: 3rem; font-weight: 900; color: #4CAF50;
          display: block; margin-bottom: 0.5rem;
        }
        .stat-label {
          font-size: 1.1rem; color: #ccc; text-transform: uppercase; letter-spacing: 1px;
        }
        .footer {
          background: rgba(0, 0, 0, 0.95); padding: 3rem 2rem 2rem;
          border-top: 1px solid rgba(76, 175, 80, 0.3);
        }
        .footer-content {
          max-width: 1200px; margin: 0 auto;
          display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 3rem;
        }
        .footer-section h3 { color: #4CAF50; margin-bottom: 1rem; }
        .footer-section p, .footer-section a {
          color: #ccc; text-decoration: none; line-height: 1.6;
        }
        .footer-section a:hover { color: #4CAF50; }
        .footer-bottom {
          text-align: center; margin-top: 2rem; padding-top: 2rem;
          border-top: 1px solid rgba(76, 175, 80, 0.2); color: #666;
        }
        @media (max-width: 768px) {
          .nav-links { display: none; }
          .hero-title { font-size: 2.5rem; }
          .services-grid { grid-template-columns: 1fr; }
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>
      
      <nav className="navbar">
        <div className="nav-container">
          <div className="logo">🚢 BongoPortus</div>
          <ul className="nav-links">
            <li><a href="#home">Home</a></li>
            <li><a href="#search">Product Search</a></li>
            <li><a href="#services">Services</a></li>
            <li><a href="#contact">Contact</a></li>
            <li><Link href="/auth" className="admin-btn">Login</Link></li>
          </ul>
        </div>
      </nav>

      <section className="hero" id="home">
        <div className="hero-content">
          <h1 className="hero-title">BongoPortus</h1>
          <p className="hero-subtitle">Global Shipping Excellence • Product Discovery • Connecting Continents</p>
          <div className="hero-buttons">
            <a href="#search" className="cta-button cta-primary">Search Products</a>
            <a href="#services" className="cta-button cta-secondary">Explore Services</a>
          </div>
        </div>
      </section>

      <section id="search" className="py-16 bg-gradient-to-br from-gray-900 to-black">
        <div className="container">
          <h2 className="section-title">Product Search</h2>
          <ProductSearch />
        </div>
      </section>

      <section className="services" id="services">
        <div className="container">
          <h2 className="section-title">Our Services</h2>
          <div className="services-grid">
            <div className="service-card">
              <i className="fas fa-ship service-icon"></i>
              <h3 className="service-title">Ocean Freight</h3>
              <p className="service-description">Reliable ocean shipping solutions for cargo of all sizes.</p>
            </div>
            <div className="service-card">
              <i className="fas fa-plane service-icon"></i>
              <h3 className="service-title">Air Freight</h3>
              <p className="service-description">Fast air cargo services for time-sensitive shipments.</p>
            </div>
            <div className="service-card">
              <i className="fas fa-truck service-icon"></i>
              <h3 className="service-title">Land Transport</h3>
              <p className="service-description">Ground transportation and logistics solutions.</p>
            </div>
            <div className="service-card">
              <i className="fas fa-warehouse service-icon"></i>
              <h3 className="service-title">Warehousing</h3>
              <p className="service-description">State-of-the-art storage facilities.</p>
            </div>
            <div className="service-card">
              <i className="fas fa-anchor service-icon"></i>
              <h3 className="service-title">Port Services</h3>
              <p className="service-description">Complete port handling services.</p>
            </div>
            <div className="service-card">
              <i className="fas fa-globe service-icon"></i>
              <h3 className="service-title">Global Logistics</h3>
              <p className="service-description">End-to-end logistics solutions.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="stats">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-number">50,000+</span>
              <span className="stat-label">Shipments Delivered</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">150+</span>
              <span className="stat-label">Countries Served</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">500+</span>
              <span className="stat-label">Partner Ports</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">99%</span>
              <span className="stat-label">On-Time Delivery</span>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>🚢 BongoPortus</h3>
            <p>Leading global shipping with innovative solutions and reliable service.</p>
          </div>
          <div className="footer-section">
            <h3>Contact</h3>
            <p><i className="fas fa-envelope"></i> info@bongoportus.com</p>
            <p><i className="fas fa-phone"></i> +880 123 456 789</p>
            <p><i className="fas fa-map-marker-alt"></i> Chittagong Port, Bangladesh</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 BongoPortus. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}