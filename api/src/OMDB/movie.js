import { getMovies } from "./movies.js";

/**
 * Function to compare between 2 and 5 movies
 * @param {import("fastify").FastifyRequest} request
 * @param {import("fastify").FastifyReply} reply
 */
export async function getMovieRequest(request, reply) {
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
