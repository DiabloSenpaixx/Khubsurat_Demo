import express from 'express';
import cors from 'cors';
import multer from 'multer';
import jwt from 'jsonwebtoken';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { initDb, query, get, run } from './db.js';
import Admin from './models/Admin.js';
import CustomerRequest from './models/CustomerRequest.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'khubsurat_libas_secret_key_123';

app.use(cors());
app.use(express.json());

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure Multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'product-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Configure Multer for Customer AI Image Uploads
const customerUploadDir = path.join(__dirname, '../public/customer_uploads');
if (!fs.existsSync(customerUploadDir)) {
  fs.mkdirSync(customerUploadDir, { recursive: true });
}
const customerStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, customerUploadDir),
  filename: (req, file, cb) => cb(null, 'customer-' + Date.now() + path.extname(file.originalname))
});
const customerUpload = multer({ storage: customerStorage });

// Admin Authentication Route
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    // Authenticate using MongoDB instead of SQLite
    const admin = await Admin.findOne({ username });
    if (admin) {
      const isMatch = await bcrypt.compare(password, admin.password);
      if (isMatch) {
        const token = jwt.sign({ id: admin._id, username }, JWT_SECRET, { expiresIn: '24h' });
        return res.json({ success: true, token });
      }
    }
    
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Auth Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// --- Product Routes ---

// Get all products
app.get('/api/products', async (req, res) => {
  try {
    const products = await query("SELECT * FROM products");
    // Parse JSON images
    const parsedProducts = products.map(p => ({
      ...p,
      images: JSON.parse(p.images || '[]')
    }));
    // Return an array instead of object/record so it's easier to map
    res.json(parsedProducts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a new product
app.post('/api/products', authenticateToken, upload.array('images', 10), async (req, res) => {
  try {
    // req.body contains text fields, req.files contains uploaded images
    const { name, description, details, tag, buyPrice, rentPrice } = req.body;
    
    // Generate an ID (like a slug)
    const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    
    // Gather image paths
    const imagePaths = req.files.map(file => `/uploads/${file.filename}`);
    // Optional: combine with existing manually entered links if supported
    if (req.body.imageUrls) {
      const urls = JSON.parse(req.body.imageUrls);
      imagePaths.push(...urls);
    }

    await run(
      "INSERT INTO products (id, name, description, details, tag, buyPrice, rentPrice, images) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [id, name, description, details, tag, buyPrice, rentPrice, JSON.stringify(imagePaths)]
    );

    res.json({ success: true, id, message: 'Product added successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a product
app.put('/api/products/:id', authenticateToken, upload.array('newImages', 10), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, details, tag, buyPrice, rentPrice } = req.body;
    
    // Process existing images vs new images
    let existingImages = req.body.existingImages ? JSON.parse(req.body.existingImages) : [];
    const newImagePaths = req.files.map(file => `/uploads/${file.filename}`);
    
    const allImages = [...existingImages, ...newImagePaths];

    await run(
      "UPDATE products SET name = ?, description = ?, details = ?, tag = ?, buyPrice = ?, rentPrice = ?, images = ? WHERE id = ?",
      [name, description, details, tag, buyPrice, rentPrice, JSON.stringify(allImages), id]
    );

    res.json({ success: true, message: 'Product updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a product
app.delete('/api/products/:id', authenticateToken, async (req, res) => {
  try {
    await run("DELETE FROM products WHERE id = ?", [req.params.id]);
    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- Homepage Routes ---

app.get('/api/homepage', async (req, res) => {
  try {
    const data = await get("SELECT * FROM homepage WHERE id = 1");
    res.json(data || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/homepage', authenticateToken, upload.single('bannerImage'), async (req, res) => {
  try {
    const { marqueeText } = req.body;
    let updateQuery = "UPDATE homepage SET marqueeText = ? WHERE id = 1";
    let params = [marqueeText];

    if (req.file) {
      updateQuery = "UPDATE homepage SET marqueeText = ?, bannerImage = ? WHERE id = 1";
      params = [marqueeText, `/uploads/${req.file.filename}`];
    } else if (req.body.bannerImage) {
      updateQuery = "UPDATE homepage SET marqueeText = ?, bannerImage = ? WHERE id = 1";
      params = [marqueeText, req.body.bannerImage];
    }

    await run(updateQuery, params);
    res.json({ success: true, message: 'Homepage updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Customer Request Routes ---
app.post('/api/customers/request', customerUpload.single('image'), async (req, res) => {
  try {
    const { name, contactInfo, desiredDressDescription } = req.body;
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Image is required' });
    }
    
    // Create customer request in MongoDB
    const imageLocalPath = `/customer_uploads/${req.file.filename}`;
    const newRequest = await CustomerRequest.create({
      name,
      contactInfo,
      desiredDressDescription,
      imageLocalPath
    });

    res.json({ success: true, message: 'Request submitted successfully', request: newRequest });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/customers', authenticateToken, async (req, res) => {
  try {
    const customers = await CustomerRequest.find().sort({ createdAt: -1 });
    res.json(customers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Initialize Database (SQLite) and connect to MongoDB
initDb().then(async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/khubsurat';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Seed dummy admin if none exists
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      const hashedPassword = await bcrypt.hash('password', 10);
      await Admin.create({ username: 'admin', password: hashedPassword });
      console.log('Dummy admin seeded into MongoDB: admin / password');
    }
  } catch (err) {
    console.error('Failed to connect to MongoDB. Auth and Customer DB will not work until fixed:', err.message);
  } finally {
    // ALWAYS start the Express server so SQLite products and homepage load regardless of MongoDB status
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  }
}).catch(err => {
  console.error('Failed to initialize SQLite database:', err);
});
