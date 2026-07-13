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
} from "../../common/utils/index.js";

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
