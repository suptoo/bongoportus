// Mobile Navigation
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth scrolling
function scrollToSection(sectionId) {
    document.getElementById(sectionId).scrollIntoView({
        behavior: 'smooth'
    });
}

// Pricing calculator
const pricingRates = {
    electronics: {
        air: { base: 8, perKg: 12, customs: 0.15, delivery: '3-7 days' },
        sea: { base: 15, perKg: 3, customs: 0.15, delivery: '15-25 days' }
    },
    textiles: {
        air: { base: 6, perKg: 8, customs: 0.12, delivery: '3-7 days' },
        sea: { base: 12, perKg: 2, customs: 0.12, delivery: '15-25 days' }
    },
    machinery: {
        sea: { base: 25, perKg: 4, customs: 0.18, delivery: '20-30 days' }
    },
    home: {
        air: { base: 10, perKg: 15, customs: 0.14, delivery: '3-7 days' },
        sea: { base: 18, perKg: 3.5, customs: 0.14, delivery: '15-25 days' }
    },
    automotive: {
        air: { base: 12, perKg: 18, customs: 0.16, delivery: '3-7 days' },
        sea: { base: 20, perKg: 4.5, customs: 0.16, delivery: '18-28 days' }
    },
    beauty: {
        air: { base: 7, perKg: 10, customs: 0.13, delivery: '3-7 days' },
        sea: { base: 14, perKg: 2.5, customs: 0.13, delivery: '15-25 days' }
    }
};

// Update shipping method options based on product category
document.getElementById('productCategory').addEventListener('change', function() {
    const category = this.value;
    const shippingSelect = document.getElementById('shippingMethod');
    
    // Clear existing options
    shippingSelect.innerHTML = '<option value="">Select Method</option>';
    
    if (category && pricingRates[category]) {
        const availableMethods = Object.keys(pricingRates[category]);
        
        availableMethods.forEach(method => {
            const option = document.createElement('option');
            option.value = method;
            option.textContent = method === 'air' ? 'Air Freight' : 'Sea Freight';
            shippingSelect.appendChild(option);
        });
    }
});

// Quote form submission
document.getElementById('quoteForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const category = document.getElementById('productCategory').value;
    const method = document.getElementById('shippingMethod').value;
    const weight = parseFloat(document.getElementById('weight').value);
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    
    if (!category || !method || !weight || !name || !phone || !email) {
        alert('Please fill in all required fields');
        return;
    }
    
    // Check if the selected method is available for the category
    if (!pricingRates[category] || !pricingRates[category][method]) {
        alert('Selected shipping method is not available for this product category');
        return;
    }
    
    const rates = pricingRates[category][method];
    
    // Calculate costs
    const shippingCost = rates.base + (weight * rates.perKg);
    const customsCost = shippingCost * rates.customs;
    const serviceFee = 25; // Fixed service fee
    const totalCost = shippingCost + customsCost + serviceFee;
    
    // Display results
    document.getElementById('shippingCost').textContent = `$${shippingCost.toFixed(2)}`;
    document.getElementById('customsCost').textContent = `$${customsCost.toFixed(2)}`;
    document.getElementById('serviceFee').textContent = `$${serviceFee.toFixed(2)}`;
    document.getElementById('totalCost').textContent = `$${totalCost.toFixed(2)}`;
    document.getElementById('deliveryTime').textContent = rates.delivery;
    
    // Show result
    document.getElementById('quoteResult').style.display = 'block';
    document.getElementById('quoteResult').scrollIntoView({ behavior: 'smooth' });
    
    // Store quote data for contact
    window.currentQuote = {
        category,
        method,
        weight,
        totalCost: totalCost.toFixed(2),
        deliveryTime: rates.delivery,
        customerName: name,
        customerPhone: phone,
        customerEmail: email
    };
});

// Contact us function
function contactUs() {
    if (window.currentQuote) {
        const message = `Hello! I'm interested in importing ${window.currentQuote.category} products using ${window.currentQuote.method} freight. 
        
Quote Details:
- Weight: ${window.currentQuote.weight}kg
- Total Cost: $${window.currentQuote.totalCost}
- Delivery Time: ${window.currentQuote.deliveryTime}
        
Please contact me to proceed with this shipment.

Best regards,
${window.currentQuote.customerName}
Phone: ${window.currentQuote.customerPhone}
Email: ${window.currentQuote.customerEmail}`;
        
        // You can integrate with email service or WhatsApp here
        const whatsappUrl = `https://wa.me/8801234567890?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    } else {
        scrollToSection('contact');
    }
}

// Contact form submission
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const name = this.querySelector('input[type="text"]').value;
    const email = this.querySelector('input[type="email"]').value;
    const phone = this.querySelector('input[type="tel"]').value;
    const message = this.querySelector('textarea').value;
    
    // Here you would typically send the data to your server
    alert(`Thank you ${name}! Your message has been sent. We'll contact you soon.`);
    this.reset();
});

// Product card interactions
document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', function() {
        const category = this.dataset.category;
        document.getElementById('productCategory').value = category;
        
        // Trigger change event to update shipping methods
        document.getElementById('productCategory').dispatchEvent(new Event('change'));
        
        scrollToSection('pricing');
    });
});

// Navbar scroll effect
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
    } else {
        header.style.background = '#fff';
        header.style.backdropFilter = 'none';
    }
});

// Animate elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all cards and sections
document.querySelectorAll('.service-card, .product-card, .quote-form').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer if needed
    const currentYear = new Date().getFullYear();
    const footerText = document.querySelector('.footer-bottom p');
    if (footerText) {
        footerText.textContent = footerText.textContent.replace('2024', currentYear);
    }
});
