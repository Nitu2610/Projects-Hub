require("dotenv").config();
import mongoose from "mongoose";
const Category = require("../models/category.model");

// --------------------------------------------------
// 1. Category seed data
// --------------------------------------------------

// Parent categories have parent: null.
// Child categories will receive the parent's MongoDB _id
// after the parent categories are created.
const parentCategories = [
  {
    name: "Electronics",
    normalizedName: "electronics",
    parent: null,
    active: true,
  },
  {
    name: "Home Appliances",
    normalizedName: "home appliances",
    parent: null,
    active: true,
  },
  {
    name: "Gaming",
    normalizedName: "gaming",
    parent: null,
    active: true,
  },
];

// Child category names grouped under their parent.
const childCategories = {
  Electronics: [
    "Mobiles",
    "Laptops",
    "Tablets",
    "Power Banks",
    "Wearables",
    "Cables & Adapters",
  ],

  "Home Appliances": [
    "Refrigerators",
    "Washing Machines",
    "Air Conditioners",
    "Microwaves",
    "Stabilizers",
  ],

  Gaming: ["Gaming Consoles", "Gaming Accessories"],
};

// --------------------------------------------------
// 2. Main seed function
// --------------------------------------------------

const seedCategories = async () => {
  try {
    // Connect to MongoDB using the same environment variable
    // that your application already uses.
   const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
  throw new Error("MONGO_URI is not defined in the environment variables.");
}

await mongoose.connect(mongoUri);

    console.log("MongoDB connected.");

    // ------------------------------------------------
    // 3. Clear existing categories
    // ------------------------------------------------

    // This makes the script useful during development.
    // Every time we run it, we start with a clean category
    // collection.
    //
    // IMPORTANT:
    // We will NOT use this blindly when we later run
    // against production data.
    await Category.deleteMany({});

    console.log("Existing categories cleared.");

    // ------------------------------------------------
    // 4. Create parent categories
    // ------------------------------------------------

    const createdParents = await Category.insertMany(parentCategories);

    console.log(`${createdParents.length} parent categories created.`);

    // ------------------------------------------------
    // 5. Create a map of parent names -> MongoDB _id
    // ------------------------------------------------

    // MongoDB generated the _id values when the parents
    // were inserted.
    //
    // We need those _ids because a child category stores
    // the parent's _id in its "parent" field.
    //
    // Example:
    //
    // Electronics
    //      _id: 68abc123...
    //
    // Mobiles
    //      parent: 68abc123...
    //

    const parentIdMap = new Map<string, mongoose.Types.ObjectId>();

    createdParents.forEach((parent: any) => {
      parentIdMap.set(parent.name, parent._id);
    });

    // ------------------------------------------------
    // 6. Build child category documents
    // ------------------------------------------------

    const childrenToInsert: any[] = [];

    Object.entries(childCategories).forEach(
      ([parentName, children]) => {
        // Find the MongoDB _id of the parent.
        const parentId = parentIdMap.get(parentName);

        if (!parentId) {
          throw new Error(
            `Parent category not found: ${parentName}`
          );
        }

        // Create a document for every child category.
        children.forEach((childName) => {
          childrenToInsert.push({
            name: childName,

            // Convert the display name into the normalized
            // version used by your schema/index.
            normalizedName: childName
              .toLowerCase()
              .trim(),

            // Store the actual MongoDB ObjectId of the parent.
            parent: parentId,

            active: true,
          });
        });
      }
    );

    // ------------------------------------------------
    // 7. Insert child categories
    // ------------------------------------------------

    const createdChildren = await Category.insertMany(
      childrenToInsert
    );

    console.log(`${createdChildren.length} child categories created.`);

    // ------------------------------------------------
    // 8. Display final result
    // ------------------------------------------------

    const totalCategories =
      createdParents.length + createdChildren.length;

    console.log(
      `Successfully seeded ${totalCategories} categories.`
    );

    // ------------------------------------------------
    // 9. Close MongoDB connection
    // ------------------------------------------------

    await mongoose.disconnect();

    console.log("MongoDB connection closed.");
  } catch (error) {
    console.error("Category seeding failed:", error);

    // Make sure the connection is closed even if
    // something goes wrong.
    await mongoose.disconnect();

    process.exit(1);
  }
};

// --------------------------------------------------
// 10. Execute the seed function
// --------------------------------------------------

seedCategories();