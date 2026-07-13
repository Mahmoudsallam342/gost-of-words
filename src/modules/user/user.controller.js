import { Router } from "express";
import { getProfile, rotateToken } from "./user.service.js";
import { successResponse } from "../../common/utils/index.js";
import { authentication } from "../../middleware/index.js";
import { TokenTypeEnum } from "../../common/enum/security.enum.js";

const router = Router();
router.get("/", authentication(), async (req, res, next) => {
  const account = await getProfile(req.user);
  return successResponse({ res, data: { account } });
});
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
