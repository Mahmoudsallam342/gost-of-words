import { NODE_ENV, ORIGINS, port } from "../config/config.service.js";
import { connectDB, redisConnection } from "./DB/index.js";
import { authRouter, userRouter } from "./modules/index.js";
import express from "express";
import cors from "cors";
import { resolve } from "node:path";
import { sendEmail } from "./common/utils/index.js";

async function bootstrap() {
  const app = express();
  //convert buffer data
  //! IMPLEMENT PRODUCTION CORS
  // var corsOptions = {
  //   origin: function (origin, callback) {
  //     if (!ORIGINS.includes(origin)) {
  //       callback(
  //         new Error("Not authorized origin", { cause: { status: 403 } }),
  //         ORIGINS,
  //       );
  //     } else {
  //       callback(null, ORIGINS);
  //     }
  //   },
  // };

  // app.use(cors(corsOptions), express.json());
  app.use(cors(), express.json());
  app.use("uploads", express.static(resolve("../uploads/")));
  //DB
  await connectDB();
  await redisConnection();
  await sendEmail();
  //application routing
  app.get("/", (req, res) => res.send("Hello World!"));
  app.use("/auth", authRouter);
  app.use("/profile", userRouter);

  //invalid routing
  app.use("{/*dummy}", (req, res) => {
    return res.status(404).json({ message: "Invalid application routing" });
  });

  //error-handling
  app.use((error, req, res, next) => {
    const status = error.cause?.status ?? 500;
    return res.status(status).json({
      error_message:
        status == 500
          ? "something went wrong"
          : (error.message ?? "something went wrong"),
      stack: NODE_ENV == "development" ? error.stack : undefined,
    });
  });

  app.listen(port, () => console.log(`Example app listening on port ${port}!`));
}
export default bootstrap;
