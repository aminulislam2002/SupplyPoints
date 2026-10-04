const fs = require("fs");

const products = require("../models/products.schema");

// Get products with searching, filtering, sorting, and pagination options
const getProductsOnDashboard = async (req, res) => {
  const {
    currentPage,
    limitPerPage,
    category,
    subCategory,
    availability,
    sortQuery,
    searchQuery,
  } = req.query;

  const query = {};
  let sort = {};

  const trimmedSearch = (searchQuery || "").trim();
  let useTextSearch = false;

  // Only start search when input length >= 2
  const isOnlyNumber = /^\d+$/.test(trimmedSearch);
  const isCodeLike = /^[A-Z]+\d+$/i.test(trimmedSearch);

  if (isOnlyNumber || isCodeLike) {
    query.productCode = {
      $regex: trimmedSearch,
      $options: "i",
    };
  } else if (trimmedSearch.length >= 3) {
    query.$text = { $search: trimmedSearch };
    useTextSearch = true;
  }

  if (category) {
    query.category = category;
  }

  if (subCategory) {
    query.subCategory = subCategory;
  }

  if (availability) {
    query.availability = availability;
  }
  switch (sortQuery) {
    case "added_desc":
      sort.createdAt = -1;
      break;
    case "added_asc":
      sort.createdAt = 1;
      break;
    case "price_asc":
      sort = { ...sort, price: 1 };
      break;
    case "price_desc":
      sort = { ...sort, price: -1 };
      break;
    case "most_sold":
      sort = { ...sort, sold: -1 };
      break;
    default:
      sort = { ...sort, createdAt: -1 };
  }

  if (useTextSearch) {
    sort = { score: { $meta: "textScore" }, ...sort };
  }

  // Pagination
  const totalProducts = await products.countDocuments(query);
  const page = Math.max(0, parseInt(currentPage, 10) || 0); // 0-based page
  const limit = Math.min(
    999,
    Math.max(
      1,
      parseInt(limitPerPage, 10) || Math.min(12, totalProducts || 12),
    ),
  );
  const skip = page * limit;

  try {
    let cursor = products
      .find(query)
      .select(
        "-descriptions -reviews -photos -colors -sizes -quantity -availability -notes -createdAt",
      );

    if (useTextSearch) {
      cursor = cursor.select({ score: { $meta: "textScore" } });
    }

    cursor = cursor.sort(sort).skip(skip).limit(limit).lean();

    const productsList = await cursor;

    return res.status(200).json({
      totalProducts,
      data: productsList,
      hasMore: skip + productsList?.length < totalProducts,
    });
  } catch (error) {
    console.log(error);
    return res.status(503).json({ message: "Internal Server Error!" });
  }
};

// Products on display page
const getProductsOnDisplay = async (req, res) => {
  const { currentPage, limitPerPage, category, subCategory, sortQuery } =
    req.query;

  const query = {};

  if (category && String(category).trim()) {
    query.category = category;
  }
  if (subCategory && String(subCategory).trim()) {
    query.subCategory = subCategory;
  }

  let sort = {};

  switch (sortQuery) {
    case "price_asc":
      sort = { ...sort, price: 1 };
      break;
    case "price_desc":
      sort = { ...sort, price: -1 };
      break;
    case "most_sold":
      sort = { ...sort, sold: -1 };
      break;
    default:
      sort = { ...sort, createdAt: -1 };
  }

  // Pagination
  const totalProducts = await products.countDocuments(query);
  const page = Math.max(0, parseInt(currentPage, 10) || 0); // 0-based page
  const limit = Math.min(
    999,
    Math.max(
      1,
      parseInt(limitPerPage, 10) || Math.min(12, totalProducts || 12),
    ),
  );
  const skip = page * limit;

  try {
    let cursor = products
      .find(query)
      .select("title price thumbnail productCode category")
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    const productsList = await cursor;

    return res.status(200).json({
      data: productsList,
      totalProducts,
      hasMore: skip + productsList?.length < totalProducts,
    });
  } catch (error) {
    console.log(error);
    return res.status(503).json({ message: "Internal Server Error!" });
  }
};

// Search products by title or product code
const searchProducts = async (req, res) => {
  const { searchQuery } = req.query;
  const query = {};

  try {
    const trimmedSearch = (searchQuery || "").trim();
    let useTextSearch = false;

    // Only start search when input length >= 2
    const isOnlyNumber = /^\d+$/.test(trimmedSearch);
    const isCodeLike = /^[A-Z]+\d+$/i.test(trimmedSearch);

    if (isOnlyNumber || isCodeLike) {
      query.productCode = {
        $regex: trimmedSearch,
        $options: "i",
      };
    } else if (trimmedSearch.length >= 3) {
      query.$text = { $search: trimmedSearch };
      useTextSearch = true;
    }

    let cursor = products
      .find(query)
      .select("title thumbnail price productCode");

    if (useTextSearch) {
      cursor = cursor.select({ score: { $meta: "textScore" } });
    }

    cursor = cursor.sort({ createdAt: -1 }).limit(20).lean();

    const productsList = await cursor;

    return res.status(200).json({
      data: productsList,
    });
  } catch (error) {
    console.log(error);
    return res.status(503).json({ message: "Internal Server Error!" });
  }
};

// Get a product by its id
const getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await products.findById(id).lean();

    return res.status(200).json({ data: product });
  } catch (error) {
    console.log(error);
    return res.status(503).json({ message: "Internal Server Error!" });
  }
};

