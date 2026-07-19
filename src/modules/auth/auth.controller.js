import { Router } from "express";
import {
  login,
  loginWithGmail,
  signup,
  signUpWithGmail,
} from "./auth.service.js";
import { successResponse } from "../../common/utils/response/index.js";
import * as validators from "./auth.validation.js";
import { validation } from "../../middleware/index.js";
const router = Router();

router.post(
  "/signup",
  validation(validators.signup),
  async (req, res, next) => {
    const account = await signup(req.body);
    return successResponse({ res, status: 201, data: { account } });
  },
);

router.post("/login", validation(validators.login), async (req, res, next) => {
  const credentials = await login(req.body, `${req.protocol}://${req.host}`);
  return successResponse({ res, data: { credentials } });
});
router.post("/signup/gmail", async (req, res, next) => {
  console.log(req.body);
  const { account, status = 201 } = await signUpWithGmail(
    req.body,
    `${req.protocol}://${req.host}`,
  );
  return successResponse({ res, status, data: { account } });
});
router.post("/login/gmail", async (req, res, next) => {
  console.log(req.body);
  const account = await loginWithGmail(
    req.body,
    `${req.protocol}://${req.host}`,
  );
  return successResponse({ res, status: 200, data: { account } });
});

export default router;
