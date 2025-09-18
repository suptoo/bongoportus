'use client';
import { useState } from 'react';
import Image from 'next/image';

interface Product {
  title: string;
  price: string;
  image: string;
  rating: string;
  url: string;
}

export default function ProductSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const searchProducts = async () => {
    if (!searchQuery.trim()) {
      setError('Please enter a search term');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`/api/products?category=${encodeURIComponent(searchQuery)}&count=6`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      
      const data = await response.json();
      setProducts(data.products || []);
    } catch (err) {
      setError('Failed to search products. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      searchProducts();
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <style jsx>{`
        .search-container {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(76, 175, 80, 0.3);
          border-radius: 20px;
          padding: 2rem;
          margin-bottom: 2rem;
        }
        .search-input {
          width: 100%;
          padding: 1rem 1.5rem;
          font-size: 1.1rem;
          border: 2px solid rgba(76, 175, 80, 0.3);
          border-radius: 50px;
          background: rgba(0, 0, 0, 0.7);
          color: white;
          margin-bottom: 1rem;
          transition: all 0.3s ease;
        }
        .search-input:focus {
          outline: none;
          border-color: #4CAF50;
          box-shadow: 0 0 20px rgba(76, 175, 80, 0.3);
        }
        .search-btn {
          background: linear-gradient(45deg, #4CAF50, #81C784);
          color: white;
          border: none;
          padding: 1rem 2rem;
          border-radius: 50px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .search-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 25px rgba(76, 175, 80, 0.4);
        }
        .search-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }
        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin-top: 2rem;
        }
        .product-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(15px);
          border: 1px solid rgba(76, 175, 80, 0.2);
          border-radius: 15px;
          padding: 1.5rem;
          transition: all 0.4s ease;
        }
        .product-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(76, 175, 80, 0.2);
          border-color: rgba(76, 175, 80, 0.5);
        }
        .product-image {
          width: 100%;
          height: 200px;
          object-fit: contain;
          border-radius: 10px;
          margin-bottom: 1rem;
          background: rgba(255, 255, 255, 0.1);
        }
        .product-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: #fff;
          margin-bottom: 0.5rem;
          line-height: 1.4;
          height: 2.8rem;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        .product-price {
          font-size: 1.3rem;
          font-weight: 700;
          color: #4CAF50;
          margin-bottom: 0.5rem;
        }
        .product-rating {
          color: #FFD700;
          margin-bottom: 1rem;
        }
        .view-btn {
          background: linear-gradient(45deg, #4CAF50, #81C784);
          color: white;
          border: none;
          padding: 0.7rem 1.5rem;
          border-radius: 25px;
          font-weight: 600;
          cursor: pointer;
          width: 100%;
          transition: all 0.3s ease;
        }
        .view-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(76, 175, 80, 0.4);
        }
        .loading-spinner {
          display: inline-block;
          width: 20px;
          height: 20px;
          border: 3px solid rgba(255,255,255,.3);
          border-radius: 50%;
          border-top-color: #fff;
          animation: spin 1s ease-in-out infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .error-message {
          background: rgba(244, 67, 54, 0.1);
          border: 1px solid rgba(244, 67, 54, 0.3);
          color: #ff6b6b;
          padding: 1rem;
          border-radius: 10px;
          margin-top: 1rem;
        }
      `}</style>

      <div className="search-container">
        <div className="flex gap-3 flex-col sm:flex-row">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search for products (e.g., iPhone, Sony, Samsung)..."
            className="search-input flex-1"
          />
          <button
            onClick={searchProducts}
            disabled={loading}
            className="search-btn"
          >
            {loading ? (
              <>
                <span className="loading-spinner"></span>
                <span className="ml-2">Searching...</span>
              </>
            ) : (
              '🔍 Search Amazon'
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <strong>Error:</strong> {error}
        </div>
      )}

      {products.length > 0 && (
        <div className="products-grid">
          {products.map((product, index) => (
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
              <h3 className="product-title">{product.title}</h3>
              <div className="product-price">{product.price}</div>
              <div className="product-rating">⭐ {product.rating}</div>
              <button
                onClick={() => window.open(product.url, '_blank')}
                className="view-btn"
              >
                View on Amazon
              </button>
            </div>
          ))}
        </div>
      )}

      {loading && (
        <div className="text-center py-8">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-400">Searching Amazon for products...</p>
        </div>
      )}
    </div>
  );
}