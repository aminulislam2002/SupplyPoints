const fs = require("fs");
const mongoose = require("mongoose");
const subCategories = require("../models/sub_categories.schema");

// Get all sub-categories
const allCategories = async (req, res) => {
  try {
    const allSubCategory = await subCategories.aggregate([
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "subCategory",
          as: "products",
        },
      },
      {
        $addFields: {
          productCount: { $size: "$products" },
        },
      },
      {
        $project: {
          products: 0,
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);

    return res.status(200).json({
      success: true,
      data: allSubCategory,
      message: "Sub-Categories fetched successfully!",
    });
  } catch (error) {
    console.log(error);
    return res.status(503).json({ message: "Internal Server Error!" });
  }
};

// Get sub-categories by category id
const getSubCategoriesByCategoryId = async (req, res) => {
  const { categoryId } = req.params;

  try {
    const categories = await subCategories.aggregate([
      {
        $match: { category: new mongoose.Types.ObjectId(categoryId) },
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "subCategory",
          as: "products",
        },
      },
      {
        $addFields: {
          productCount: { $size: "$products" },
        },
      },
      {
        $project: {
          products: 0,
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);

    return res.status(200).json({
      success: true,
      data: categories,
      message: "Sub-Categories fetched successfully!",
    });
  } catch (error) {
    console.log(error);
    return res.status(503).json({ message: "Internal Server Error!" });
  }
};

// Get a sub-category by its id
const getSubCategoryById = async (req, res) => {
  const { id } = req.params;

  try {
    const category = await subCategories.findById(id).lean();

    return res.status(200).json({
      success: true,
      data: category,
      message: "Sub-Category fetched successfully!",
    });
  } catch (error) {
    console.log(error);
    return res.status(503).json({ message: "Internal Server Error!" });
  }
};

// Add new sub category with category image to server
const addSubCategory = async (req, res) => {
  const data = req.body;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: "No file uploaded!" });
  }

  try {
    const image = `/images/categories/${file.filename}`;

    const subCategoryData = {
      ...data,
      image,
    };

    const subCategory = new subCategories(subCategoryData);
    await subCategory.save();

    return res.status(200).json({ message: "New Sub Category Added!" });
  } catch (error) {
    // Delete the newly uploaded file in case of error
    if (file) {
      fs.unlink(file.path, (unlinkErr) => {
        if (unlinkErr)
          console.error("Error deleting uploaded image:", unlinkErr);
      });
    }

    console.error("Error adding category:", error);
    return res.status(500).json({ message: "Internal Server Error!" });
  }
};

// Update sub category and update existing image from server
const updateSubCategory = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const file = req.file;

  try {
    const existingSubCategory = await subCategories.findById(id).lean();
    if (!existingSubCategory) {
      return res.status(404).json({ message: "Sub Category not found!" });
    }

    let updatedImage = existingSubCategory.image;
    if (file) {
      updatedImage = `/images/categories/${file.filename}`;

      // delete old image file if exists
      if (existingSubCategory?.image) {
        fs.unlink(`.${existingSubCategory.image}`, (err) => {
          if (err?.code === "ENOENT") {
            console.warn("Sub Category image not found for deletion!");
          } else if (err) {
            console.error("Error deleting old sub category image:", err);
          }
        });
      }
    }

    const updatedDocs = {
      ...data,
      image: updatedImage,
    };

    await subCategories.findByIdAndUpdate(id, updatedDocs, {
      runValidators: true,
      new: true,
    });

    return res.status(200).json({ message: "Updated successfully!" });
  } catch (error) {
    // Delete the newly uploaded file in case of error
    if (req.files.image && req.files.image[0]) {
      fs.unlink(req.files.image[0].path, (unlinkErr) => {
        if (unlinkErr)
          console.error("Error deleting uploaded image:", unlinkErr);
      });
    }

    console.error("Error updating sub category:", error);
    return res.status(500).json({ message: "Internal Server Error!" });
  }
};

// Delete a specific category and its image from server
const deleteSubCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const subCategory = await subCategories.findById(id).lean();

    if (!subCategory)
      return res.status(404).json({ message: "Sub Category Not Found!" });

    if (subCategory?.image) {
      fs.unlink(`.${subCategory.image}`, (err) => {
        if (err?.code === "ENOENT") {
          console.warn("Sub Category image not found for deletion!");
        } else if (err) {
          console.error("Error deleting sub category image:", err);
        }
      });
    }

    await subCategories.findByIdAndDelete(id);
    return res
      .status(200)
      .json({ message: "Successfully Deleted Sub Category!" });
  } catch (error) {
    console.error("Error deleting sub category:", error);
    return res.status(500).json({ message: "Internal Server Error!" });
  }
};

module.exports = {
  allCategories,
  getSubCategoryById,
  getSubCategoriesByCategoryId,
  addSubCategory,
  updateSubCategory,
  deleteSubCategory,
};
