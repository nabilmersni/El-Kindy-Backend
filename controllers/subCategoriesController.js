const SubCategory = require("../models/subCategory");
const Category = require("../models/category");
const multer = require("multer");
const path = require("path");
const Course = require("../models/course");

exports.createSubCategory = async (req, res) => {
  try {
    const { categoryId } = req.body; // Récupérez l'ID de la catégorie parente de req.body

    // Créez la sous-catégorie avec les données fournies dans le corps de la requête
    const subCategory = new SubCategory(req.body);
    await subCategory.save();

    // Ajoutez l'ID de la sous-catégorie à la liste des sous-catégories de la catégorie parente
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ error: "Parent category not found" });
    }
    category.subCategories.push(subCategory._id);
    await category.save();

    res.status(201).json(subCategory);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getAllSubCategories = async (req, res) => {
  try {
    const subCategories = await SubCategory.find().populate("categoryId");
    res.status(200).json(subCategories);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.deleteSubCategoryById = async (req, res) => {
  const { id } = req.params;

  try {
    const subCategory = await SubCategory.findByIdAndDelete(id);

    if (!subCategory) {
      return res.status(404).json({ message: "subCategory not found" });
    }

    res.status(200).json({ message: "subCategory deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getSubCategoryById = async (req, res) => {
  const { id } = req.params;

  try {
    const subCategory = await SubCategory.findById(id).populate("categoryId");

    if (!subCategory) {
      return res.status(404).json({ message: "subCategory not found" });
    }

    res.status(200).json(subCategory);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateSubCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const subCategory = await SubCategory.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!subCategory) {
      return res.status(404).json({ message: "subCategory not found" });
    }

    res.status(200).json(subCategory);
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
      const subCategory = await SubCategory.findById(id);
      if (!subCategory) {
        return res.status(404).json({ message: "SubCategory not found" });
      }

      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // Get the file name from the file path
      const fileName = req.file.filename;

      // Update the image field with the file name
      subCategory.imageUrl = fileName;

      await subCategory.save();

      res.json(subCategory);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
};

/********************video upload */
const storageVideo = multer.diskStorage({
  destination: path.join(__dirname, "../public/uploads"),
  filename: function (req, file, cb) {
    cb(null, "video-" + Date.now() + path.extname(file.originalname));
  },
});

const fileFilterVideo = (req, file, cb) => {
  // Vérifiez ici le type de fichier, par exemple, si c'est une vidéo
  if (file.mimetype.startsWith("video/")) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only videos are allowed."), false);
  }
};

const uploadVideo = multer({
  storage: storageVideo,
  fileFilter: fileFilterVideo,
}).single("video");

exports.uploadVideo = (req, res) => {
  const { id } = req.params;

  uploadVideo(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }

    try {
      const subCategory = await SubCategory.findById(id);
      if (!subCategory) {
        return res.status(404).json({ message: "SubCategory not found" });
      }

      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // Get the file name from the file path
      const fileName = req.file.filename;

      // Update the videoUrl field with the file name
      subCategory.videoUrl = fileName;

      await subCategory.save();

      res.json(subCategory);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
};

exports.getCoursesBySubCategoryId = async (req, res) => {
  const { id } = req.params;

  try {
    const subCategory = await SubCategory.findById(id);

    if (!subCategory) {
      return res.status(404).json({ message: "SubCategory not found" });
    }

    const courses = await Course.find({ subCategoryId: subCategory._id });

    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
