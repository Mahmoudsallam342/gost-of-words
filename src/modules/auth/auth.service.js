import { model } from "mongoose";
import { ProviderEnum } from "../../common/enum/index.js";
import {
  ConflictException,
  NotFoundException,
} from "../../common/utils/response/index.js";
import { create, findOne, UserModel } from "../../DB/index.js";
import bcrypt, { hash } from "bcrypt";
import { SALT_ROUND } from "../../../config/config.service.js";
import { compareHash, generateHash } from "../../common/utils/index.js";
export const signup = async (inputs) => {
  const { username, email, password, phone } = inputs;
  const checkUserExist = await findOne({ model: UserModel, filter: { email } });
  if (checkUserExist) {
    return ConflictException({ message: "Email exist" });
  }
  const user = await create([
    {
      model: UserModel,
      data: [
        {
          username,
          email,
          password: await generateHash(password),
          phone,
          provider: ProviderEnum.System,
        },
      ],
    },
  ]);
  return user;
};
export const login = async (inputs) => {
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
  return user;
};
