require("dotenv").config();

import mongoose from "mongoose";

const Category = require("../models/category.model");
const Product = require("../models/product.model");

// Product datasets are kept separately so that this file
// contains only the seeding logic.
const electronicsProducts = require("../seed-data/electronics.products");
const homeApplianceProducts = require("../seed-data/home-appliances.products");
const gamingProducts = require("../seed-data/gaming.products");

// --------------------------------------------------
// Main seed function
// --------------------------------------------------

const seedProducts = async () => {
  try {
    // ------------------------------------------------
    // 1. Connect to MongoDB
    // ------------------------------------------------

   const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error(
        "MONGO_URI is not defined in the environment variables."
      );
    }

    await mongoose.connect(mongoUri);

    console.log("MongoDB connected.");

    // ------------------------------------------------
    // 2. Clear existing products
    // ------------------------------------------------

    // This is useful while developing/testing the seed.
    // It allows us to run the script multiple times without
    // accumulating duplicate products.
    //
    // IMPORTANT:
    // We will NOT blindly use this approach against production
    // once real customer/order data exists.
    await Product.deleteMany({});

    console.log("Existing products cleared.");

    // ------------------------------------------------
    // 3. Fetch required categories
    // ------------------------------------------------

    // We don't hardcode MongoDB ObjectIds.
    // Instead, we find categories using normalizedName.
    //
    // This is important because MongoDB generates a different
    // _id whenever the categories are recreated.

    const electronics = await Category.findOne({
      normalizedName: "electronics",
      parent: null,
    });

    const homeAppliances = await Category.findOne({
      normalizedName: "home appliances",
      parent: null,
    });

    const gaming = await Category.findOne({
      normalizedName: "gaming",
      parent: null,
    });

    // ------------------------------------------------
    // 4. Make sure the parent categories exist
    // ------------------------------------------------

    if (!electronics || !homeAppliances || !gaming) {
      throw new Error(
        "Required parent categories were not found. Run seed.categories.ts first."
      );
    }

    console.log("Required parent categories found.");

    // ------------------------------------------------
    // 5. Create a map of child categories
    // ------------------------------------------------

    // Products need the ObjectId of their actual category.
    //
    // Example:
    //
    // Mobiles
    //    ↓
    // 68abc123...
    //
    // Product
    // category: 68abc123...

    const categoryMap = new Map<
      string,
      mongoose.Types.ObjectId
    >();

    const categories = await Category.find({
      active: true,
    });

    categories.forEach((category: any) => {
      categoryMap.set(category.normalizedName, category._id);
    });

    // ------------------------------------------------
    // 6. Combine all product datasets
    // ------------------------------------------------

    // Each data file contains products grouped by the
    // top-level category.
    //
    // We combine them here before processing them.

    const allProducts = [
      ...electronicsProducts,
      ...homeApplianceProducts,
      ...gamingProducts,
    ];

    console.log(
      `Preparing ${allProducts.length} products...`
    );

    // ------------------------------------------------
    // 7. Resolve category names to MongoDB ObjectIds
    // ------------------------------------------------

    const productsToInsert = allProducts.map(
      (product: any) => {
        const categoryId = categoryMap.get(
          product.category
            .toLowerCase()
            .trim()
        );

        if (!categoryId) {
          throw new Error(
            `Category not found for product: ${product.title}. Category: ${product.category}`
          );
        }

        return {
          title: product.title,
          description: product.description,
          color: product.color,
          price: product.price,
          discountedPrice: product.discountedPrice,
          stock: product.stock,

          // Specification must be an object containing
          // string key/value pairs.
          //
          // Every seeded product will contain Brand.

          specification: product.specification,

          // Replace the human-readable category name
          // with the actual MongoDB ObjectId.
          category: categoryId,

          active: true,

          // Images are intentionally empty during seeding.
          // They will be added later through the admin UI
          // after Cloudinary production setup.

          images: [],
        };
      }
    );

    // ------------------------------------------------
    // 8. Insert products
    // ------------------------------------------------

    const createdProducts = await Product.insertMany(
      productsToInsert
    );

    console.log(
      `${createdProducts.length} products created successfully.`
    );

    // ------------------------------------------------
    // 9. Close MongoDB connection
    // ------------------------------------------------

    await mongoose.disconnect();

    console.log("MongoDB connection closed.");
  } catch (error) {
    console.error("Product seeding failed:", error);

    // Always close the database connection when an error
    // occurs.
    await mongoose.disconnect();

    process.exit(1);
  }
};

// --------------------------------------------------
// 10. Execute the seed function
// --------------------------------------------------

seedProducts();