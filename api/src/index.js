import Fastify from "fastify";
import { routes as omdbRoutes } from "./OMDB/routes.js";
import cors from "@fastify/cors";

const fastify = Fastify({
  logger: true,
});

fastify.register(cors);
// Declare a route
fastify.get("/", async function handler(request, reply) {
  return { hello: "world" };
});
fastify.register(omdbRoutes);
// Run the server!
try {
  await fastify.listen({ port: 3000 });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
