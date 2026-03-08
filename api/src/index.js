import { buildFastify } from "./fastifyBuilder.js";

const fastify = await buildFastify();

try {
  await fastify.listen({ port: 3000 });
} catch (err) {
  console.log("Error on start", err);
  process.exit(1);
}
