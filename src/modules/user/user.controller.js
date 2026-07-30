import { Router } from "express";
import {
  getProfile,
  logout,
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
router.post("/logout", authentication(), async (req, res, next) => {
  const status = await logout(req.body, req.user, req.decoded);
  return successResponse({ res, status });
});
router.get(
  "/",
  authentication(),
  authorization([roleEnum.User]),
  async (req, res, next) => {
    const account = await getProfile(req.user);
    return successResponse({ res, data: { account } });
  },
);
router.post(
  "/rotate",
  authentication(TokenTypeEnum.refresh),
  async (req, res, next) => {
    const credentials = await rotateToken(
      req.user,
      req.decoded,
      `${req.protocol}://${req.host}`,
    );
    return successResponse({ res, status: 201, data: { ...credentials } });
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
