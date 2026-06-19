const catchAsync = require("../utils/catchAsync");
const { success } = require("../utils/apiResponse");
const { uploadFromBuffer } = require("../config/cloudinary");
const ApiError = require("../utils/ApiError");

const uploadImage = catchAsync(async (req, res) => {
  if (!req.file) throw ApiError.badRequest("No image file provided");
  const result = await uploadFromBuffer(req.file.buffer, "college-kampus");
  success(res, 201, { url: result.secure_url, publicId: result.public_id });
});

module.exports = { uploadImage };
