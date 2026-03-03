import { Op } from "sequelize";
import { movieInfo } from "../db/movieComparison.js";
import { OMDB_API_KEY, OMDB_URL } from "../envVars.js";
/**
 * @param {string[]} ids
 */
export async function getMovies(ids) {
  const moviesFound = await movieInfo.findAll({
    where: {
      imdb_id: {
        [Op.in]: ids,
      },
    },
  });
  //check wich ones we dont have
  const foundIds = new Set(moviesFound.map((movie) => movie.imdb_id));
  let toFetch = Array.from(new Set(ids).difference(foundIds));
  const values = await Promise.all(toFetch.map(fetchMovie));
  const itemsAdded = [];
  for (let [error, promiseItem] of values) {
    let response = await promiseItem;
    if (!error) {
      console.log("###movie fetched", response.imdbID);
      itemsAdded.push({
        imdb_id: response.imdbID,
        info: JSON.stringify(response),
      });
    }
  }
  movieInfo.bulkCreate(itemsAdded);
  return [
    ...moviesFound.map((movie) => movie.info),
    ...itemsAdded.map((i) => i.info),
  ];
}

/**
 * @param {string} imdbId
 */
export async function fetchMovie(imdbId) {
  let query = new URLSearchParams();
  query.set("apikey", OMDB_API_KEY);

  if (
    !imdbId.startsWith("tt") ||
    !(imdbId.length >= 9 && imdbId.length <= 10)
  ) {
    return [new Error("not valid id"), null];
  }

  query.set("i", imdbId);

  return fetch(
    `${OMDB_URL}?${query.toString()}`,
  ).then((response) => {
    return [null, response.json()];
  }).catch((e) => {
    return [new Error(e), null];
  });
}
