const fs = require("fs");
const mongoose = require("mongoose");

const promotionPacks = require("../models/promotion_packs.schema");

const allPromotionPacks = async (req, res) => {
  const { category } = req.query;

  try {
    const pipeline = [];

    if (category && String(category).trim()) {
      pipeline.push({
        $match: { category: new mongoose.Types.ObjectId(category) },
      });
    }

    pipeline.push(
      {
        $lookup: {
          from: "promotion_categories",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $unwind: {
          path: "$category",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          name: 1,
          title: 1,
          price: 1,
          description: 1,
          image: 1,
          durationDays: 1,
          createdAt: 1,
          category: {
            _id: "$category._id",
            name: "$category.name",
          },
        },
      },
      {
        $sort: { createdAt: 1 },
      },
    );

    const packs = await promotionPacks.aggregate(pipeline);

    return res.status(200).json({
      success: true,
      data: packs,
      message: "Promotion packs fetched successfully!",
    });
  } catch (error) {
    console.log(error);
    return res.status(503).json({ message: "Internal Server Error!" });
  }
};

const getPromotionPackById = async (req, res) => {
  const { id } = req.params;

  try {
    const pack = await promotionPacks.findById(id).lean();

    return res.status(200).json({
      success: true,
      data: pack,
      message: "Promotion pack fetched successfully!",
    });
  } catch (error) {
    console.log(error);
    return res.status(503).json({ message: "Internal Server Error!" });
  }
};

const addPromotionPack = async (req, res) => {
  const data = req.body;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: "No file uploaded!" });
  }

  try {
    const image = `/images/promotions/${file.filename}`;

    const packData = {
      ...data,
      image,
    };

    const pack = new promotionPacks(packData);
    await pack.save();

    return res.status(200).json({ message: "New Promotion Pack Added!" });
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

const updatePromotionPack = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const file = req.file;

  try {
    const existingPack = await promotionPacks.findById(id).lean();

    if (!existingPack) {
      return res.status(404).json({ message: "Promotion Pack not found!" });
    }

    let updatedImage = existingPack.image;

    if (file) {
      updatedImage = `/images/promotions/${file.filename}`;

      if (existingPack?.image) {
        fs.unlink(`.${existingPack.image}`, (err) => {
          if (err?.code === "ENOENT") {
            console.warn("Promotion pack image not found for deletion!");
          } else if (err) {
            console.error("Error deleting old promotion pack image:", err);
          }
        });
      }
    }

    const updatedDocs = {
      ...data,
      image: updatedImage,
    };

    await promotionPacks.findByIdAndUpdate(id, updatedDocs, {
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

const deletePromotionPack = async (req, res) => {
  const { id } = req.params;

  try {
    const pack = await promotionPacks.findById(id).lean();

    if (!pack) {
      return res.status(404).json({ message: "Promotion Pack Not Found!" });
    }

    if (pack?.image) {
      fs.unlink(`.${pack.image}`, (err) => {
        if (err?.code === "ENOENT") {
          console.warn("Promotion pack image not found for deletion!");
        } else if (err) {
          console.error("Error deleting promotion pack image:", err);
        }
      });
    }

    await promotionPacks.findByIdAndDelete(id);
    return res
      .status(200)
      .json({ message: "Successfully Deleted Promotion Pack!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error!" });
  }
};

module.exports = {
  allPromotionPacks,
  getPromotionPackById,
  addPromotionPack,
  updatePromotionPack,
  deletePromotionPack,
};
