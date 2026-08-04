import jwt from "jsonwebtoken";
import {
  ACCESS_EXPIRES_IN,
  ADMIN_REFRESH_TOKEN_SECRET_KEY,
  ADMIN_TOKEN_SECRET_KEY,
  REFRESH_EXPIRES_IN,
  USER_REFRESH_TOKEN_SECRET_KEY,
  USER_TOKEN_SECRET_KEY,
} from "../../../../config/config.service.js";
import { AudienceEnum, roleEnum, TokenTypeEnum } from "../../enum/index.js";
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from "../response/error.response.js";
import { findOne, tokenModel, UserModel } from "../../../DB/index.js";
import { randomUUID } from "node:crypto";
export const generateToken = async ({
  payload = {},
  secret = USER_TOKEN_SECRET_KEY,
  options = {},
} = {}) => {
  return jwt.sign(payload, secret, options);
};
export const verifyToken = async ({
  token,
  secret = USER_TOKEN_SECRET_KEY,
} = {}) => {
  return jwt.verify(token, secret);
};
export const getTokenSignature = async (role) => {
  let accessSignature = undefined;
  let refreshSignature = undefined;
  let audience = AudienceEnum.User;
  switch (role) {
    case roleEnum.Admin:
      accessSignature = ADMIN_TOKEN_SECRET_KEY;
      refreshSignature = ADMIN_REFRESH_TOKEN_SECRET_KEY;
      audience = AudienceEnum.Admin;
      break;

    default:
      accessSignature = USER_TOKEN_SECRET_KEY;
      refreshSignature = USER_REFRESH_TOKEN_SECRET_KEY;
      audience = AudienceEnum.User;

      break;
  }
  return { accessSignature, refreshSignature, audience };
};
export const getSignatureLevel = async (audienceType) => {
  let signatureLevel = AudienceEnum.User;
  switch (audienceType) {
    case AudienceEnum.Admin:
      signatureLevel = roleEnum.Admin;
      break;

    default:
      signatureLevel = roleEnum.User;

      break;
  }
  //   return { accessSignature, refreshSignature, audience };
  return signatureLevel;
};

export const createLoginCredential = async (user) => {
  const { accessSignature, refreshSignature, audience } =
    await getTokenSignature(user.role);
  const jwtid = randomUUID();
  const access_token = await generateToken({
    payload: { sub: user._id },
    secret: accessSignature,
    options: {
      // issuer,
      audience: [TokenTypeEnum.access, audience], // access or refresh and admin or user
      expiresIn: ACCESS_EXPIRES_IN,
      jwtid,
    },
  });
  const refresh_token = await generateToken({
    payload: { sub: user._id },
    secret: refreshSignature,
    options: {
      // issuer,
      audience: [TokenTypeEnum.refresh, audience],
      expiresIn: REFRESH_EXPIRES_IN,
      jwtid,
    },
  });
  return { access_token, refresh_token };
};

export const decodeToken = async ({
  token,
  tokenType = TokenTypeEnum.access,
} = {}) => {
  const decoded = jwt.decode(token);
  // console.log({ decoded });

  if (!decoded?.aud?.length) {
    throw BadRequestException({
      message: "failed to decode this token aud is required",
    });
  }

  const [decodeTokenType, audienceType] = decoded.aud;

  if (decodeTokenType !== tokenType) {
    throw BadRequestException({
      message: `invalid token type ${decodeTokenType} cannot access this api while we expected token of type ${tokenType}`,
    });
  }
  if (
    decoded.jti &&
    (await findOne({ model: tokenModel, filter: { jti: decoded.jti } }))
  ) {
    throw UnauthorizedException({ message: "Invalid login session" });
  }

  const signatureLevel = await getSignatureLevel(audienceType);

  const { accessSignature, refreshSignature } =
    await getTokenSignature(signatureLevel);

  // console.log({ accessSignature, refreshSignature });

  const verifiedData = await verifyToken({
    token,
    secret:
      tokenType === TokenTypeEnum.refresh ? refreshSignature : accessSignature,
  });

  // console.log({ verifiedData });

  const user = await findOne({
    model: UserModel,
    filter: { _id: verifiedData.sub },
  });

  if (!user) {
    throw new UnauthorizedException({
      message: "not register user",
    });
  }

  if (
    user.changeCredentialsTime &&
    user.changeCredentialsTime.getTime() >= decoded.iat * 1000
  ) {
    throw UnauthorizedException({
      message: "Invalid login session",
    });
  }

  return {
    user,
    decoded,
  };
};
