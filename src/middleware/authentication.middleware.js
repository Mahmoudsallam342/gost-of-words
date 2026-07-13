import { TokenTypeEnum } from "../common/enum/index.js";
import { BadRequestException, decodeToken } from "../common/utils/index.js";

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

// import { TOKEN_SECRET_KEY } from "../../config/config.service.js";
// import jwt from "jsonwebtoken";
// export const authentication = () => {
//   return async (req, res, next) => {
//     req.user = await jwt.verify({
//       token: req.headers?.authorization,
//       TOKEN_SECRET_KEY,
//     });
//   };

//   next();
// };
// import jwt from "jsonwebtoken";
// import { USER_TOKEN_SECRET_KEY } from "../../config/config.service.js";
// ("../../config/config.service.js");

// export const authentication = () => {
//   return async (req, res, next) => {
//     try {
//       const token = req.headers.authorization;
//       console.log({ token });

//       if (!token) {
//         return res.status(401).json({
//           message: "Authorization token is required",
//         });
//       }

//       const decoded = jwt.verify(token, USER_TOKEN_SECRET_KEY);

//       req.user = decoded;

//       next();
//     } catch (error) {
//       return res.status(401).json({
//         message: "Invalid or expired token",
//       });
//     }
//   };
// };
// import jwt from "jsonwebtoken";
// import { USER_TOKEN_SECRET_KEY } from "../../config/config.service.js";
// import { TokenTypeEnum } from "../common/enum/security.enum.js";
// import { decodeToken } from "../common/utils/index.js";

// export const authentication = () => {
//   return async (req, res, next) => {
//     try {
//       const authHeader = req.headers.authorization;

//       if (!authHeader) {
//         return res.status(401).json({
//           message: "Authorization token is required",
//         });
//       }

//       // support both "Bearer <token>" and a raw token value
//       const token = authHeader.startsWith("Bearer ")
//         ? authHeader.split(" ")[1]
//         : authHeader;

//       if (!token) {
//         return res.status(401).json({
//           message: "Authorization token is required",
//         });
//       }

//       const decoded = jwt.verify(token, USER_TOKEN_SECRET_KEY);

//       req.user = decoded;

//       next();
//     } catch (error) {
//       console.log(error); // temporarily log this to see if it's TokenExpiredError or JsonWebTokenError
//       return res.status(401).json({
//         message: "Invalid or expired token",
//       });
//     }
//   };
// };
