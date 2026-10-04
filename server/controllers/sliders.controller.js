const sliders = require("../models/sliders.schema");
const fs = require("fs");

// Get all slider
const getAllSlider = async (req, res) => {
  try {
    const data = await sliders.find().sort({ addedAt: -1 }).lean();

    return res.status(200).json({ data });
  } catch (error) {
    console.log(error);
    return res.status(503).json({ message: "Internal Server Error!" });
  }
};

// Get a single slider by ID
const getSliderById = async (req, res) => {
  const { id } = req.params;

  try {
    const sliderData = await sliders.findById(id).lean();

    if (!sliderData) {
      return res.status(404).json({ message: "Slider not found!" });
    }

    return res.status(200).json({ data: sliderData });
  } catch (error) {
    console.error("Error fetching slider:", error);
    return res.status(500).json({ message: "Internal Server Error!" });
  }
};

// Add new slider
const addSlider = async (req, res) => {
  const data = req.body;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: "No file uploaded!" });
  }

  try {
    // Construct the image URL
    const image = `/images/sliders/${file.filename}`;

    const sliderData = {
      ...data,
      image,
    };

    const newSlider = new sliders(sliderData);
    await newSlider.save();

    return res.status(200).json({ message: "New Slider Added!" });
  } catch (error) {
    if (file?.path) {
      fs.unlink(file.path, (unlinkErr) => {
        if (unlinkErr)
          console.error("Error deleting uploaded image:", unlinkErr);
      });
    }
    console.error("Error adding slider:", error);
    return res.status(500).json({ message: "Internal Server Error!" });
  }
};

// Update slider
const updateSlider = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const file = req.file;

  try {
    const existingSlider = await sliders.findById(id).lean();

    if (!existingSlider) {
      return res.status(404).json({ message: "Slider not found!" });
    }

    let updatedImage = existingSlider?.image; // Keep the old image by default

    // Process the new image
    if (file) {
      updatedImage = `/images/sliders/${file.filename}`;

      // Delete the old image if it exists
      if (existingSlider?.image) {
        fs.unlink(`.${existingSlider?.image}`, (err) => {
          if (err?.code === "ENOENT") {
            console.warn("Old slider image not found for deletion.");
          } else if (err) {
            console.error("Error deleting old image file:", err);
          }
        });
      }
    }

    // Construct the update object
    const updatedDoc = {
      $set: {
        ...data,
        image: updatedImage,
        addedAt: new Date(),
      },
    };

    await sliders.findByIdAndUpdate(id, updatedDoc, {
      runValidators: true,
      new: true,
    });

    return res.status(200).json({ message: "Updated successfully!" });
  } catch (error) {
    if (file?.path) {
      fs.unlink(file.path, (unlinkErr) => {
        if (unlinkErr)
          console.error("Error deleting uploaded image:", unlinkErr);
      });
    }
    console.error("Error updating slider:", error);
    return res.status(500).json({ message: "Internal Server Error!" });
  }
};

// Delete a slider
const deleteSlider = async (req, res) => {
  const { id } = req.params;

  try {
    const sliderData = await sliders.findById(id).lean();

    if (!sliderData) {
      return res.status(404).json({ message: "Slider Not Found!" });
    }

    if (sliderData?.image) {
      // Deleting the old image file
      fs.unlink(`.${sliderData?.image}`, (err) => {
        if (err?.code === "ENOENT") {
          console.warn("Old slider image not found for deletion.");
        } else if (err) {
          console.error("Error deleting old image file:", err);
        }
      });
    }

    await sliders.findByIdAndDelete(id);
    return res.status(200).json({ message: "Successfully Deleted Slider!" });
  } catch (error) {
    console.error("Error deleting slider:", error);
    return res.status(500).json({ message: "Internal Server Error!" });
  }
};

module.exports = {
  getAllSlider,
  getSliderById,
  addSlider,
  updateSlider,
  deleteSlider,
};
