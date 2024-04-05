const Category = require("../models/category");
const multer = require("multer");
const path = require("path");

exports.createCategory = async (req, res) => {
  try {
    const category = new Category(req.body);
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().populate("subCategories");
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.deleteCategoryById = async (req, res) => {
  const { id } = req.params;

  try {
    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getCategoryById = async (req, res) => {
  const { id } = req.params;

  try {
    const category = await Category.findById(id).populate("subCategories");

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const category = await Category.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const storage = multer.diskStorage({
  destination: path.join(__dirname, "../public/uploads"),
  filename: function (req, file, cb) {
    cb(null, "image-" + Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  // Vérifiez ici le type de fichier, par exemple, si c'est une image
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only images are allowed."), false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter }).single(
  "image"
);

exports.uploadImage = (req, res) => {
  const { id } = req.params;

  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }

    try {
      const category = await Category.findById(id);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }

      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // Get the file name from the file path
      const fileName = req.file.filename;

      // Update the image field with the file name
      category.imageUrl = fileName;

      await category.save();

      res.json(category);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
};
