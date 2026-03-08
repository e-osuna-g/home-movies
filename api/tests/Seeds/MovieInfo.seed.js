import { movieInfo } from "../../src/db/movieComparison.js";
import { MockById } from "../Mocks/mocks.js";

export async function seed_all_movies_info() {
  let itemsToAdd = [];
  for (let i in MockById) {
    itemsToAdd.push({
      imdb_id: i,
      info: JSON.stringify(MockById[i]),
    });
  }
  let moviesResult = await movieInfo.bulkCreate(itemsToAdd);
  return moviesResult;
}

export async function seed_movies_info(ids) {
  let itemsToAdd = [];
  for (let id of ids) {
    itemsToAdd.push({
      imdb_id: id,
      info: JSON.stringify(MockById[id]),
    });
  }
  let moviesResult = await movieInfo.bulkCreate(itemsToAdd);
  return moviesResult;
}
