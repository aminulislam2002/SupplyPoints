const fs = require("fs");

const marketingPacks = require("../models/marketing_packs.schema");

const allMarketingPacks = async (req, res) => {
  const { category } = req.query;

  try {
    const query = {};

    if (category && String(category).trim()) {
      query.category = String(category).trim();
    }

    const packs = await marketingPacks
      .find(query)
      .sort({ createdAt: 1 })
      .lean();

    return res.status(200).json({
      success: true,
      data: packs,
      message: "Marketing packs fetched successfully!",
    });
  } catch (error) {
    console.log(error);
    return res.status(503).json({ message: "Internal Server Error!" });
  }
};

const getMarketingPackById = async (req, res) => {
  const { id } = req.params;

  try {
    const pack = await marketingPacks.findById(id).lean();

    return res.status(200).json({
      success: true,
      data: pack,
      message: "Marketing pack fetched successfully!",
    });
  } catch (error) {
    console.log(error);
    return res.status(503).json({ message: "Internal Server Error!" });
  }
};

const addMarketingPack = async (req, res) => {
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

    const pack = new marketingPacks(packData);
    await pack.save();

    return res.status(200).json({ message: "New Marketing Pack Added!" });
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

const updateMarketingPack = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const file = req.file;

  try {
    const existingPack = await marketingPacks.findById(id).lean();

    if (!existingPack) {
      return res.status(404).json({ message: "Marketing Pack not found!" });
    }

    let updatedImage = existingPack.image;

    if (file) {
      updatedImage = `/images/promotions/${file.filename}`;

      if (existingPack?.image) {
        fs.unlink(`.${existingPack.image}`, (err) => {
          if (err?.code === "ENOENT") {
            console.warn("Marketing pack image not found for deletion!");
          } else if (err) {
            console.error("Error deleting old marketing pack image:", err);
          }
        });
      }
    }

    const updatedDocs = {
      ...data,
      image: updatedImage,
    };

    await marketingPacks.findByIdAndUpdate(id, updatedDocs, {
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

const deleteMarketingPack = async (req, res) => {
  const { id } = req.params;

  try {
    const pack = await marketingPacks.findById(id).lean();

    if (!pack) {
      return res.status(404).json({ message: "Marketing Pack Not Found!" });
    }

    if (pack?.image) {
      fs.unlink(`.${pack.image}`, (err) => {
        if (err?.code === "ENOENT") {
          console.warn("Marketing pack image not found for deletion!");
        } else if (err) {
          console.error("Error deleting marketing pack image:", err);
        }
      });
    }

    await marketingPacks.findByIdAndDelete(id);
    return res
      .status(200)
      .json({ message: "Successfully Deleted Marketing Pack!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error!" });
  }
};

module.exports = {
  allMarketingPacks,
  getMarketingPackById,
  addMarketingPack,
  updateMarketingPack,
  deleteMarketingPack,
};
