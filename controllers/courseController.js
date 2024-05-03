const Course = require("../models/course");
const multer = require("multer");
const path = require("path");
const SubCategory = require("../models/subCategory");

const { PythonShell } = require("python-shell");

// exports.createCourse = async (req, res) => {
//   try {
//     const course = new Course(req.body);
//     await course.save();
//     res.status(201).json(course);
//   } catch (error) {
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

exports.createCourse = async (req, res) => {
  try {
    const { subCategoryId } = req.body;

    const course = new Course(req.body);

    await course.save();

    const subCategory = await SubCategory.findById(subCategoryId);
    if (!subCategory) {
      return res.status(404).json({ error: "SubCategory not found" });
    }
    subCategory.courses.push(course._id);
    await subCategory.save();

    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate("subCategoryId");
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.deleteCourseById = async (req, res) => {
  const { id } = req.params;

  try {
    const course = await Course.findByIdAndDelete(id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getCourseById = async (req, res) => {
  const { id } = req.params;

  try {
    const course = await Course.findById(id).populate("subCategoryId");

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateCourse = async (req, res) => {
  const { id } = req.params;

  try {
    const course = await Course.findByIdAndUpdate(id, req.body, { new: true });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const storage = multer.diskStorage({
  destination: path.join(__dirname, "../public"),
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
      const course = await Course.findById(id);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }

      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // Get the file name from the file path
      const fileName = req.file.filename;

      // Update the image field with the file name
      course.imageUrl = fileName;

      await course.save();

      res.json(course);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
};

exports.Sentiment = (req, res) => {
  // Specify the path to your Python script
  const pythonScriptPath = "courseScript.py";

  // Extract comment from the request
  const { comment } = req.body; // Assuming comment is sent in the request body

  // Specify options for the Python script execution
  const options = {
    pythonOptions: ["-u"], // unbuffered output
    scriptPath:
      "C:/Users/braie/OneDrive/Bureau/integrationPi/integration-v7/El-Kindy-Backend/controllers/", // path to the directory containing the Python script
    args: [comment], // Pass comment as command-line argument
  };

  // Create a new PythonShell instance with the specified options
  const pyShell = new PythonShell(pythonScriptPath, options);

  // Create a variable to store the message from the Python script
  let message = "";

  // Run the Python script
  pyShell.on("message", (msg) => {
    console.log("Received message from Python script:", msg);
    message += msg; // Append each message received from the Python script
  });

  pyShell.end((err) => {
    if (err) {
      console.error("Error during Python script execution:", err);
      // If there's an error, return the error message
      return res.status(500).json({ error: err.message });
    }
    console.log("Python script execution finished.");
    // If the script executed successfully, return the message
    return res.json({ message: message });
  });
};
