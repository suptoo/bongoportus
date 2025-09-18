'use client';
import { useState } from 'react';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function ContactSection() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      setError('Please fill in all required fields');
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
          customerName: formData.name,
          customerEmail: formData.email,
          subject: formData.subject || 'Contact Form Submission',
          message: formData.message,
          type: 'new'
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSuccess(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setError(result.error || 'Failed to send message');
      }
    } catch (err) {
      setError('Failed to send message. Please try again.');
      console.error('Contact form error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
    setSuccess(false);
  };

  return (
    <section id="contact" className="contact-section">
      <style jsx>{`
        .contact-section {
          padding: 4rem 2rem;
          background: linear-gradient(135deg, #0f0f23 0%, #161632 50%, #1e1e3c 100%);
          position: relative;
          overflow: hidden;
        }
        
        .contact-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at 70% 30%, rgba(76, 175, 80, 0.1) 0%, transparent 50%);
          z-index: 1;
        }
        
        .contact-container {
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
        }
        
        .contact-title {
          text-align: center;
          font-size: 3rem;
          font-weight: 800;
          margin-bottom: 1rem;
          background: linear-gradient(45deg, #4CAF50, #81C784);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-transform: uppercase;
          letter-spacing: 2px;
        }
        
        .contact-subtitle {
          text-align: center;
          font-size: 1.2rem;
          color: #ccc;
          margin-bottom: 4rem;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }
        
        .contact-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: start;
        }
        
        .contact-info {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(76, 175, 80, 0.2);
          border-radius: 20px;
          padding: 3rem;
        }
        
        .contact-form {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(76, 175, 80, 0.2);
          border-radius: 20px;
          padding: 3rem;
        }
        
        .contact-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2rem;
          padding: 1.5rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 15px;
          transition: all 0.3s ease;
        }
        
        .contact-item:hover {
          background: rgba(76, 175, 80, 0.1);
          transform: translateY(-2px);
        }
        
        .contact-icon {
          font-size: 2rem;
          color: #4CAF50;
          width: 60px;
          text-align: center;
        }
        
        .contact-details h4 {
          color: #fff;
          font-size: 1.2rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }
        
        .contact-details p {
          color: #ccc;
          font-size: 1rem;
        }
        
        .form-group {
          margin-bottom: 1.5rem;
        }
        
        .form-label {
          display: block;
          margin-bottom: 0.5rem;
          color: #4CAF50;
          font-weight: 600;
          font-size: 1rem;
        }
        
        .form-input {
          width: 100%;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid rgba(76, 175, 80, 0.3);
          border-radius: 10px;
          color: #fff;
          font-size: 1rem;
          transition: all 0.3s ease;
        }
        
        .form-input:focus {
          outline: none;
          border-color: #4CAF50;
          box-shadow: 0 0 20px rgba(76, 175, 80, 0.3);
          background: rgba(255, 255, 255, 0.1);
        }
        
        .form-input::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }
        
        .form-textarea {
          min-height: 120px;
          resize: vertical;
        }
        
        .submit-btn {
          background: linear-gradient(45deg, #4CAF50, #81C784);
          color: white;
          border: none;
          padding: 1rem 2rem;
          border-radius: 50px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          width: 100%;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        
        .submit-btn:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: 0 10px 25px rgba(76, 175, 80, 0.4);
        }
        
        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }
        
        .success-message {
          background: rgba(76, 175, 80, 0.1);
          border: 1px solid rgba(76, 175, 80, 0.3);
          color: #4CAF50;
          padding: 1rem;
          border-radius: 10px;
          margin-bottom: 1rem;
          text-align: center;
          font-weight: 600;
        }
        
        .error-message {
          background: rgba(244, 67, 54, 0.1);
          border: 1px solid rgba(244, 67, 54, 0.3);
          color: #ff6b6b;
          padding: 1rem;
          border-radius: 10px;
          margin-bottom: 1rem;
          text-align: center;
          font-weight: 600;
        }
        
        .loading-spinner {
          display: inline-block;
          width: 20px;
          height: 20px;
          border: 3px solid rgba(255,255,255,.3);
          border-radius: 50%;
          border-top-color: #fff;
          animation: spin 1s ease-in-out infinite;
          margin-right: 0.5rem;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        /* Mobile Responsive Design */
        @media (max-width: 968px) {
          .contact-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          
          .contact-title {
            font-size: 2.5rem;
          }
          
          .contact-info,
          .contact-form {
            padding: 2rem;
          }
        }
        
        @media (max-width: 768px) {
          .contact-section {
            padding: 3rem 1rem;
          }
          
          .contact-title {
            font-size: 2rem;
          }
          
          .contact-subtitle {
            font-size: 1rem;
            margin-bottom: 3rem;
          }
          
          .contact-info,
          .contact-form {
            padding: 1.5rem;
          }
          
          .contact-item {
            padding: 1rem;
            margin-bottom: 1rem;
          }
          
          .contact-icon {
            font-size: 1.5rem;
            width: 50px;
          }
          
          .contact-details h4 {
            font-size: 1rem;
          }
          
          .contact-details p {
            font-size: 0.9rem;
          }
          
          .form-input {
            padding: 0.8rem;
            font-size: 0.9rem;
          }
          
          .submit-btn {
            padding: 0.8rem 1.5rem;
            font-size: 1rem;
          }
        }
        
        @media (max-width: 480px) {
          .contact-section {
            padding: 2rem 0.5rem;
          }
          
          .contact-title {
            font-size: 1.8rem;
          }
          
          .contact-info,
          .contact-form {
            padding: 1rem;
          }
          
          .contact-item {
            flex-direction: column;
            text-align: center;
            gap: 0.5rem;
          }
          
          .contact-icon {
            width: auto;
          }
        }
        
        /* Touch improvements for mobile */
        @media (hover: none) and (pointer: coarse) {
          .contact-item:hover,
          .submit-btn:hover {
            transform: none;
          }
          
          .form-input,
          .submit-btn {
            min-height: 44px;
          }
        }
      `}</style>
      
      <div className="contact-container">
        <h2 className="contact-title">Get In Touch</h2>
        <p className="contact-subtitle">
          Have questions about our services? Need support? We&apos;re here to help you with all your shipping and logistics needs.
        </p>
        
        <div className="contact-grid">
          {/* Contact Information */}
          <div className="contact-info">
            <h3 style={{ color: '#fff', fontSize: '1.8rem', marginBottom: '2rem', textAlign: 'center' }}>
              Contact Information
            </h3>
            
            <div className="contact-item">
              <i className="fas fa-envelope contact-icon"></i>
              <div className="contact-details">
                <h4>Email Us</h4>
                <p>info@bongoportus.com</p>
                <p>support@bongoportus.com</p>
              </div>
            </div>
            
            <div className="contact-item">
              <i className="fas fa-phone contact-icon"></i>
              <div className="contact-details">
                <h4>Call Us</h4>
                <p>+880 123 456 789</p>
                <p>24/7 Customer Support</p>
              </div>
            </div>
            
            <div className="contact-item">
              <i className="fas fa-map-marker-alt contact-icon"></i>
              <div className="contact-details">
                <h4>Visit Us</h4>
                <p>Chittagong Port Authority</p>
                <p>Chittagong, Bangladesh</p>
              </div>
            </div>
            
            <div className="contact-item">
              <i className="fas fa-clock contact-icon"></i>
              <div className="contact-details">
                <h4>Business Hours</h4>
                <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                <p>Saturday: 9:00 AM - 2:00 PM</p>
              </div>
            </div>
          </div>
          
          {/* Contact Form */}
          <div className="contact-form">
            <h3 style={{ color: '#fff', fontSize: '1.8rem', marginBottom: '2rem', textAlign: 'center' }}>
              Send us a Message
            </h3>
            
            {success && (
              <div className="success-message">
                <i className="fas fa-check-circle" style={{ marginRight: '0.5rem' }}></i>
                Your message has been sent successfully! We&apos;ll get back to you soon.
              </div>
            )}
            
            {error && (
              <div className="error-message">
                <i className="fas fa-exclamation-circle" style={{ marginRight: '0.5rem' }}></i>
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className="form-input"
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email address"
                  className="form-input"
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="What is this about?"
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Message *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Tell us how we can help you..."
                  className="form-input form-textarea"
                  required
                ></textarea>
              </div>
              
              <button type="submit" disabled={loading} className="submit-btn">
                {loading && <span className="loading-spinner"></span>}
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}