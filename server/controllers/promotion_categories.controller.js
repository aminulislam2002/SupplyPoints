const fs = require("fs");

const promotionCategories = require("../models/promotion_categories.schema");
const promotionPacks = require("../models/promotion_packs.schema");

const allPromotionCategories = async (req, res) => {
  try {
    const allCategories = await promotionCategories.aggregate([
      {
        $lookup: {
          from: "promotion_packs",
          localField: "_id",
          foreignField: "category",
          as: "packs",
        },
      },
      {
        $addFields: {
          packCount: { $size: "$packs" },
        },
      },
      {
        $project: {
          packs: 0,
        },
      },
      {
        $sort: { createdAt: 1 },
      },
    ]);

    return res.status(200).json({
      success: true,
      data: allCategories,
      message: "Promotion categories fetched successfully!",
    });
  } catch (error) {
    console.log(error);
    return res.status(503).json({ message: "Internal Server Error!" });
  }
};

const getPromotionCategoryById = async (req, res) => {
  const { id } = req.params;

  try {
    const category = await promotionCategories.findById(id).lean();

    return res.status(200).json({
      success: true,
      data: category,
      message: "Promotion category fetched successfully!",
    });
  } catch (error) {
    console.log(error);
    return res.status(503).json({ message: "Internal Server Error!" });
  }
};

const addPromotionCategory = async (req, res) => {
  const data = req.body;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: "No file uploaded!" });
  }

  try {
    const image = `/images/promotions/${file.filename}`;

    const categoryData = {
      ...data,
      image,
    };

    const category = new promotionCategories(categoryData);
    await category.save();

    return res.status(200).json({ message: "New Promotion Category Added!" });
  } catch (error) {
    if (file) {
      fs.unlink(file.path, (unlinkErr) => {
        if (unlinkErr) {
          console.error("Error deleting uploaded image:", unlinkErr);
        }
      });
    }

    console.error(error);
    return res.status(500).json({ message: "Internal Server Error!" });
  }
};

const updatePromotionCategory = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const file = req.file;

  try {
    const existingCategory = await promotionCategories.findById(id).lean();
    if (!existingCategory) {
      return res.status(404).json({ message: "Promotion Category not found!" });
    }

    let updatedImage = existingCategory.image;

    if (file) {
      updatedImage = `/images/promotions/${file.filename}`;

      if (existingCategory?.image) {
        fs.unlink(`.${existingCategory.image}`, (err) => {
          if (err?.code === "ENOENT") {
            console.warn("Promotion category image not found for deletion!");
          } else if (err) {
            console.error("Error deleting old promotion category image:", err);
          }
        });
      }
    }

    const updatedDocs = {
      ...data,
      image: updatedImage,
    };

    await promotionCategories.findByIdAndUpdate(id, updatedDocs, {
      runValidators: true,
      new: true,
    });

    return res.status(200).json({ message: "Updated successfully!" });
  } catch (error) {
    if (file) {
      fs.unlink(file.path, (unlinkErr) => {
        if (unlinkErr) {
          console.error("Error deleting uploaded image:", unlinkErr);
        }
      });
    }

    console.error(error);
    return res.status(500).json({ message: "Internal Server Error!" });
  }
};

const deletePromotionCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const category = await promotionCategories.findById(id).lean();

    if (!category) {
      return res.status(404).json({ message: "Promotion Category Not Found!" });
    }

    const packCount = await promotionPacks.countDocuments({ category: id });

    if (packCount > 0) {
      return res.status(400).json({
        message: "Delete related promotion packs first!",
      });
    }

    if (category?.image) {
      fs.unlink(`.${category.image}`, (err) => {
        if (err?.code === "ENOENT") {
          console.warn("Promotion category image not found for deletion!");
        } else if (err) {
          console.error("Error deleting promotion category image:", err);
        }
      });
    }

    await promotionCategories.findByIdAndDelete(id);
    return res
      .status(200)
      .json({ message: "Successfully Deleted Promotion Category!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error!" });
  }
};

module.exports = {
  allPromotionCategories,
  getPromotionCategoryById,
  addPromotionCategory,
  updatePromotionCategory,
  deletePromotionCategory,
};
