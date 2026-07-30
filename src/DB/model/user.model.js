import mongoose from "mongoose";
import { GenderEnum, ProviderEnum, roleEnum } from "../../common/enum/index.js";
const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String },
    email: { type: String, required: true, unique: true },
    password: {
      type: String,
      required: function () {
        return this.provider == ProviderEnum.System;
      },
    },
    DOB: Date,
    phone: String,
    gender: {
      type: Number,
      enum: Object.values(GenderEnum),
      default: GenderEnum.Male,
    },
    confirmEmail: Date,
    provider: {
      type: Number,
      enum: Object.values(ProviderEnum),
      default: ProviderEnum.System,
    },
    role: {
      type: Number,
      enum: Object.values(roleEnum),
      default: roleEnum.User,
    },

    profilePicture: String,
    coverProfilePictures: [String],
    changeCredentialsTime: Date, //time of signout of all devices
  },
  {
    collection: "Route_users",
    timestamps: true,
    strict: true, // insert data only from schema
    strictQuery: true, //can search only on schema
  },
);
// concatinate username
userSchema
  .virtual("username")
  .set(function (value) {
    const [firstName, lastName] = value?.split(" ") || [];
    this.set({ firstName, lastName });
  })
  .get(function () {
    return this.firstName + " " + this.lastName;
  });
export const UserModel =
  mongoose.models.User || mongoose.model("User", userSchema);
