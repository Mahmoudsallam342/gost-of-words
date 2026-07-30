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
    const { authorization } = req.headers;
    const [flag, credential] = authorization.split(" ");
    if (!flag || !credential) {
      throw BadRequestException({ message: "missing authorization parts" });
    }
    switch (flag) {
      case "Basic":
        const data = Buffer.from(credential, "base64").toString();
        const [username, password] = data.split(":");
        console.log({ username, password });

        break;
      case "Bearer":
        const { user, decoded } = await decodeToken({
          token: credential,
          tokenType,
        });
        req.user = user;
        req.decoded = decoded;

        break;

      default:
        break;
    }

    next();
  };
};
export const authorization = (accessRoles = []) => {
  return async (req, res, next) => {
    if (!req.user) {
      throw ForbiddenException({
        message: "authentication required",
      });
    }

    if (!accessRoles.includes(req.user.role)) {
      throw ForbiddenException({
        message: "not allowed account",
      });
    }

    next();
  };
};
// export const authorization = (accessRoles = []) => {
//   return async (req, res, next) => {
//     if (!req.headers?.authorization) {
//       throw BadRequestException({ message: "missing authorization" });
//     }
//     const { authorization } = req.headers;
//     const [flag, credential] = authorization.split(" ");
//     if (!flag || !credential) {
//       throw BadRequestException({ message: "missing authorization parts" });
//     }
//     switch (flag) {
//       case "Basic":
//         const data = Buffer.from(credential, "base64").toString();
//         const [username, password] = data.split(":");
//         console.log({ username, password });

//         break;
//       case "Bearer":
//         req.user = await decodeToken({
//           token: credential,
//           tokenType,
//         });

//         break;

//       default:
//         break;
//     }
//     console.log(req.user.role);
//     if (!accessRoles.includes(req.user.role)) {
//       throw ForbiddenException({ message: "no allowed account" });
//     }
//     next();
//   };
// };
