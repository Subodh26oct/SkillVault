import multer from "multer";
import path from "path";

// Configure secure disk storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    // Generate a unique filename and preserve the original extension
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

// File filter — accept images (thumbnails) AND videos (lectures)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/")) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Unsupported file format! Only image and video files are allowed."
      ),
      false
    );
  }
};

// Initialize multer with limits and filters
// Videos can be much larger — allow up to 500 MB
const upload = multer({
  storage,
  limits: {
    fileSize: 500 * 1024 * 1024, // 500 MB (Cloudinary handles the actual upload)
  },
  fileFilter,
});

export default upload;
