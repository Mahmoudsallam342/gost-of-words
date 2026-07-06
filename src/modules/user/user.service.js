import jwt from "jsonwebtoken";
import { findById, UserModel } from "../../DB/index.js";
import { TOKEN_SECRET_KEY } from "../../../config/config.service.js";

export const getProfile = async (authorization) => {
  const decode = await jwt.decode(authorization);
  const verifyData = jwt.verify(authorization, TOKEN_SECRET_KEY);
  const user = await findById({
    model: UserModel,
    id,
  });
  return user;
};
