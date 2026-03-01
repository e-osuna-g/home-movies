import { OMDB_API_KEY, OMDB_URL } from "../envVars.js";
import cors from "@fastify/cors";

const compareMovieBodyJsonSchema = {
  type: "object",
  required: ["imdbIds"],
  properties: {
    imdbIds: {
      type: "array",
      items: {
        type: "string",
      },
      minItems: 2,
      maxItems: 5,
    },
  },
};
/**
 * A plugin that provide encapsulated routes
 * @param {FastifyInstance} fastify encapsulated fastify instance
 * @param {Object} options plugin options, refer to https://fastify.dev/docs/latest/Reference/Plugins/#plugin-options
 */
export async function routes(fastify, options) {
  fastify.get(
    "/api/search",
    { config: { cors: { origin: "*" } } },
    searchMovies,
  );

  fastify.get("/api/movie/:imdbId", getMovie);

  fastify.post("/api/compare", compareMovieBodyJsonSchema, compareMovies);
}

async function searchMovies(request, reply) {
  const query = request.query;
  let queryResponse = new URLSearchParams();
  queryResponse.set("apikey", OMDB_API_KEY);

  if (query.s) {
    queryResponse.set("s", query.s);
  } else {
    return reply.status(400).send({
      Response: "Error",
      Error: "Search parameter 's' is required",
    });
  }
  if (queryResponse.type) {
    queryResponse.set("type", query.type);
  }
  if (queryResponse.y) {
    queryResponse.set("y", query.y);
  }
  if (queryResponse.page) {
    queryResponse.set("page", query.page);
  }

  const searchResponse = await fetch(
    `${OMDB_URL}?${queryResponse.toString()}`,
  );
  const responseJson = await searchResponse.json();
  return responseJson;
}

async function getMovie(request, reply) {
  const query = request.params;
  let queryResponse = new URLSearchParams();
  queryResponse.set("apikey", OMDB_API_KEY);

  if (query.imdbId) {
    queryResponse.set("i", query.imdbId);
  } else {
    return reply.status(400).send({
      Response: "Error",
      Error: "Search parameter 'i' is required",
    });
  }

  const searchResponse = await fetch(
    `${OMDB_URL}?${queryResponse.toString()}`,
  );
  const responseJson = await searchResponse.json();
  return responseJson;
}
async function compareMovies() {
}
