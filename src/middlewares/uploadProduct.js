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

const uploadProduct = multerUpload.single("image");

module.exports = uploadProduct;



// const multer = require("multer");
// const { failed } = require("../helper/common.js");

// const multerUpload = multer({
//   storage: multer.diskStorage({}),
//   fileFilter: (req, file, cb) => {
//     const fileSize = 2 * 1024 * 1024;
//     if (fileSize > maxSize) {
//       const error = {
//         message: "file size exceed 2 MB",
//       };
//       return cb(error, false);
//     }
//     if (
//       file.mimetype === "image/jpeg" ||
//       file.mimetype === "image/png" ||
//       file.mimetype === "image/jpg"
//     ) {
//       cb(null, true);
//     } else {
//       const error = {
//         message: "file must be jpeg, jpg or png",
//       };
//       cb(error, false);
//     }
//   },
// });

// const uploadProduct = (req, res, next) => {
//     const multerSingle = multerUpload("photo_product");
//     multerSingle(req, res, (err) => {
//         if (err) {
//             res.status(500).send ("failed to uploading file: " + err.message);
//         } else {
//             next();
//         }
//     });
// };

// module.exports = uploadProduct;

