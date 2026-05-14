import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import path from "path";
dotenv.config({});

cloudinary.config({
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
});

if (
  !process.env.CLOUDINARY_API_KEY ||
  !process.env.CLOUDINARY_API_SECRET ||
  !process.env.CLOUDINARY_CLOUD_NAME
) {
  throw new Error(
    "Missing required Cloudinary environment variables: CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_CLOUD_NAME"
  );
}

export const uploadMedia = async (file) => {
  const videoExtensions = new Set([".mp4", ".mov", ".avi", ".mkv", ".webm", ".m4v"]);
  const isVideo = videoExtensions.has(path.extname(file).toLowerCase());
  const uploadOptions = {
    resource_type: isVideo ? "video" : "auto",
    timeout: 300000,
  };

  const uploadResponse = isVideo
    ? await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_large(
          file,
          {
            ...uploadOptions,
            chunk_size: 20 * 1024 * 1024,
          },
          (error, result) => {
            if (error) {
              reject(error);
              return;
            }
            if (result?.done === false) {
              return;
            }
            resolve(result);
          }
        );

        stream.on("error", reject);
      })
    : await cloudinary.uploader.upload(file, uploadOptions);

  return uploadResponse;
};

export const deleteMediaFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("[Cloudinary] deleteMedia error:", error.message);
  }
};

export const deleteVideoFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: "video" });
  } catch (error) {
    console.error("[Cloudinary] deleteVideo error:", error.message);
  }
};
