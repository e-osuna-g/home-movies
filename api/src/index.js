import { buildFastify } from "./fastifyBuilder.js";

const fastify = buildFastify();
// Run the server!
try {
  await fastify.listen({ port: 3000 });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
