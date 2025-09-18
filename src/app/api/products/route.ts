import { NextRequest, NextResponse } from 'next/server';
import puppeteer, { Browser, Page } from 'puppeteer';
import * as cheerio from 'cheerio';
import type { Cheerio, CheerioAPI } from 'cheerio';

interface Product {
  title: string;
  price: string;
  image: string;
  rating: string;
  url: string;
}

// Cache for products (with query-specific caching)
const productCache = new Map();
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes cache

// Rate limiting to prevent abuse
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 10;

async function fetchWithHeaders(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Upgrade-Insecure-Requests': '1',
    },
  });
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`);
  return await res.text();
}

async function parseAmazonSearchCheerio(query: string, count: number): Promise<Product[]> {
  const searchUrl = `https://www.amazon.com/s?k=${encodeURIComponent(query)}&ref=nb_sb_noss`;
  const html = await fetchWithHeaders(searchUrl);
  const $: CheerioAPI = cheerio.load(html);
  const results: Product[] = [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  $('[data-component-type="s-search-result"]').each((_: number, el: any) => {
    if (results.length >= count) return false;

    const $el = $(el);
    const title = $el.find('h2 a span').first().text().trim();
    const linkPath = $el.find('h2 a').attr('href') || '';
    const url = linkPath ? (linkPath.startsWith('http') ? linkPath : `https://www.amazon.com${linkPath}`) : '#';
    const image = $el.find('img.s-image').attr('src') || $el.find('img').attr('src') || '';
    let price = $el.find('.a-price .a-offscreen').first().text().trim();
    if (!price) price = $el.find('.a-price-whole').first().text().trim();
    if (price && !price.includes('$')) price = `$${price}`;
    const ratingText = $el.find('.a-icon-alt').first().text().trim();
    const ratingMatch = ratingText.match(/[\d.]+/);
    const rating = ratingMatch ? ratingMatch[0] : '4.0';

    if (title && image && url && !url.includes('/gp/help/')) {
      results.push({
        title: title.length > 100 ? title.substring(0, 100) + '...' : title,
        price: price || 'Price not available',
        image,
        rating,
        url,
      });
    }
  });

  return results;
}

async function fetchAmazonBestSellers(count: number): Promise<Product[]> {
  // Amazon Best Sellers landing page
  const bestUrl = 'https://www.amazon.com/Best-Sellers/zgbs';
  const html = await fetchWithHeaders(bestUrl);
  const $: CheerioAPI = cheerio.load(html);
  const results: Product[] = [];

  // Try multiple patterns, stop when we collect enough
  const pushItem = (title?: string, url?: string, image?: string, price?: string, rating?: string) => {
    if (!title || !url || !image) return;
    results.push({
      title: title.length > 100 ? title.substring(0, 100) + '...' : title,
      url: url.startsWith('http') ? url : `https://www.amazon.com${url}`,
      image,
      price: price || 'Price not available',
      rating: rating || '4.0',
    });
  };

  // Pattern 1: faceout cards
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  $('.p13n-sc-uncoverable-faceout, .zg-grid-general-faceout, .zg-carousel-general-faceout').each((_: number, el: any) => {
    if (results.length >= count) return false;
    const $el = $(el);
    const a = $el.find('a.a-link-normal').first();
    const img = $el.find('img').first();
    const title = (img.attr('alt') || a.attr('title') || '').trim();
    const url = a.attr('href') || '';
    const image = img.attr('src') || '';
    const price = $el.find('.a-price .a-offscreen').first().text().trim();
    const ratingText = $el.find('.a-icon-alt').first().text().trim();
    const ratingMatch = ratingText.match(/[\d.]+/);
    const rating = ratingMatch ? ratingMatch[0] : '4.0';
    pushItem(title, url, image, price, rating);
  });

  // Pattern 2: generic anchor lists
  if (results.length < count) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  $('a.a-link-normal[href*="/dp/"]').each((_: number, el: any) => {
      if (results.length >= count) return false;
      const $a = $(el);
      const url = $a.attr('href') || '';
      const title = $a.attr('title') || $a.find('img').attr('alt') || '';
      const image = $a.find('img').attr('src') || '';
      pushItem(title?.trim(), url, image);
    });
  }

  return results;
}

