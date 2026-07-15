import { Router } from "express";
import {
  login,
  loginWithGmail,
  signup,
  signUpWithGmail,
} from "./auth.service.js";
import { successResponse } from "../../common/utils/response/index.js";
const router = Router();
router.post("/signup", async (req, res, next) => {
  const account = await signup(req.body);
  return successResponse({ res, status: 201, data: { account } });
});
router.post("/login", async (req, res, next) => {
  const account = await login(req.body, `${req.protocol}://${req.host}`);
  return successResponse({ res, data: { account } });
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
