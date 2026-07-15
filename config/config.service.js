import { resolve } from "node:path";
import { config } from "dotenv";

export const NODE_ENV = process.env.NODE_ENV;

const envPath = {
  development: `.env.development`,
  production: `.env.production`,
};
console.log({ en: envPath[NODE_ENV] });

config({ path: resolve(`./config/${envPath[NODE_ENV]}`) });

export const port = process.env.PORT ?? 7000;

export const DB_HOST = process.env.DB_HOST ?? "127.0.0.1";
export const DB_PORT = process.env.DB_PORT ?? 3306;
export const DB_PASSWORD = process.env.DB_PASSWORD ?? "";
export const DB_USER = process.env.DB_USER ?? "root";
export const DB_NAME = process.env.DB_NAME ?? "test";
export const DB_URL = process.env.DB_URL;
export const ENC_BYTE = process.env.ENC_BYTE;
export const ADMIN_TOKEN_SECRET_KEY = process.env.ADMIN_TOKEN_SECRET_KEY;
export const ADMIN_REFRESH_TOKEN_SECRET_KEY =
  process.env.ADMIN_REFRESH_TOKEN_SECRET_KEY;
export const USER_TOKEN_SECRET_KEY = process.env.USER_TOKEN_SECRET_KEY;
export const USER_REFRESH_TOKEN_SECRET_KEY =
  process.env.USER_REFRESH_TOKEN_SECRET_KEY;
export const ACCESS_EXPIRES_IN = process.env.ACCESS_EXPIRES_IN;
export const REFRESH_EXPIRES_IN = process.env.REFRESH_EXPIRES_IN;
export const CLIENT_IDS = process.env.CLIENT_IDS?.split(",") || [];

export const SALT_ROUND = parseInt(process.env.SALT_ROUND ?? "10");
console.log({ SALT_ROUND });
