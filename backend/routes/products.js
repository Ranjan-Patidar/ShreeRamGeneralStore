// ==============================
// routes/products.js
// Handles all product-related API endpoints
// GET all products, GET single product, seed sample data
// ==============================

const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// ==============================
// GET /api/products
// Returns all products
// Optional query: ?category=Footwear
// Optional query: ?search=pen
// ==============================
router.get("/", async (req, res) => {
  try {
    const { category, search } = req.query;

    // Build filter object based on query params
    let filter = {};

    // Filter by category if provided
    if (category && category !== "All") {
      filter.category = category;
    }

    // Search by name if search query is provided
    if (search) {
      // 'i' flag means case-insensitive search
      filter.name = { $regex: search, $options: "i" };
    }

    // Find products matching the filter, sorted by newest first
    const products = await Product.find(filter).sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    console.error("Get products error:", error.message);
    res.status(500).json({ message: "Error fetching products" });
  }
});

// ==============================
// GET /api/products/featured
// Returns only featured products (for homepage)
// ==============================
router.get("/featured", async (req, res) => {
  try {
    const products = await Product.find({ featured: true }).limit(8);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching featured products" });
  }
});

// ==============================
// GET /api/products/new-arrivals
// Returns only new arrival products
// ==============================
router.get("/new-arrivals", async (req, res) => {
  try {
    const products = await Product.find({ isNewArrival: true }).sort({ createdAt: -1 }).limit(8);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching new arrival products" });
  }
});

// ==============================
// GET /api/products/:id
// Returns a single product by its ID
// ==============================
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error("Get product by ID error:", error.message);
    res.status(500).json({ message: "Error fetching product" });
  }
});