class AmazonScraper {
  private browser: Browser | null = null;
  private page: Page | null = null;

  async init() {
    try {
      this.browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu',
          '--disable-features=VizDisplayCompositor',
          '--window-size=1920,1080'
        ]
      });
      this.page = await this.browser.newPage();
      
      // Enhanced user agent and headers to avoid detection
      await this.page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
      
      await this.page.setExtraHTTPHeaders({
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
      });

      await this.page.setViewport({ width: 1920, height: 1080 });
      
      console.log('Amazon Scraper initialized successfully');
      return true;
    } catch (error) {
      console.error('Failed to initialize Amazon Scraper:', error);
      return false;
    }
  }

  async searchProducts(query: string, count: number = 6) {
    try {
      // Create cache key specific to query and count
      const cacheKey = `${query.toLowerCase().trim()}_${count}`;
      
      // Check cache first
      if (productCache.has(cacheKey)) {
        const cached = productCache.get(cacheKey);
        if (Date.now() - cached.timestamp < CACHE_TTL) {
          console.log(`Cache hit for query: ${query}`);
          return cached.data;
        } else {
          productCache.delete(cacheKey);
        }
      }

      console.log(`Searching Amazon for: "${query}" (${count} items)`);

      // First try lightweight Cheerio scraping
      let products: Product[] = [];
      try {
        products = await parseAmazonSearchCheerio(query, count);
      } catch (err) {
        console.log('Cheerio search failed, will try Puppeteer fallback:', err);
      }

      // If too few results, fall back to Puppeteer
      if (!products || products.length < Math.min(3, count)) {
        if (!this.page || !this.browser) {
          const initialized = await this.init();
          if (!initialized) {
            throw new Error('Failed to initialize scraper');
          }
        }
        if (!this.page) throw new Error('Page not initialized');

        const searchUrl = `https://www.amazon.com/s?k=${encodeURIComponent(query)}&ref=sr_pg_1`;
        await this.page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: 30000 });
        try {
          await this.page.waitForSelector('[data-component-type="s-search-result"]', { timeout: 15000 });
        } catch {
          console.log('No search results found or timeout');
          return [];
        }
        await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 1000));

        const puppeteerProducts = await this.page.evaluate((count: number) => {
        const items = document.querySelectorAll('[data-component-type="s-search-result"]');
        const results: Array<{
          title: string;
          price: string;
          image: string;
          rating: string;
          url: string;
        }> = [];
        
        for (let i = 0; i < Math.min(items.length, count); i++) {
          const item = items[i];
          
          try {
            // Extract title - multiple selectors for better accuracy
            const titleSelectors = [
              'h2 a span',
              '.s-size-mini span',
              '[data-cy="title-recipe-title"]',
              'h2 span'
            ];
            
            let title = 'Product Title';
            for (const selector of titleSelectors) {
              const titleEl = item.querySelector(selector);
              if (titleEl?.textContent?.trim()) {
                title = titleEl.textContent.trim();
                break;
              }
            }
            
            // Extract price - multiple selectors
            const priceSelectors = [
              '.a-price-whole',
              '.a-price .a-offscreen',
              '.a-price-range',
              '.a-price'
            ];
            
            let price = 'Price not available';
            for (const selector of priceSelectors) {
              const priceEl = item.querySelector(selector);
              if (priceEl?.textContent?.trim()) {
                price = priceEl.textContent.trim();
                if (price && !price.includes('$') && !price.includes('Price')) {
                  price = '$' + price;
                }
                break;
              }
            }
            
            // Extract image
            const imgEl = item.querySelector('img.s-image') || item.querySelector('img');
            const image = imgEl?.getAttribute('src') || 
                         imgEl?.getAttribute('data-src') || 
                         imgEl?.getAttribute('srcset')?.split(' ')[0] ||
                         'https://via.placeholder.com/200x200?text=No+Image';
            
            // Extract rating
            const ratingSelectors = [
              '.a-icon-alt',
              '.a-star-mini .a-icon-alt',
              '[aria-label*="stars"]'
            ];
            
            let rating = '4.0';
            for (const selector of ratingSelectors) {
              const ratingEl = item.querySelector(selector);
              if (ratingEl?.textContent) {
                const ratingMatch = ratingEl.textContent.match(/[\d.]+/);
                if (ratingMatch) {
                  rating = ratingMatch[0];
                  break;
                }
              }
            }
            
            // Extract product URL
            const linkEl = item.querySelector('h2 a') || item.querySelector('a[href*="/dp/"]');
            const productUrl = linkEl ? 'https://amazon.com' + linkEl.getAttribute('href') : '#';
            
            if (title !== 'Product Title' && title.length > 5) {
              results.push({
                title: title.length > 100 ? title.substring(0, 100) + '...' : title,
                price,
                image: image.startsWith('//') ? 'https:' + image : image,
                rating,
                url: productUrl
              });
            }
          } catch (error) {
            console.log('Error extracting product data:', error);
          }
        }
        
          return results;
        }, count);

        products = puppeteerProducts as unknown as Product[];
      }

      // Validate products and filter out invalid ones
      const validProducts = products.filter((product: Product) => 
        product.title && 
        product.title !== 'Product Title' && 
        product.title.length > 3 &&
        product.image &&
        product.image !== 'https://via.placeholder.com/200x200?text=No+Image'
      );

      // Cache the results with query-specific key
      productCache.set(cacheKey, {
        data: validProducts,
        timestamp: Date.now()
      });

      console.log(`Found ${validProducts.length} valid products for query: "${query}"`);
      return validProducts;
      
    } catch (error) {
      console.error('Error scraping Amazon:', error);
      throw error;
    }
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.page = null;
    }
  }
}

