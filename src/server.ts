/* eslint-disable no-console */
import { Server } from "http";
import mongoose from "mongoose";
import { envVars } from "./app/config/env";
import app from "./app";
import { seedSuperAdmin } from "./app/utils/seedSuperAdmin";
import { connectRedis } from "./app/config/redis.config";

let server: Server;

const startServer = async () => {
  try {
    await mongoose.connect(envVars.DB_URL);
    console.log("Connect to DB!!");
    server = app.listen(envVars.PORT, () => {
      console.log(`App listen successfully on port ${envVars.PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};
//IFI
(async () => {
 await connectRedis()
 await startServer();
 await seedSuperAdmin();
})();

//SIGTERM handling others server shurt down
process.on("SIGTERM", () => {
  console.log("SIGTERM signal recieved... Server shurtting down...");

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});
//SIGINT manually handling for server shurt down
process.on("SIGINT", () => {
  console.log("SIG INT signal recieved... Server shurtting down...");

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

//4 types of server error handling below
//unhandledRejection error handling
process.on("unhandledRejection", (err) => {
  console.log("Unhandled Rejection detected... Server shurtting down...", err);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

//uncaughtException erro handling
process.on("uncaughtException", (err) => {
  console.log("uncaught exception detected... Server shurtting down...", err);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

// Promise.reject(new Error("I forgot to catch this promise "));

// throw new Error("I forgot to handle this local errror ")
