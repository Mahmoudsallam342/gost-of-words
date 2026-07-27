export const fileFieldValidation = {
  image: [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/svg+xml",
  ],
  video: [
    "video/mp4",
    "video/mpeg",
    "video/quicktime",
    "video/webm",
    "video/x-msvideo",
  ],
};
export const fileFilter = (validation = []) => {
  return function (req, file, cb) {
    if (!validation.includes(file.mimetype)) {
      return cb(
        new Error("Invalid file format", { cause: { status: 400 } }),
        false,
      );
    }

    return cb(null, true);
  };
};
