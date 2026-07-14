import { TokenTypeEnum } from "../common/enum/index.js";
import {
  BadRequestException,
  decodeToken,
  ForbiddenException,
} from "../common/utils/index.js";

export const authentication = (tokenType = TokenTypeEnum.access) => {
  return async (req, res, next) => {
    if (!req.headers?.authorization) {
      throw BadRequestException({ message: "missing authorization" });
    }
    req.user = await decodeToken({
      token: req.headers?.authorization,
      tokenType,
    });
    next();
  };
};
export const authorization = (accessRoles = []) => {
  return async (req, res, next) => {
    if (!req.headers?.authorization) {
      throw BadRequestException({ message: "missing authorization" });
    }
    req.user = await decodeToken({
      token: req.headers?.authorization,
      tokenType,
    });
    console.log(req.user.role);
    if (!accessRoles.includes(req.user.role)) {
      throw ForbiddenException({ message: "no allowed account" });
    }
    next();
  };
};
