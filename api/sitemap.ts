
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Client for Node.js environment (Vercel API)
// Using standard process.env which Vercel populates
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

const BASE_URL = 'https://amarthrift.com';

const CATEGORIES = [
  't-shirt',
  'shirt',
  'hoodie',
  'jacket',
  'pants',
  'sweater',
  'accessories'
];

export default async function handler(req: any, res: any) {
  try {
    // 1. Fetch all published products
    // We select id and created_at/updated_at. 
    // Assuming 'created_at' is the timestamp available as per existing code.
    // If 'updated_at' exists in DB, it will be used, otherwise fall back to created_at.
    const { data: products, error } = await supabase
      .from('products')
      .select('id, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Sitemap Error:', error);
      throw error;
    }

    // 2. Build XML
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

    // Static Pages
    const staticPages = [
      { url: '/', priority: '1.0', changefreq: 'daily' },
      { url: '/shop', priority: '0.9', changefreq: 'daily' },
      { url: '/reviews', priority: '0.8', changefreq: 'weekly' },
      { url: '/track-order', priority: '0.5', changefreq: 'monthly' },
      { url: '/login', priority: '0.4', changefreq: 'monthly' }
    ];

    staticPages.forEach(page => {
      xml += `  <url>
    <loc>${BASE_URL}${page.url}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
    });

    // Category Pages
    CATEGORIES.forEach(cat => {
      xml += `  <url>
    <loc>${BASE_URL}/category/${cat}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;
    });

    // Product Pages
    products?.forEach((product: any) => {
      // Use created_at as lastmod since updated_at might not exist in provided schema
      // Format date to ISO YYYY-MM-DD
      const lastMod = new Date(product.updated_at || product.created_at).toISOString().split('T')[0];
      
      xml += `  <url>
    <loc>${BASE_URL}/product/${product.id}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
`;
    });

    xml += `</urlset>`;

    // 3. Send Response
    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=59'); // Cache for 1 hour
    res.status(200).send(xml);

  } catch (e) {
    console.error(e);
    res.status(500).send('Error generating sitemap');
  }
}
