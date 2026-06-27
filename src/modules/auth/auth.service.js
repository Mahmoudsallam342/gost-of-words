import { model } from "mongoose";
import { ProviderEnum } from "../../common/enum/index.js";
import {
  ConflictException,
  NotFoundException,
} from "../../common/utils/response/index.js";
import { create, findOne, UserModel } from "../../DB/index.js";

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
        { username, email, password, phone, provider: ProviderEnum.System },
      ],
    },
  ]);
  return user;
};
export const login = async (inputs) => {
  const { email, password } = inputs;
  const user = await findOne({
    model: UserModel,
    filter: { email, password, provider: ProviderEnum.System },
  });

  if (!user) {
    return NotFoundException({ message: "invalid login credentials" });
  }

  return user;
};
