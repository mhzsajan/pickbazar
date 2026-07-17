const fs = require('fs');
const path = require('path');
const DB = path.join(process.cwd(), 'src/db/pickbazar');

function read(file) { return JSON.parse(fs.readFileSync(path.join(DB, file), 'utf8')); }
function write(file, data) { fs.writeFileSync(path.join(DB, file), JSON.stringify(data, null, 2)); }

// ============================================================
// SHOP TEMPLATE
// ============================================================
function makeShop(id, name, slug, description) {
  return {
    id, name, slug, description,
    cover_image: { id, original: '', thumbnail: '', file_name: '' },
    logo: { id, original: '', thumbnail: '', file_name: '' },
    is_active: true,
    address: { country: 'Nepal', city: 'Kathmandu', state: 'Bagmati', zip: '44600', street_address: '' },
    settings: {
      contact: '', website: 'https://switchgod.com.np',
      socials: [{ url: 'https://www.facebook.com/', icon: 'FacebookIcon' }],
      location: { lat: 27.7172, lng: 85.3240, city: 'Kathmandu', state: 'Bagmati', country: 'Nepal', formattedAddress: 'Kathmandu, Nepal' }
    },
    notifications: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    balance: {
      id, shop_id: id, admin_commission_rate: 0,
      total_earnings: 0, withdrawn_amount: 0, current_balance: 0,
      payment_info: { bank: '', name, email: `admin@switchgod.com.np`, account: 0 }
    }
  };
}

// ============================================================
// TYPE TEMPLATE
// ============================================================
function makeType(id, name, slug, icon, isHome) {
  return {
    id, name, language: 'en', translated_languages: ['en'], slug, icon,
    banners: [{
      id, title: name, type_id: id,
      description: `Shop ${name} products online`,
      image: { id, thumbnail: '', original: '' }
    }],
    promotional_sliders: [],
    settings: {
      isHome: !!isHome, layoutType: 'classic', productCard: 'helium',
      bestSelling: [], popularProducts: [], category: [],
      handpickedProducts: [], newArrival: [], authors: [], manufactures: []
    }
  };
}

// ============================================================
// CATEGORY TEMPLATE
// ============================================================
function makeCategory(id, name, slug, icon, typeId, parentId) {
  return {
    id, name, slug, icon: icon || 'FruitsVegetable',
    image: [], details: null, language: 'en', translated_languages: ['en'],
    parent: parentId || null, type_id: typeId,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null, parent_id: parentId || null,
    type: { id: typeId, name: '', language: 'en', slug: '', settings: { isHome: false, layoutType: 'classic', productCard: 'helium' } }
  };
}

// ============================================================
// 1. SHOPS
// ============================================================
const shops = read('shops.json');
const maxShopId = Math.max(...shops.map(s => s.id), 12);
let nextId = maxShopId + 1;

const newShops = [
  makeShop(nextId++, 'Auto Parts', 'auto-parts', 'Car parts, batteries, tires, engine oil, and automotive accessories'),
  makeShop(nextId++, 'Electronics', 'electronics', 'Laptops, phones, chargers, cameras, and smart devices'),
  makeShop(nextId++, 'Computer IT', 'computer-it', 'Monitors, keyboards, networking, storage, and IT peripherals'),
  makeShop(nextId++, 'Music', 'music', 'Guitars, headphones, speakers, DJ gear, and studio equipment'),
];

shops.push(...newShops);
write('shops.json', shops);
console.log(`Shops: created ${newShops.length} new shops (IDs: ${newShops.map(s => s.id).join(', ')})`);

// ============================================================
// 2. TYPES
// ============================================================
let typeId = 1;
const types = [
  makeType(typeId++, 'Auto Parts', 'auto-parts', 'FruitsVegetable', false),
  makeType(typeId++, 'Gaming', 'gaming', 'FruitsVegetable', true),  // set as homepage
  makeType(typeId++, 'Electronics', 'electronics', 'FruitsVegetable', false),
  makeType(typeId++, 'Computer IT', 'computer-it', 'FruitsVegetable', false),
  makeType(typeId++, 'Music', 'music', 'FruitsVegetable', false),
];
write('types.json', types);
console.log(`Types: created ${types.length}`);

// ============================================================
// 3. CATEGORIES
// ============================================================
let catId = 1;
const categories = [];

const typeMap = {};
types.forEach(t => { typeMap[t.slug] = t.id; });
const shopNames = { 'auto-parts': 'Auto Parts', 'gaming': 'Gaming', 'electronics': 'Electronics', 'computer-it': 'Computer IT', 'music': 'Music' };

const catDefs = {
  'auto-parts': ['Engine Parts', 'Brakes & Suspension', 'Electrical & Batteries', 'Tires & Wheels', 'Car Accessories', 'Oils & Fluids', 'Lighting', 'Tools & Equipment'],
  'gaming': ['Consoles', 'PC Gaming', 'Gaming Accessories', 'Video Games', 'VR & Simulation', 'Streaming Gear'],
  'electronics': ['Mobile Phones', 'Laptops & Computers', 'Audio & Headphones', 'Cameras', 'Smart Home', 'Wearables', 'Tablets & E-Readers'],
  'computer-it': ['Networking', 'Peripherals', 'Storage & Drives', 'Software', 'Cables & Adapters', 'UPS & Power', 'Office Supplies'],
  'music': ['Guitars & Bass', 'Headphones & Speakers', 'DJ Equipment', 'Studio Gear', 'Microphones', 'Music Accessories'],
};

for (const [typeSlug, cats] of Object.entries(catDefs)) {
  const typeId = typeMap[typeSlug];
  const typeName = shopNames[typeSlug];
  for (const catName of cats) {
    const catSlug = catName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const cat = makeCategory(catId++, catName, catSlug, 'FruitsVegetable', typeId, null);
    cat.type.name = typeName;
    cat.type.slug = typeSlug;
    categories.push(cat);
  }
}

write('categories.json', categories);
console.log(`Categories: created ${categories.length}`);

// ============================================================
// 4. SETTINGS — Set Gaming as homepage type
// ============================================================
const settings = read('settings.json');
if (settings?.options) {
  settings.options.isHome = 'gaming'; // deprecated but may be checked
}
write('settings.json', settings);

// ============================================================
// 5. TAXES — Create a default tax entry
// ============================================================
write('taxes.json', [{
  id: 1, name: 'VAT', rate: 13, type: 'percentage',
  is_active: true, language: 'en', translated_languages: ['en'],
  created_at: new Date().toISOString(), updated_at: new Date().toISOString()
}]);
console.log('Tax: created default VAT (13%)');

// ============================================================
// 6. SHIPPING — Create a default shipping entry
// ============================================================
write('shippings.json', [{
  id: 1, name: 'Standard Delivery', amount: 100,
  is_active: true, language: 'en', translated_languages: ['en'],
  type: 'fixed', created_at: new Date().toISOString(), updated_at: new Date().toISOString()
}]);
console.log('Shipping: created default (Rs. 100)');

console.log('\nDone! All departments set up.');
console.log('Next: copy to dist/db/, rebuild API, restart PM2');
