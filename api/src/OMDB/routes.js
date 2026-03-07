import { OMDB_API_KEY, OMDB_URL } from "../envVars.js";
import { compareMovies } from "./compare.js";
import { getMovies } from "./movies.js";
import { recentComparisons } from "./recentComparisons.js";
import { MockAgent, setGlobalDispatcher } from "undici";
/**
 * @param {FastifyInstance} fastify encapsulated fastify instance
 * @param {Object} options plugin options, refer to https://fastify.dev/docs/latest/Reference/Plugins/#plugin-options
 */
export async function routes(fastify, options) {
  fastify.get("/api/movie/:imdbId", getMovie);
  fastify.get(
    "/api/search",
    searchMovies,
  );

  fastify.get("/api/comparisons/recent", recentComparisons);
  fastify.post("/api/compare", compareMovies);
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
  if (query.type) {
    queryResponse.set("type", query.type);
  }
  if (query.y) {
    queryResponse.set("y", query.y);
  }
  if (query.page) {
    queryResponse.set("page", query.page);
  }

  const searchResponse = await fetch(
    `${OMDB_URL}/?${queryResponse.toString()}`,
  );
  const responseJson = await searchResponse.json();
  if (responseJson.Response == "False") {
    return reply.status(400).send(responseJson);
  }
  return responseJson;
}

async function getMovie(request, reply) {
  const query = request.params;

  if (!query.imdbId) {
    return reply.status(400).send({
      Response: "Error",
      Error: "Search parameter 'i' is required",
    });
  }
  if (
    !query.imdbId.startsWith("tt") ||
    !(query.imdbId.length >= 9 && query.imdbId.length <= 10)
  ) {
    return reply.status(400).send({
      Response: "False",
      Error: "Invalid IMDb ID format. Must be 'tt' followed by 7-8 digits",
    });
  }

  const movie = await getMovies([query.imdbId]);
  return movie[0];
}
