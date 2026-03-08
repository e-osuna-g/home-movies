import { buildFastify } from "./fastifyBuilder.js";
import { pino } from "./logger.js";
const fastify = await buildFastify();

try {
  await fastify.listen({ port: 3000 });
  pino.info("Listening on port 3000");
} catch (err) {
  pino.error(err, "Error while trying to bind to port 3000");
  process.exit(1);
}
