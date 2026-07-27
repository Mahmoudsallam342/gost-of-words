import { Router } from "express";
import {
  getProfile,
  profileCoverImage,
  profileImage,
  rotateToken,
} from "./user.service.js";
import {
  fileFieldValidation,
  localFileUpload,
  successResponse,
} from "../../common/utils/index.js";
import {
  authentication,
  authorization,
  validation,
} from "../../middleware/index.js";
import { roleEnum, TokenTypeEnum } from "../../common/enum/index.js";
import * as validators from "../../common/utils/multer/index.js";
const router = Router();
router.get(
  "/",
  authentication(),
  authorization([roleEnum.User]),
  async (req, res, next) => {
    const account = await getProfile(req.user);
    return successResponse({ res, data: { account } });
  },
);
router.get(
  "/rotate",
  authentication(TokenTypeEnum.refresh),
  async (req, res, next) => {
    const account = await rotateToken(
      req.user,
      `${req.protocol}://${req.host}`,
    );
    return successResponse({ res, data: { account } });
  },
);
router.patch(
  "/profile-cover-image",
  authentication(),
  localFileUpload({
    customPath: "users/profile/cover",
    validation: fileFieldValidation.image,
    maxSize: 5,
  }).fields("attachments", 3),
  validation(validators.profileCoverImage),
  async (req, res, next) => {
    const account = await profileCoverImage(req.files, req.user);
    return successResponse({ res, data: { account } });
  },
);
router.patch(
  "/profile-image",
  authentication(),
  localFileUpload({
    customPath: "users/profile",
    validation: fileFieldValidation.image,
    maxSize: 5,
  }).single("attachment"),
  validation(validators.profileImage),
  async (req, res, next) => {
    const account = await profileImage(req.file, req.user);
    return successResponse({ res, data: { account } });
  },
);
export default router;
