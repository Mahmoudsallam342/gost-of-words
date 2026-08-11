import { createClient } from "redis";
import { REDIS_URI } from "../../config/config.service.js";

export const residClient = createClient({
  url: REDIS_URI,
});
export const redisConnection = async () => {
  try {
    await residClient.connect();
    console.log("redis_db is connected🚀");
  } catch (error) {
    console.log("redis_db is failed❌");
    console.error(error);
  }
};
