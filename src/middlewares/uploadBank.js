const multer = require("multer");

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

const uploadBank = multerUpload.single("photo_bank");

module.exports = uploadBank;

