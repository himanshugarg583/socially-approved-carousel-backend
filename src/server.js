import { createApp } from "./app.js";
import { config } from "./config/env.js";
import { verifyConnection, closePool } from "./config/db.js";

async function bootstrap() {
  await verifyConnection();

  const app = createApp();
  const server = app.listen(config.port, () => {
    console.log(`API ready on http://localhost:${config.port} [${config.env}]`);
  });

  const shutdown = async (signal) => {
    console.log(`${signal} received, shutting down`);
    server.close(async () => {
      await closePool();
      process.exit(0);
    });
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}

bootstrap().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
