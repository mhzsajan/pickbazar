const fs = require('fs');
const path = require('path');

const DB = path.join(process.cwd(), 'src/db/pickbazar');
const KEEP_SHOP_ID = 12; // Gaming

function read(file) {
  return JSON.parse(fs.readFileSync(path.join(DB, file), 'utf8'));
}
function write(file, data) {
  fs.writeFileSync(path.join(DB, file), JSON.stringify(data, null, 2));
}

// 1. Products — keep only those belonging to Gaming shop
const products = read('products.json');
const keepProducts = products.filter(p => p.shop?.id === KEEP_SHOP_ID);
console.log(`Products: ${products.length} → ${keepProducts.length} (removed ${products.length - keepProducts.length})`);
write('products.json', keepProducts);

// 2. Shops — keep only Gaming
const shops = read('shops.json');
const keepShop = shops.filter(s => s.id === KEEP_SHOP_ID);
console.log(`Shops: ${shops.length} → ${keepShop.length}`);
write('shops.json', keepShop);

// 3. Types — delete all (will recreate)
console.log(`Types: ${read('types.json').length} → 0`);
write('types.json', []);

// 4. Categories — delete all (will recreate)
console.log(`Categories: ${read('categories.json').length} → 0`);
write('categories.json', []);

// 5. Clean related data that references deleted entities
const empties = [
  'attributes.json', 'authors.json', 'become-seller.json',
  'best-selling-products.json', 'category-wise-product.json',
  'conversations.json', 'coupons.json', 'faqs.json',
  'flash-sale.json', 'low-stock-products.json', 'manufacturers.json',
  'messages.json', 'near-shop.json', 'order-export.json',
  'order-files.json', 'order-invoice.json', 'orders.json',
  'order-statuses.json', 'ownership-transfer.json',
  'payment-gateway.json', 'payment-intent.json', 'payment-methods.json',
  'popular-products.json', 'products-by-flash-sale.json',
  'products-stock.json', 'questions.json', 'refund-policies.json',
  'refund-reasons.json', 'reports.json', 'reviews.json',
  'shippings.json', 'store-notices.json', 'tags.json',
  'taxes.json', 'terms-and-conditions.json',
  'top-rate-product.json', 'wishlists.json', 'withdraws.json',
];
for (const f of empties) {
  const before = read(f).length;
  write(f, []);
  console.log(`${f}: ${before} → 0`);
}

// 6. Analytics — reset
write('analytics.json', { totalOrders: 0, totalRevenue: 0, totalShops: 1, totalProducts: keepProducts.length, totalCategories: 0, totalAuthors: 0, totalManufacturers: 0, totalCoupons: 0, totalTaxes: 0, totalWithdraws: 0, totalRefunds: 0, totalReviews: 0, totalQuestions: 0, totalWishlists: 0, totalMessages: 0, totalFlashSale: 0, totalStoreNotices: 0, totalConversations: 0, totalFaqs: 0, totalTermsAndConditions: 0 });

// 7. Settings — keep as-is (currency etc)
console.log('\nDone! API rebuild + restart required.');
