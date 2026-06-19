const cloudinary = require("cloudinary").v2;
const {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} = require("./env");

const isConfigured =
  Boolean(CLOUDINARY_CLOUD_NAME) &&
  Boolean(CLOUDINARY_API_KEY) &&
  Boolean(CLOUDINARY_API_SECRET);

if (isConfigured) {
  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
    secure: true,
  });
} else {
  // Warn at startup — uploads will return 503 until vars are set
  console.warn(
    "[cloudinary] CLOUDINARY_CLOUD_NAME / API_KEY / API_SECRET not set. " +
    "Image upload endpoints will return 503."
  );
}

function uploadFromBuffer(buffer, folder = "college-kampus") {
  if (!isConfigured) {
    return Promise.reject(
      Object.assign(new Error("Cloudinary is not configured on this server"), {
        statusCode: 503,
      })
    );
  }
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image" },
      (err, result) => (err ? reject(err) : resolve(result))
    );
    stream.end(buffer);
  });
}

async function destroyImage(publicId) {
  if (!isConfigured) return null;
  return cloudinary.uploader.destroy(publicId);
}

module.exports = { cloudinary, uploadFromBuffer, destroyImage, isConfigured };