// ==============================
// POST /api/products/seed
// Seeds the database with sample products
// Run this once to populate your store with products
// WARNING: This will delete existing products and re-add them
// ==============================
router.post("/seed", async (req, res) => {
  try {
    // Sample products across all 8 categories
    const sampleProducts = [
      // ========== FOOTWEAR ==========
      {
        name: "Classic Rubber Slippers",
        category: "Footwear",
        price: 149,
        originalPrice: 250,
        description: "Comfortable rubber slippers perfect for daily wear at home or outdoors. Non-slip sole.",
        emoji: "🩴",
        brand: "Relaxo",
        stock: 150,
        rating: 4.2,
        numReviews: 320,
        featured: true,
        cardColor: "#1a0533",
      },
      {
        name: "Men's Sports Shoes",
        category: "Footwear",
        price: 599,
        originalPrice: 999,
        description: "Lightweight sports shoes with cushioned sole. Great for walking and gym workouts.",
        emoji: "👟",
        brand: "Sparx",
        stock: 80,
        rating: 4.4,
        numReviews: 180,
        featured: true,
        cardColor: "#0d1f3c",
      },
      {
        name: "Ladies Flat Sandals",
        category: "Footwear",
        price: 299,
        originalPrice: 499,
        description: "Stylish flat sandals for women. Comfortable straps with soft footbed.",
        emoji: "👡",
        brand: "Bata",
        stock: 120,
        rating: 4.1,
        numReviews: 95,
        featured: false,
        cardColor: "#1a0533",
      },
      {
        name: "Kids School Shoes",
        category: "Footwear",
        price: 399,
        originalPrice: 650,
        description: "Durable and comfortable school shoes for children. Black color with velcro strap.",
        emoji: "👞",
        brand: "Liberty",
        stock: 60,
        rating: 4.3,
        numReviews: 210,
        featured: false,
        cardColor: "#0d1f3c",
      },
      {
        name: "Hawai Chappal",
        category: "Footwear",
        price: 89,
        originalPrice: 120,
        description: "Traditional Hawai chappals. Extremely durable and affordable.",
        emoji: "🩴",
        brand: "VKC",
        stock: 200,
        rating: 4.0,
        numReviews: 450,
        featured: false,
        cardColor: "#1a0533",
      },

      // ========== STATIONERY ==========
      {
        name: "Blue Ballpoint Pen (10 Pack)",
        category: "Stationery",
        price: 49,
        originalPrice: 80,
        description: "Pack of 10 smooth-writing ballpoint pens. Blue ink, medium tip.",
        emoji: "🖊️",
        brand: "Reynolds",
        stock: 500,
        rating: 4.5,
        numReviews: 890,
        featured: true,
        cardColor: "#001a33",
      },
      {
        name: "A4 Ruled Notebook (200 Pages)",
        category: "Stationery",
        price: 75,
        originalPrice: 120,
        description: "200 page ruled notebook. Thick pages that don't bleed through. Perfect for school.",
        emoji: "📓",
        brand: "Classmate",
        stock: 300,
        rating: 4.3,
        numReviews: 560,
        featured: true,
        cardColor: "#001a33",
      },
      {
        name: "Geometry Box Set",
        category: "Stationery",
        price: 120,
        originalPrice: 180,
        description: "Complete geometry box with compass, protractor, set squares, ruler and divider.",
        emoji: "📐",
        brand: "Camlin",
        stock: 150,
        rating: 4.4,
        numReviews: 230,
        featured: false,
        cardColor: "#001a33",
      },
      {
        name: "HB Pencils (12 Pack)",
        category: "Stationery",
        price: 35,
        originalPrice: 60,
        description: "Pack of 12 HB pencils. Smooth graphite, break-resistant lead.",
        emoji: "✏️",
        brand: "Apsara",
        stock: 600,
        rating: 4.6,
        numReviews: 1200,
        featured: false,
        cardColor: "#001a33",
      },
      {
        name: "Whiteboard Marker Set",
        category: "Stationery",
        price: 110,
        originalPrice: 160,
        description: "4-color whiteboard marker set (black, blue, red, green). Dry-erase, easy to clean.",
        emoji: "🖍️",
        brand: "Camlin",
        stock: 200,
        rating: 4.2,
        numReviews: 145,
        featured: false,
        cardColor: "#001a33",
      },

      // ========== COSMETICS ==========
      {
        name: "Matte Lipstick - Red Rose",
        category: "Cosmetics",
        price: 249,
        originalPrice: 399,
        description: "Long-lasting matte lipstick in beautiful Red Rose shade. Moisturizing formula.",
        emoji: "💄",
        brand: "Lakme",
        stock: 200,
        rating: 4.5,
        numReviews: 680,
        featured: true,
        cardColor: "#2d0016",
      },
      {
        name: "Foundation Cream - Medium Beige",
        category: "Cosmetics",
        price: 349,
        originalPrice: 550,
        description: "Full coverage foundation. Natural finish. SPF 15 protection. Suitable for all skin types.",
        emoji: "🧴",
        brand: "Maybelline",
        stock: 100,
        rating: 4.3,
        numReviews: 420,
        featured: false,
        cardColor: "#2d0016",
      },
      {
        name: "Kajal Eyeliner - Intense Black",
        category: "Cosmetics",
        price: 179,
        originalPrice: 250,
        description: "Waterproof kajal eyeliner. Smooth application, stays all day. Deep black color.",
        emoji: "👁️",
        brand: "Wow",
        stock: 350,
        rating: 4.6,
        numReviews: 950,
        featured: false,
        cardColor: "#2d0016",
      },
      {
        name: "Compact Powder - Natural",
        category: "Cosmetics",
        price: 199,
        originalPrice: 299,
        description: "Lightweight compact powder. Oil control, natural finish. Includes mirror and puff.",
        emoji: "🪞",
        brand: "Lakme",
        stock: 180,
        rating: 4.2,
        numReviews: 310,
        featured: false,
        cardColor: "#2d0016",
      },

      // ========== BEAUTY PRODUCTS ==========
      {
        name: "Aloe Vera Face Wash",
        category: "Beauty Products",
        price: 149,
        originalPrice: 230,
        description: "Gentle face wash with natural aloe vera extract. Removes dirt and oil without drying skin.",
        emoji: "🌿",
        brand: "Patanjali",
        stock: 250,
        rating: 4.4,
        numReviews: 730,
        featured: true,
        cardColor: "#0a2a1a",
      },
      {
        name: "Anti-Dandruff Shampoo",
        category: "Beauty Products",
        price: 199,
        originalPrice: 320,
        description: "Clinically proven anti-dandruff shampoo. Controls dandruff and nourishes hair. 400ml.",
        emoji: "🧴",
        brand: "Head & Shoulders",
        stock: 180,
        rating: 4.3,
        numReviews: 540,
        featured: false,
        cardColor: "#0a2a1a",
      },
      {
        name: "Moisturizing Body Lotion",
        category: "Beauty Products",
        price: 229,
        originalPrice: 350,
        description: "Deep moisturizing body lotion with vitamin E. Suitable for dry skin. 500ml.",
        emoji: "💆",
        brand: "Vaseline",
        stock: 200,
        rating: 4.5,
        numReviews: 620,
        featured: true,
        cardColor: "#0a2a1a",
      },
      {
        name: "SPF 50 Sunscreen Lotion",
        category: "Beauty Products",
        price: 299,
        originalPrice: 450,
        description: "Broad spectrum SPF 50 sunscreen. Protects from UVA and UVB rays. Non-greasy formula.",
        emoji: "☀️",
        brand: "Lotus",
        stock: 150,
        rating: 4.4,
        numReviews: 380,
        featured: false,
        cardColor: "#0a2a1a",
      },

      // ========== PLASTIC PRODUCTS ==========
      {
        name: "Heavy Duty Plastic Bucket - 20L",
        category: "Plastic Products",
        price: 129,
        originalPrice: 180,
        description: "Sturdy 20-litre plastic bucket. Strong handle, leak-proof. Ideal for bathroom and kitchen.",
        emoji: "🪣",
        brand: "Cello",
        stock: 300,
        rating: 4.2,
        numReviews: 280,
        featured: false,
        cardColor: "#1a2a0a",
      },
      {
        name: "Plastic Mug - 1 Litre",
        category: "Plastic Products",
        price: 49,
        originalPrice: 75,
        description: "Durable 1-litre plastic mug for bathroom use. BPA-free material.",
        emoji: "🥤",
        brand: "Cello",
        stock: 400,
        rating: 4.1,
        numReviews: 190,
        featured: false,
        cardColor: "#1a2a0a",
      },
      {
        name: "Plastic Water Bottle - 1L",
        category: "Plastic Products",
        price: 89,
        originalPrice: 130,
        description: "BPA-free plastic water bottle. Leak-proof cap. Perfect for school and office.",
        emoji: "🍶",
        brand: "Milton",
        stock: 250,
        rating: 4.3,
        numReviews: 415,
        featured: true,
        cardColor: "#1a2a0a",
      },
      {
        name: "Storage Container Set (3 Piece)",
        category: "Plastic Products",
        price: 249,
        originalPrice: 380,
        description: "Set of 3 airtight plastic containers. Ideal for storing food, grains, and spices.",
        emoji: "📦",
        brand: "Tupperware",
        stock: 120,
        rating: 4.5,
        numReviews: 360,
        featured: false,
        cardColor: "#1a2a0a",
      },

      // ========== HOME PRODUCTS ==========
      {
        name: "Soft Bristle Broom (Jhadoo)",
        category: "Home Products",
        price: 79,
        originalPrice: 120,
        description: "Traditional soft bristle broom. Long handle, ideal for sweeping all floor types.",
        emoji: "🧹",
        brand: "Scotch-Brite",
        stock: 200,
        rating: 4.3,
        numReviews: 450,
        featured: true,
        cardColor: "#2a1a00",
      },
      {
        name: "Flat Floor Wiper/Mop",
        category: "Home Products",
        price: 149,
        originalPrice: 230,
        description: "Flat floor mop/wiper with absorbent microfiber pad. Adjustable handle. Easy to clean.",
        emoji: "🧽",
        brand: "Scotch-Brite",
        stock: 180,
        rating: 4.4,
        numReviews: 320,
        featured: true,
        cardColor: "#2a1a00",
      },
      {
        name: "Plastic Dustpan with Handle",
        category: "Home Products",
        price: 59,
        originalPrice: 90,
        description: "Sturdy plastic dustpan with long handle. Comfortable grip. Pair with broom.",
        emoji: "🗑️",
        brand: "Generic",
        stock: 300,
        rating: 4.0,
        numReviews: 220,
        featured: false,
        cardColor: "#2a1a00",
      },
      {
        name: "Steel Handle Scrubber (3 Pack)",
        category: "Home Products",
        price: 45,
        originalPrice: 70,
        description: "Pack of 3 stainless steel scrubbers. Heavy-duty for cleaning pots, pans, and utensils.",
        emoji: "🪚",
        brand: "VIM",
        stock: 500,
        rating: 4.2,
        numReviews: 680,
        featured: false,
        cardColor: "#2a1a00",
      },
      {
        name: "Toilet Brush with Holder",
        category: "Home Products",
        price: 99,
        originalPrice: 150,
        description: "Plastic toilet brush with wall-mountable holder. Long handle for easy cleaning.",
        emoji: "🚽",
        brand: "Prestige",
        stock: 200,
        rating: 4.1,
        numReviews: 195,
        featured: false,
        cardColor: "#2a1a00",
      },

      // ========== ANIMAL FOOD ==========
      {
        name: "Cotton Seed Cake (Binola Khali) - 5kg",
        category: "Animal Food",
        price: 299,
        originalPrice: 399,
        description: "High-protein cotton seed cake (binola khali) for cattle. Improves milk production. 5kg pack.",
        emoji: "🌾",
        brand: "Godrej Agrovet",
        stock: 100,
        rating: 4.5,
        numReviews: 120,
        featured: true,
        cardColor: "#1a1a00",
      },
      {
        name: "Cattle Feed Pellets - 10kg",
        category: "Animal Food",
        price: 450,
        originalPrice: 580,
        description: "Nutritionally balanced cattle feed in pellet form. Suitable for cows, buffaloes and goats.",
        emoji: "🐄",
        brand: "Godrej Agrovet",
        stock: 80,
        rating: 4.4,
        numReviews: 87,
        featured: false,
        cardColor: "#1a1a00",
      },
      {
        name: "Poultry Feed (Starter) - 10kg",
        category: "Animal Food",
        price: 520,
        originalPrice: 650,
        description: "Complete nutrition starter feed for chicks. High protein formula for healthy growth.",
        emoji: "🐔",
        brand: "Venkateshwara Hatcheries",
        stock: 60,
        rating: 4.3,
        numReviews: 65,
        featured: false,
        cardColor: "#1a1a00",
      },
      {
        name: "Groundnut Oil Cake - 5kg",
        category: "Animal Food",
        price: 380,
        originalPrice: 480,
        description: "Groundnut oil cake for livestock. Rich in protein and energy. Suitable for cattle and sheep.",
        emoji: "🥜",
        brand: "Local Brand",
        stock: 75,
        rating: 4.2,
        numReviews: 43,
        featured: false,
        cardColor: "#1a1a00",
      },

      // ========== CLEANING SUPPLIES ==========
      {
        name: "Surf Excel Detergent Powder - 1kg",
        category: "Cleaning Supplies",
        price: 120,
        originalPrice: 160,
        description: "Advanced stain removal detergent powder. Suitable for hand wash and machine wash. 1kg pack.",
        emoji: "🫧",
        brand: "Surf Excel",
        stock: 400,
        rating: 4.6,
        numReviews: 1100,
        featured: true,
        cardColor: "#00153a",
      },
      {
        name: "Phenyl Disinfectant - 1 Litre",
        category: "Cleaning Supplies",
        price: 59,
        originalPrice: 85,
        description: "Black phenyl floor disinfectant. Kills germs and bacteria. Pleasant fragrance. 1 litre.",
        emoji: "🧪",
        brand: "Reckitt",
        stock: 300,
        rating: 4.2,
        numReviews: 380,
        featured: false,
        cardColor: "#00153a",
      },
      {
        name: "Toilet Cleaner - 500ml",
        category: "Cleaning Supplies",
        price: 79,
        originalPrice: 110,
        description: "Powerful toilet bowl cleaner. Removes stains and kills 99.9% germs. Fresh fragrance.",
        emoji: "🚿",
        brand: "Harpic",
        stock: 250,
        rating: 4.4,
        numReviews: 570,
        featured: false,
        cardColor: "#00153a",
      },
      {
        name: "Dish Wash Soap Bar (3 Pack)",
        category: "Cleaning Supplies",
        price: 45,
        originalPrice: 70,
        description: "Pack of 3 dish wash soap bars. Removes grease and oil effectively. Gentle on hands.",
        emoji: "🧼",
        brand: "VIM",
        stock: 500,
        rating: 4.3,
        numReviews: 820,
        featured: false,
        cardColor: "#00153a",
      },
      {
        name: "All-Purpose Floor Cleaner - 2L",
        category: "Cleaning Supplies",
        price: 199,
        originalPrice: 280,
        description: "Concentrated floor cleaner with floral fragrance. Suitable for tiles, marble, and concrete.",
        emoji: "🏠",
        brand: "Lizol",
        stock: 200,
        rating: 4.5,
        numReviews: 730,
        featured: true,
        cardColor: "#00153a",
      },
    ];

    // Delete all existing products first to avoid duplicates
    await Product.deleteMany({});

    // Insert all sample products into MongoDB
    const inserted = await Product.insertMany(sampleProducts);

    res.json({
      message: `✅ Successfully seeded ${inserted.length} products!`,
      count: inserted.length,
    });
  } catch (error) {
    console.error("Seed error:", error.message);
    res.status(500).json({ message: "Error seeding products", error: error.message });
  }
});

// ==============================
// Admin Routes
// ==============================
const { protect, admin } = require("../middleware/authMiddleware");

// POST /api/products
router.post("/", protect, admin, async (req, res) => {
  try {
    const product = new Product(req.body);
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(400).json({ message: "Invalid product data", error: error.message });
  }
});

// PUT /api/products/:id
router.put("/:id", protect, admin, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: "Error updating product", error: error.message });
  }
});

// DELETE /api/products/:id
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product removed" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error: error.message });
  }
});

module.exports = router;
