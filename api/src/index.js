import { SERVER_PORT } from "./envVars.js";
import { buildFastify } from "./fastifyBuilder.js";
import { pino } from "./logger.js";
const fastify = await buildFastify();

try {
  await fastify.listen({ port: SERVER_PORT });
  pino.info("Listening on port:" + SERVER_PORT);
} catch (err) {
  pino.error(err, "Error while trying to bind to port" + SERVER_PORT);
  process.exit(1);
}