// Create global scraper instance
let scraper: AmazonScraper | null = null;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || 'electronics';
    const count = Math.min(parseInt(searchParams.get('count') || '6'), 12); // Limit to 12 max
    const includeTrending = (searchParams.get('trending') || 'true') !== 'false';

    // Simple rate limiting
    const clientIP = request.headers.get('x-forwarded-for') || 'unknown';
    const now = Date.now();
    
    if (rateLimitMap.has(clientIP)) {
      const requests = rateLimitMap.get(clientIP);
      const recentRequests = requests.filter((time: number) => now - time < RATE_LIMIT_WINDOW);
      
      if (recentRequests.length >= MAX_REQUESTS_PER_WINDOW) {
        return NextResponse.json({
          success: false,
          error: 'Too many requests',
          message: 'Please wait before making more requests'
        }, { status: 429 });
      }
      
      recentRequests.push(now);
      rateLimitMap.set(clientIP, recentRequests);
    } else {
      rateLimitMap.set(clientIP, [now]);
    }

    if (!scraper) {
      scraper = new AmazonScraper();
    }

    // Fetch search products (cheerio + puppeteer fallback)
    const products = await scraper.searchProducts(category, count);

    // Fetch trending (best sellers) with caching
    let trending: Product[] = [];
    let topTrending: Product | null = null;
    if (includeTrending) {
      const trendingKey = `TRENDING_${count}`;
      if (productCache.has(trendingKey)) {
        const cached = productCache.get(trendingKey);
        if (Date.now() - cached.timestamp < CACHE_TTL) {
          trending = cached.data;
        } else {
          productCache.delete(trendingKey);
        }
      }
      if (trending.length === 0) {
        try {
          trending = await fetchAmazonBestSellers(Math.max(5, count));
          productCache.set(trendingKey, { data: trending, timestamp: Date.now() });
        } catch (err) {
          console.log('Failed to fetch best sellers:', err);
          trending = [];
        }
      }
      topTrending = trending[0] || null;
    }

    return NextResponse.json({
      success: true,
      products,
      trending,
      topTrending,
      count: products.length,
      query: category,
      cached: productCache.has(`${category.toLowerCase().trim()}_${count}`),
      timestamp: new Date().toISOString(),
    });
    
  } catch (error) {
    console.error('API Error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch products',
      message: (error as Error).message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

// Health check endpoint
export async function POST() {
  return NextResponse.json({
    status: 'healthy',
    service: 'Amazon Product Scraper API',
    timestamp: new Date().toISOString(),
    cacheSize: productCache.size
  });
}