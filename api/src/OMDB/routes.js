import { compareMovies } from "./compare.js";
import { getMovieRequest } from "./movie.js";
import { recentComparisons } from "./recentComparisons.js";
import { searchMovies } from "./searchMovies.js";

/**
 * @param {FastifyInstance} fastify encapsulated fastify instance
 * @param {Object} options plugin options, refer to https://fastify.dev/docs/latest/Reference/Plugins/#plugin-options
 */
export async function routes(fastify, options) {
  fastify.get("/api/movie/:imdbId", getMovieRequest);
  fastify.get(
    "/api/search",
    searchMovies,
  );

  fastify.get("/api/comparisons/recent", recentComparisons);
  fastify.post("/api/compare", compareMovies);
}
