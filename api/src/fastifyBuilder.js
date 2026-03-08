import Fastify from "fastify";
import { routes as omdbRoutes } from "./OMDB/routes.js";
import cors from "@fastify/cors";

export async function buildFastify() {
  const fastify = Fastify({
    logger: true, // Logger for fastify by deafult is `pino`
  });

  fastify.register(cors);
  fastify.get("/", async function handler(request, reply) {
    return { hello: "world" };
  });
  fastify.register(omdbRoutes);

  return fastify;
}
