import { Router } from "express";
import { getProfile, rotateToken } from "./user.service.js";
import { successResponse } from "../../common/utils/index.js";
import { authentication, authorization } from "../../middleware/index.js";
import { roleEnum, TokenTypeEnum } from "../../common/enum/index.js";

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
export default router;
