import { OMDB_API_KEY, OMDB_URL } from "../envVars.js";

/**
 * Function to compare between 2 and 5 movies
 * @param {import("fastify").FastifyRequest} request
 * @param {import("fastify").FastifyReply} reply
 */
export async function searchMovies(request, reply) {
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
