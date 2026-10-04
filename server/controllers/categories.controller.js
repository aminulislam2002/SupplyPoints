const categories = require("../models/categories.schema");

// Get all categories
const allCategories = async (req, res) => {
  try {
    const allCategory = await categories.aggregate([
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "category",
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
      data: allCategory,
      message: "Categories fetched successfully!",
    });
  } catch (error) {
    console.log(error);
    return res.status(503).json({ message: "Internal Server Error!" });
  }
};

// Get a category by its id
const getCategoryById = async (req, res) => {
  const { id } = req.params;

  try {
    const category = await categories.findById(id).lean();

    return res.status(200).json({
      success: true,
      data: category,
      message: "Category fetched successfully!",
    });
  } catch (error) {
    console.log(error);
    return res.status(503).json({ message: "Internal Server Error!" });
  }
};

// Add new category and category image to server
const addCategory = async (req, res) => {
  const data = req.body;

  try {
    const category = new categories(data);
    await category.save();

    return res.status(200).json({ message: "New Category Added!" });
  } catch (error) {
    console.error("Error adding category:", error);
    return res.status(500).json({ message: "Internal Server Error!" });
  }
};

// Update category and update existing image from server
const updateCategory = async (req, res) => {
  const { id } = req.params;
  const category = req.body;

  try {
    const existingCategory = await categories.findById(id).lean();
    if (!existingCategory) {
      return res.status(404).json({ message: "Category not found!" });
    }

    await categories.findByIdAndUpdate(
      id,
      { ...category },
      { runValidators: true },
    );

    return res.status(200).json({ message: "Updated successfully!" });
  } catch (error) {
    console.error("Error updating category:", error);
    return res.status(500).json({ message: "Internal Server Error!" });
  }
};

// Delete a specific category and its image from server
const deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const category = await categories.findById(id).lean();

    if (!category)
      return res.status(404).json({ message: "Category Not Found!" });

    await categories.findByIdAndDelete(id);
    return res.status(200).json({ message: "Successfully Deleted Category!" });
  } catch (error) {
    console.error("Error deleting category:", error);
    return res.status(500).json({ message: "Internal Server Error!" });
  }
};

module.exports = {
  allCategories,
  getCategoryById,
  addCategory,
  updateCategory,
  deleteCategory,
};