// Add new product and host product image to server
const addProduct = async (req, res) => {
  const data = req.body;

  try {
    // Access files from req.files
    const files = req.files || {};

    if (!files.thumbnail) {
      return res.status(400).json({ message: "No Thumbnail uploaded!" });
    }

    // Construct the thumbnail URL
    const thumbnail = files.thumbnail
      ? `/images/products/${files.thumbnail[0].filename}`
      : null;

    // Construct URLs for the photos
    const photos = files.photos
      ? files.photos.map((file) => `/images/products/${file.filename}`)
      : [];

    // Parse colors and sizes as arrays
    const colors = Array.isArray(data?.colors)
      ? data.colors
      : JSON.parse(data.colors || "[]");
    const sizes = Array.isArray(data?.sizes)
      ? data.sizes
      : JSON.parse(data.sizes || "[]");

    // Final product object
    const productData = {
      ...data,
      colors,
      sizes,
      thumbnail: thumbnail,
      photos: photos,
    };

    // Save product data to the database
    const product = new products(productData);
    await product.save();

    return res.status(200).json({ message: "New Product Added!" });
  } catch (error) {
    if (req.files.thumbnail && req.files.thumbnail[0]) {
      fs.unlink(req.files.thumbnail[0].path, (unlinkErr) => {
        if (unlinkErr)
          console.error("Error deleting uploaded thumbnail:", unlinkErr);
      });
    }

    if (req.files.photos && req.files.photos.length > 0) {
      req.files.photos.forEach((file) => {
        fs.unlink(file.path, (unlinkErr) => {
          if (unlinkErr)
            console.error("Error deleting uploaded photo:", unlinkErr);
        });
      });
    }

    console.error(error);
    res.status(500).json({ message: "Something went wrong", error });
  }
};

// Update an existing product and update images from server
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  try {
    // Find existing product to access old thumbnail for deletion
    const existingProduct = await products.findById(id);

    // Access files from req.files
    const files = req.files || {};
    let updatedThumbnail = existingProduct?.thumbnail;
    let updatedPhotos = existingProduct?.photos ? existingProduct?.photos : [];

    if (files?.thumbnail) {
      // Process new thumbnail
      updatedThumbnail = files.thumbnail
        ? `/images/products/${files.thumbnail[0].filename}`
        : null;

      // Deleting the old thumbnail file
      if (existingProduct?.thumbnail) {
        fs.unlink(`.${existingProduct.thumbnail}`, (err) => {
          if (err?.code === "ENOENT") {
            console.warn("Old thumbnail image file not found for deletion.");
          } else if (err) {
            console.error("Error deleting old image file:", err);
          }
        });
      }
    }

    // Process New Photos
    if (files?.photos && files.photos.length > 0) {
      updatedPhotos = files.photos.map(
        (file) => `/images/products/${file.filename}`,
      );

      // Deleting the old photos files
      if (existingProduct.photos && existingProduct.photos.length > 0) {
        for (const photo of existingProduct.photos) {
          fs.unlink(`.${photo}`, (err) => {
            if (err?.code === "ENOENT") {
              console.warn("Old Product photo file not found for deletion.");
            } else if (err) {
              console.error("Error deleting old Product photo file:", err);
            }
          });
        }
      }
    }

    // Parse colors and sizes as arrays
    const colors = Array.isArray(data?.colors)
      ? data.colors
      : JSON.parse(data.colors || "[]");
    const sizes = Array.isArray(data?.sizes)
      ? data.sizes
      : JSON.parse(data.sizes || "[]");

    // Construct the update object
    const updatedDoc = {
      ...data,
      colors,
      sizes,
      thumbnail: updatedThumbnail,
      photos: updatedPhotos,
    };

    // Update the product in the database
    await products.findByIdAndUpdate(id, updatedDoc, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({ message: "Updated successfully!" });
  } catch (error) {
    if (req.files.thumbnail && req.files.thumbnail[0]) {
      fs.unlink(req.files.thumbnail[0].path, (unlinkErr) => {
        if (unlinkErr)
          console.error("Error deleting uploaded thumbnail:", unlinkErr);
      });
    }
    if (req.files.photos && req.files.photos.length > 0) {
      req.files.photos.forEach((file) => {
        fs.unlink(file.path, (unlinkErr) => {
          if (unlinkErr)
            console.error("Error deleting uploaded photo:", unlinkErr);
        });
      });
    }

    console.log(error);
    return res.status(503).json({ message: "Internal Server Error!" });
  }
};

// Delete product and product image from server
const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await products.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product Not Found!" });
    }

    // Delete the product's thumbnail
    if (product?.thumbnail) {
      fs.unlink(`.${product?.thumbnail}`, (err) => {
        if (err?.code === "ENOENT") {
          console.warn("Old thumbnail image file not found for deletion.");
        } else if (err) {
          console.error("Error deleting old image file:", err);
        }
      });
    }

    // Delete product photos
    if (product?.photos && product.photos.length > 0) {
      for (const file of product.photos) {
        fs.unlink(`.${file}`, (err) => {
          if (err?.code === "ENOENT") {
            console.warn(
              "Old product photos image file not found for deletion.",
            );
          } else if (err) {
            console.error("Error deleting old image file:", err);
          }
        });
      }
    }

    // Delete the product from the database
    await products.findByIdAndDelete(id);

    return res.status(200).json({ message: "Successfully Deleted Product!" });
  } catch (error) {
    console.log(error);
    return res.status(503).json({ message: "Internal Server Error!" });
  }
};

module.exports = {
  getProductsOnDashboard,
  getProductsOnDisplay,
  searchProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
};
