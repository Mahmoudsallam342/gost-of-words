import { TokenTypeEnum } from "../../common/enum/index.js";
import {
  createLoginCredential,
  decodeToken,
} from "../../common/utils/index.js";

export const profileCoverImage = async (file, user) => {
  user.coverProfilePictures = file.finalPath;
  await user.save();
  return user;
};
export const profileImage = async (files, user) => {
  user.profilePicture = files.map((file) => file.finalPath);
  await user.save();
  return user;
};
export const getProfile = async (user) => {
  return user;
};
export const rotateToken = async (user, issuer) => {
  return createLoginCredential(user, issuer);
};
