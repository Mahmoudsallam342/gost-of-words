import { model } from "mongoose";
import {
  ProviderEnum,
  roleEnum,
  TokenTypeEnum,
} from "../../common/enum/index.js";
import { create, findOne, UserModel } from "../../DB/index.js";
import bcrypt, { hash } from "bcrypt";
import {
  ACCESS_EXPIRES_IN,
  ADMIN_REFRESH_TOKEN_SECRET_KEY,
  ADMIN_TOKEN_SECRET_KEY,
  CLIENT_IDS,
  REFRESH_EXPIRES_IN,
  SALT_ROUND,
  USER_REFRESH_TOKEN_SECRET_KEY,
  USER_TOKEN_SECRET_KEY,
} from "../../../config/config.service.js";
import {
  compareHash,
  generateHash,
  generateToken,
  decrypt,
  encrypt,
  ConflictException,
  NotFoundException,
  createLoginCredential,
  BadRequestException,
} from "../../common/utils/index.js";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
export const signup = async (inputs) => {
  const { username, email, password, phone } = inputs;
  const checkUserExist = await findOne({ model: UserModel, filter: { email } });
  if (checkUserExist) {
    return ConflictException({ message: "Email exist" });
  }
  const user = await create({
    model: UserModel,
    data: [
      {
        username,
        email,
        password: await generateHash(password),
        phone: await encrypt(phone),
        provider: ProviderEnum.System,
      },
    ],
  });
  return user;
};
export const login = async (inputs, issuer) => {
  const { email, password } = inputs;
  const user = await findOne({
    model: UserModel,
    filter: { email, provider: ProviderEnum.System },
  });

  if (!user) {
    return NotFoundException({ message: "invalid login credentials" });
  }
  const match = await compareHash(password, user.password);
  if (!match) {
    return NotFoundException({ message: "invalid email or password" });
  }
  // user.phone = await decrypt(user.phone);

  //! creating tokens
  console.log(user.role);

  return await createLoginCredential(user, issuer);
};
const verifyGoogleAccount = async (idToken) => {
  const client = new OAuth2Client();
  const ticket = await client.verifyIdToken({
    idToken,
    audience: CLIENT_IDS,
  });
  const payload = ticket.getPayload();
  console.log({ payload });
  if (!payload?.email_verified) {
    throw BadRequestException({
      message: "failed to verify this account with google",
    });
  }
  return payload;
};
export const signUpWithGmail = async ({ idToken }, issuer) => {
  const payload = await verifyGoogleAccount(idToken);
  console.log({ payload });

  const checkUserExist = await findOne({
    model: UserModel,
    filter: { email: payload.email },
  });
  if (checkUserExist) {
    if (checkUserExist.provider == ProviderEnum.System) {
      throw ConflictException({
        message: "account already exist with different provider",
      });
    }
    const account = await loginWithGmail({ idToken }, issuer);
    return { account, status: 200 };
  }
  const user = await create({
    model: UserModel,
    data: {
      firstName: payload.given_name,
      lastName: payload.family_name,
      email: payload.email,
      provider: ProviderEnum.Google,
      profilePic: payload.picture,
      confirmEmail: new Date(),
    },
  });
  // return { account: await createLoginCredential(user[0], issuer) };
  return { account: await createLoginCredential(user, issuer) };
};

export const loginWithGmail = async ({ idToken }, issuer) => {
  const payload = await verifyGoogleAccount(idToken);

  const user = await findOne({
    model: UserModel,
    filter: { email: payload.email, provider: ProviderEnum.Google },
  });
  if (!user?.provide != ProviderEnum.Google) {
    if (user.provider == ProviderEnum.System) {
      throw NotFoundException({ message: "invalid login credentials" });
    }
  }

  return await createLoginCredential(user, issuer);
};
