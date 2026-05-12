import multer from "multer";

// Configure secure disk storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    // Generate a unique filename and preserve the original extension
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = file.originalname.split('.').pop();
    cb(null, `${file.fieldname}-${uniqueSuffix}.${ext}`);
  }
});

// File filter to ensure only images are uploaded
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Unsupported file format! Please upload an image."), false);
  }
};

// Initialize multer with limits and filters
const upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB limit
  },
  fileFilter 
});

export default upload;
