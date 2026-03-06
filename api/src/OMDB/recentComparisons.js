import {
  movieComparison,
  movieComparisonItems,
  movieInfo,
} from "../db/movieComparison.js";

import { Op } from "sequelize";
import { getMovies } from "./movies.js";
/**
 * Function to compare between 2 and 5 movies
 * @param {import("fastify").FastifyRequest} request
 * @param {import("fastify").FastifyReply} reply
 */
export async function recentComparisons(request, reply) {
  const findAll = await movieComparison.findAll(
    {
      attributes: ["id", "created_at"],
      order: [
        ["created_at", "DESC"],
      ],
      limit: 10,
      include: [{
        model: movieComparisonItems,
        attributes: ["imdb_id"],
      }],
    },
  );
  if (findAll.length === 0) {
    return reply.status(200).send([]);
  }
  let ids = findAll.map((mc) => mc.movie_comparison_items).flat().map((items) =>
    items.dataValues.imdb_id
  );
  const moviesInfo = await getMovies(ids);
  const response = [];
  return reply.status(200).send(findAll.map((movieComp) => {
    const ids = movieComp.dataValues.movie_comparison_items.map((i) =>
      i.imdb_id
    );
    const titles = ids.map((id) =>
      moviesInfo.find((info) => info.imdbID == id).Title
    );
    console.log(movieComp);
    return {
      imdbIds: ids,
      Titles: titles,
      movieCount: ids.length,
      comparedAt: movieComp.dataValues.created_at,
      id: movieComp.dataValues.id,
    };
  }));
}
