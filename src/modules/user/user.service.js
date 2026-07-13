import { TokenTypeEnum } from "../../common/enum/index.js";
import {
  createLoginCredential,
  decodeToken,
} from "../../common/utils/index.js";

export const getProfile = async (user) => {
  // const verifiedData = await decodeToken({ token: authorization });

  return user;
};
export const rotateToken = async (user, issuer) => {
  return createLoginCredential(user, issuer);
};
