import mongoose from "mongoose";
import { DB_URL } from "../../config/config.service.js";
import { UserModel } from "./model/user.model.js";

export const connectDB = async () => {
  try {
    const result = await mongoose.connect(DB_URL);
    await UserModel.syncIndexes();

    console.log("DB connected 🚀");
  } catch (error) {
    console.log("DB failed to connect ❌");
    console.error(error); // This is the important part
  }
};
