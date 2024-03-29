const multer = require("multer");
const cloudinary = require("./claudinary")

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./src/temp/image"); // Specify the destination folder for uploaded files
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname); // Use a unique filename
  },
});

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg"];
  const maxSize = 2 * 1024 * 1024; // 2MB

  if (!allowedMimeTypes.includes(file.mimetype)) {
    const error = new Error("File must be jpeg, jpg, or png");
    error.status = 400;
    return cb(error, false);
  }

  if (file.size > maxSize) {
    const error = new Error("File size exceeds 2 MB");
    error.status = 400;
    return cb(error, false);
  }

  cb(null, true);
};

const multerUpload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

const uploadUser = multerUpload.single("image_profile");

const uploadToCloudinary = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new Error("No file uploaded"));
    }

    const result = await cloudinary.uploader.upload(req.file.path);
    req.file.cloudinaryUrl = result.secure_url;

    next();
  } catch (err) {
    next(err);
  }
};

const multerUpdateUserData = multer({
  storage: multer.diskStorage({}), // You can configure storage if needed
  fileFilter: (req, file, cb) => {
    // Add your file filter logic here if needed
    cb(null, true);
  },
}).none();  // This calls the none() method directly

module.exports = {
  multerUpdateUserData,
  uploadUser,
  uploadToCloudinary
};
