import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

const initialProducts = [
  {
    id: 'zoya-lehenga',
    name: 'The Zoya Lehenga',
    description: 'Deep Red Velvet with Heavy Antique Zardozi',
    details: 'A classic traditional piece, the Zoya Lehenga comes with heavy antique zardozi, dabka, and naqshi kaam on a rich red velvet stuff. It includes a fully loaded lehenga, a stitched choli, and a pure net dupatta with cutwork borders.',
    images: ["https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1200&auto=format&fit=crop", "https://images.unsplash.com/photo-1583391733958-d25e07fac044?q=80&w=1200&auto=format&fit=crop", "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1200&auto=format&fit=crop", "https://images.unsplash.com/photo-1585914924626-15adac1e6402?q=80&w=1200&auto=format&fit=crop"],
    tag: 'Order Only',
    buyPrice: '$4,500',
    rentPrice: '$650'
  },
  {
    id: 'opulent-gown',
    name: 'The Serene Aquamarine Gown',
    description: 'Heavy silver zari kaam on pure net fabric, complete with a long trail.',
    details: 'This beautiful Ferozi gown is fully loaded with silver threadwork, sequence, and pearl work. It features full sleeves, a classic round neck, and a huge flare that looks absolutely regal.',
    images: ["/products/product-one/Model_walking_in_202603270444.jpeg", "/products/product-one/Model_wearing_bridal_202603270444.jpeg", "/products/product-one/Model_wearing_gown_202603270444.jpeg", "/products/product-one/Bridal_gown_fabric_202603270444.jpeg"],
    tag: 'New Arrival',
    buyPrice: '$5,200',
    rentPrice: '$850'
  },
  {
    id: 'product-2',
    name: 'The Imperial Rose Gown',
    description: 'Hand-crafted rose pink gown with rich crystal embellishments.',
    details: 'A breathtaking imported net gown, fully laden with crystals, cut-dana, and sequins. Styled for Walima brides, it provides a majestic floor-sweeping volume.',
    images: ["/products/product-2/Model_walking_in_202603270502.jpeg", "/products/product-2/Model_wearing_dress_202603270502.jpeg", "/products/product-2/Model_wearing_gown_202603270502.jpeg", "/products/product-2/Model_wearing_Imperial_202603270502.jpeg", "/products/product-2/Gown_skirt_border_202603270502.jpeg"],
    tag: 'Walima Exclusive',
    buyPrice: '$4,800',
    rentPrice: '$750'
  },
  {
    id: 'product-3',
    name: 'The Velvet Midnight Pishwas',
    description: 'Regal navy blue pishwas with stunning heavy metallic dabka.',
    details: 'Step into the festive season with this navy blue velvet pishwas. Extravagantly adorned over the bodice and border lines. Accented with dull gold heavy dabka and kora.',
    images: ["/products/product-3/Model_walking_in_202603270502.jpeg", "/products/product-3/Model_wearing_dress_202603270502.jpeg", "/products/product-3/Model_wearing_gown_202603270502.jpeg", "/products/product-3/Model_wearing_Imperial_202603270502.jpeg", "/products/product-3/Gown_skirt_border_202603270502.jpeg"],
    tag: 'Trending',
    buyPrice: '$3,500',
    rentPrice: '$500'
  },
  {
    id: 'product-4',
    name: 'The Golden Heritage Lehenga',
    description: 'Gold tissue base fully handworked with classical zardozi styles.',
    details: 'A true heirloom. This barat jora reflects golden aesthetics heavily worked with traditional marori, tilla and farshi styling on pure tissue, promising a regal radiance.',
    images: ["/products/product-4/Model_wearing_dress_202603270509.jpeg", "/products/product-4/Model_smiling_in_202603270509.jpeg", "/products/product-4/Model_walking_in_202603270509.jpeg", "/products/product-4/Model_wearing_garment_202603270509.jpeg", "/products/product-4/Bridal_garment_fabric_202603270509.jpeg"],
    tag: 'Best Seller',
    buyPrice: '$6,500',
    rentPrice: '$950'
  },
  {
    id: 'product-5',
    name: 'The Embellished Ruby Gharara',
    description: 'Classic rich ruby gharara offering timeless cultural elegance.',
    details: 'Intricate chatta patti boundaries mixed with delicate kamdani all mapped onto pure rich ruby fabric. Complete with a heavy four-sided border dupatta.',
    images: ["/products/product-5/Model_wearing_dress_202603270515.jpeg", "/products/product-5/Model_smiling_in_202603270515.jpeg", "/products/product-5/Model_walking_in_202603270515.jpeg", "/products/product-5/Model_wearing_garment_202603270515.jpeg", "/products/product-5/Bridal_garment_fabric_202603270515.jpeg"],
    tag: 'Classic',
    buyPrice: '$3,800',
    rentPrice: '$600'
  },
  {
    id: 'product-6',
    name: 'The Pearl White Maxi',
    description: 'Exquisite ivory shade loaded with cut-dana and resham motifs.',
    details: 'A modern favorite for Nikkah brides. This ivory maxi boasts resham rosette motives, scattered swarovski, cut-dana details inside geometric net layouts.',
    images: ["/products/product-6/Model_wearing_dress_202603270631.jpeg", "/products/product-6/Model_smiling_in_202603270631.jpeg", "/products/product-6/Model_walking_in_202603270631.jpeg", "/products/product-6/Model_wearing_garment_202603270631.jpeg", "/products/product-6/Bridal_garment_fabric_202603270631.jpeg"],
    tag: 'Nikkah Edit',
    buyPrice: '$4,200',
    rentPrice: '$700'
  }
];

export const initDb = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Create admin table
      db.run(`CREATE TABLE IF NOT EXISTS admin (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT
      )`);

      // Default admin (password: password)
      db.run(`INSERT OR IGNORE INTO admin (id, username, password) VALUES (1, 'admin', 'password')`);

      // Create products table
      db.run(`CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        name TEXT,
        description TEXT,
        details TEXT,
        tag TEXT,
        buyPrice TEXT,
        rentPrice TEXT,
        images TEXT
      )`);

      // Seed products if empty
      db.get("SELECT COUNT(*) as count FROM products", (err, row) => {
        if (err) return reject(err);
        if (row.count === 0) {
          console.log("Seeding initial products from data...");
          const stmt = db.prepare("INSERT INTO products (id, name, description, details, tag, buyPrice, rentPrice, images) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
          initialProducts.forEach(p => {
             stmt.run(p.id, p.name, p.description, p.details, p.tag, p.buyPrice, p.rentPrice, JSON.stringify(p.images));
          });
          stmt.finalize();
          console.log("Seed complete.");
        }

        // Setup Homepage CMS Support
        db.run(`CREATE TABLE IF NOT EXISTS homepage (
          id INTEGER PRIMARY KEY,
          bannerImage TEXT,
          marqueeText TEXT
        )`, () => {
          db.get("SELECT COUNT(*) as count FROM homepage", (err, hRow) => {
            if (hRow && hRow.count === 0) {
              const defaultImage = "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=2000&auto=format&fit=crop";
              const defaultMarquee = "NEW ARRIVALS \u2022 THE ATELIER EDIT \u2022 BESPOKE BRIDAL";
              db.run("INSERT INTO homepage (id, bannerImage, marqueeText) VALUES (1, ?, ?)", [defaultImage, defaultMarquee]);
            }
            resolve();
          });
        });
      });
    });
  });
};

export const query = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

export const run = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
};

export const get = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

export default db;
