import {
  ACCESS_EXPIRES_IN,
  REFRESH_EXPIRES_IN,
} from "../../../config/config.service.js";
import { LogoutEnum, TokenTypeEnum } from "../../common/enum/index.js";
import {
  ConflictException,
  createLoginCredential,
  decodeToken,
} from "../../common/utils/index.js";
import { createOne, deleteMany } from "../../DB/database.service.js";
import { tokenModel } from "../../DB/index.js";

export const logout = async ({ flag }, user, { jti, iat }) => {
  let status = 200;
  switch (flag) {
    case LogoutEnum.all:
      user.changeCredentialsTime = new Date();
      await user.save();
      await deleteMany({ model: tokenModel, filter: { userId: user.id } });
      break;

    default:
      await createOne({
        model: tokenModel,
        data: {
          userId: user._id,
          jti,
          expiresIn: new Date((iat + REFRESH_EXPIRES_IN) * 1000),
        },
      });
      status = 201;
      break;
  }
  user.changeCredentialsTime = new Date();
  await user.save();
  return status;
};
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
export const rotateToken = async (user, { jti, iat }, issuer) => {
  if ((iat + ACCESS_EXPIRES_IN) * 1000 >= Date.now() + 30000) {
    throw ConflictException({ message: "Current access token still valid" });
  }
  await createOne({
    model: tokenModel,
    data: {
      userId: user._id,
      jti,
      expiresIn: new Date((iat + REFRESH_EXPIRES_IN) * 1000),
    },
  });
  return createLoginCredential(user, issuer);
};
