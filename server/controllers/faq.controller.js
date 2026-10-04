const faq = require("../models/faq.schema");

// Get all faq with optional filtering
const getAllFaq = async (req, res) => {
  const { category, currentPage, limitPerPage } = req.query;

  const query = {};

  if (category) {
    query.category = category;
  }
  const totalFaqs = await faq.countDocuments(query);
  const page = parseInt(currentPage) || 0;
  const limit = parseInt(limitPerPage) || totalFaqs;
  const skip = page * limit;

  try {
    const data = await faq
      .find(query)
      .sort({ addedAt: 1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return res.status(200).json({
      data,
      totalFaqs,
      hasMore: skip + data?.length < totalFaqs,
    });
  } catch (error) {
    console.log(error);
    return res.status(503).json({ message: "Internal Server Error!" });
  }
};

// Get a single faq by ID
const getFaqById = async (req, res) => {
  const { id } = req.params;

  try {
    const faqData = await faq.findById(id).lean();

    if (!faqData) {
      return res.status(404).json({ message: "Faq not found!" });
    }

    return res.status(200).json({ data: faqData });
  } catch (error) {
    console.error("Error fetching faq:", error);
    return res.status(500).json({ message: "Internal Server Error!" });
  }
};

// Add new faq
const addFaq = async (req, res) => {
  const data = req.body;

  try {
    const faqData = new faq(data);
    await faqData.save();

    return res.status(200).json({ message: "New Faq Added!" });
  } catch (error) {
    console.error("Error adding faq:", error);
    return res.status(500).json({ message: "Internal Server Error!" });
  }
};

// Update faq
const updateFaq = async (req, res) => {
  const { id } = req.params;
  const faqData = req.body;

  try {
    const existingFaq = await faq.findById(id).lean();

    if (!existingFaq) {
      return res.status(404).json({ message: "Faq not found!" });
    }

    const updatedDocs = {
      $set: {
        ...faqData,
      },
    };

    await faq.findByIdAndUpdate(id, updatedDocs, {
      runValidators: true,
      new: true,
    });

    return res.status(200).json({ message: "Updated successfully!" });
  } catch (error) {
    console.error("Error updating faq:", error);
    return res.status(500).json({ message: "Internal Server Error!" });
  }
};

// Delete a faq
const deleteFaq = async (req, res) => {
  const { id } = req.params;

  try {
    const faqData = await faq.findById(id).lean();

    if (!faqData) return res.status(404).json({ message: "Faq Not Found!" });

    await faq.findByIdAndDelete(id);
    return res.status(200).json({ message: "Successfully Deleted Faq!" });
  } catch (error) {
    console.error("Error deleting faq:", error);
    return res.status(500).json({ message: "Internal Server Error!" });
  }
};

module.exports = {
  getAllFaq,
  getFaqById,
  addFaq,
  updateFaq,
  deleteFaq,
};
