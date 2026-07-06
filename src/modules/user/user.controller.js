import { Router } from "express";
import { getProfile } from "./user.service.js";
import { successResponse } from "../../common/utils/index.js";

const router = Router();
router.get("/:userid", async (req, res, next) => {
  const profile = await getProfile(req.params.userid);
  return successResponse({ res, data: { profile } });
});
export default router;
