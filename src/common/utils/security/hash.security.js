import { hash, compare } from "bcrypt";
import { SALT_ROUND } from "../../../../config/config.service.js";
export const generateHash = async (plaintext, salt = SALT_ROUND) => {
  return await hash(plaintext, salt);
};
export const compareHash = async (plaintext, ciphertext) => {
  return await compare(plaintext, ciphertext);
};
