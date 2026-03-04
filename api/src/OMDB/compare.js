import {
  movieComparison,
  movieComparisonItems,
} from "../db/movieComparison.js";
import { getMovies } from "./movies.js";

const currencyFormat = {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
};
/**
 * Function to compare between 2 and 5 movies
 * @param {import("fastify").FastifyRequest} request
 * @param {import("fastify").FastifyReply} reply
 */
export async function compareMovies(request, reply) {
  const imdbIds = request.body.imdbIds;
  const valid = validateBody(request);
  if (valid.error) {
    return reply.status(valid.status).send(valid.error);
  }

  const responses = await getMovies(imdbIds);
  const movies = [];
  const ratings = { distribution: [] };
  const boxOffice = { distribution: [] };
  const releaseYears = { timeline: [] };
  const runtime = { distribution: [] };
  const metascore = { distribution: [] };
  const directors = new Set();
  const actors = [];
  const genres = [];
  for (let movie of responses) {
    movies.push(movieSummary(movie));
    if (typeof movie.Actors == "string") {
      actors.push(new Set(movie.Actors.split(",").map((i) => i.trim())));
    }
    if (typeof movie.Genre == "string") {
      genres.push(new Set(movie.Genre.split(",").map((i) => i.trim())));
    }
    if (typeof movie.Director == "string") {
      for (let item of movie.Director.split(",")) directors.add(item);
    }
    ratings.distribution.push({
      imdbId: movie.imdbID,
      rating: movie.imdbRating,
    });
    boxOffice.distribution.push({
      imdbId: movie.imdbID,
      boxOffice: movie.BoxOffice,
    });
    releaseYears.timeline.push({
      imdbId: movie.imdbID,
      year: movie.Year,
    });
    runtime.distribution.push({
      imdbId: movie.imdbID,
      runtime: movie.Runtime,
    });
    metascore.distribution.push({
      imdbId: movie.imdbID,
      metascore: movie.Metascore,
    });
  }
  const commonActors = new Set();

  for (let i = 0; i < actors.length - 1; i++) {
    for (let o = i + 1; o < actors.length; o++) {
      const intersection = actors[i].intersection(actors[o]).values();
      for (let item of intersection) commonActors.add(item);
    }
  }
  const commonGenres = new Set();
  for (let i = 0; i < genres.length - 1; i++) {
    for (let o = i + 1; o < genres.length; o++) {
      const intersection = genres[i].intersection(genres[o]).values();
      for (let item of intersection) commonGenres.add(item);
    }
  }
  let ratingAverage = 0;
  let highestRating = -1;
  let highestRatingIndex = null;
  let lowerRating = Infinity;
  let lowerRatingIndex = null;
  let boxOfficeCount = {
    highBoxOffice: -1,
    highBoxOfficeIndex: null,
    lowBoxOffice: Infinity,
    lowBoxOfficeIndex: null,
    total: 0,
    count: 0,
  };
  let releaseYearsCount = {
    highest: -1,
    highestIndex: null,
    lowest: Infinity,
    lowestIndex: null,
  };
  let runtimeCount = {
    highest: -1,
    highestIndex: null,
    lowest: Infinity,
    lowestIndex: null,
    total: 0,
  };
  let metascoreCount = {
    highest: -1,
    highestIndex: null,
    lowest: Infinity,
    lowestIndex: null,
    total: 0,
    count: 0,
  };
  for (let i = 0; i < ratings.distribution.length; i++) {
    //ratings
    const currentRating = Number(ratings.distribution[i].rating);
    if (currentRating > highestRating) {
      highestRating = currentRating;
      highestRatingIndex = i;
    }
    if (currentRating < lowerRating) {
      lowerRating = currentRating;
      lowerRatingIndex = i;
    }
    ratingAverage += currentRating;
    //endratings
    /** BoxOffice */
    if (
      boxOffice.distribution[i].boxOffice &&
      boxOffice.distribution[i].boxOffice != "N/A"
    ) {
      boxOfficeCount.count++;
      const boxOfficeTotal = Number(
        boxOffice.distribution[i].boxOffice.substring(1).replaceAll(",", ""),
      );
      boxOfficeCount.total += boxOfficeTotal;
      if (boxOfficeTotal > boxOfficeCount.highBoxOffice) {
        boxOfficeCount.highBoxOffice = boxOfficeTotal;
        boxOfficeCount.highBoxOfficeIndex = i;
      }
      if (boxOfficeTotal < boxOfficeCount.lowBoxOffice) {
        boxOfficeCount.lowBoxOffice = boxOfficeTotal;
        boxOfficeCount.lowBoxOfficeIndex = i;
      }
    }
    /**BoxOfficeEnds */
    /** releaseYears  */

    const curentYear = Number(releaseYears.timeline[i].year);
    if (curentYear > releaseYearsCount.highest) {
      releaseYearsCount.highest = curentYear;
      releaseYearsCount.highestIndex = i;
    }
    if (curentYear < releaseYearsCount.lowest) {
      releaseYearsCount.lowest = curentYear;
      releaseYearsCount.lowestIndex = i;
    }
    /** releaseYears Ends */

    /** Runtime */
    const runTimeTotal = Number(
      runtime.distribution[i].runtime.split(" ")[0],
    );
    runtimeCount.total += runTimeTotal;
    if (runTimeTotal > runtimeCount.highest) {
      runtimeCount.highest = runTimeTotal;
      runtimeCount.highestIndex = i;
    }
    if (runTimeTotal < runtimeCount.lowest) {
      runtimeCount.lowest = runTimeTotal;
      runtimeCount.lowestIndex = i;
    }

    /** Runtime Ends */

    /** Metascore */
    if (
      metascore.distribution[i].metascore &&
      Number(metascore.distribution[i].metascore) >= 0
    ) {
      metascoreCount.count++;
      const metascoreTotal = Number(
        metascore.distribution[i].metascore,
      );
      metascoreCount.total += metascoreTotal;
      if (metascoreTotal > metascoreCount.highest) {
        metascoreCount.highest = metascoreTotal;
        metascoreCount.highestIndex = i;
      }
      if (metascoreTotal < metascoreCount.lowest) {
        metascoreCount.lowest = metascoreTotal;
        metascoreCount.lowestIndex = i;
      }
    }

    /** Metascore Ends */
  }

  ratingAverage = (ratingAverage / ratings.distribution.length).toFixed(2)
    .toString();
  ratings.average = ratingAverage;
  ratings.highest = {
    imdbId: ratings.distribution[highestRatingIndex].imdbId,
    title: movies.find((i) =>
      i.imdbID == ratings.distribution[highestRatingIndex].imdbId
    ),
    rating: ratings.distribution[highestRatingIndex].rating,
  };
  ratings.lowest = {
    imdbId: ratings.distribution[lowerRatingIndex].imdbId,
    title: movies.find((i) =>
      i.imdbID == ratings.distribution[lowerRatingIndex].imdbId
    ),
    rating: ratings.distribution[lowerRatingIndex].rating,
  };
  ratings.range =
    (Number(ratings.highest.rating) - Number(ratings.lowest.rating))
      .toString();

  boxOffice.total = boxOfficeCount.total.toLocaleString(
    "en-US",
    currencyFormat,
  );
  boxOffice.average = (boxOfficeCount.total / boxOfficeCount.count)
    .toLocaleString("en-US", currencyFormat);
  boxOffice.available = boxOfficeCount.count;
  const highBoxOffice =
    boxOffice.distribution[boxOfficeCount.highBoxOfficeIndex];
  const lowBoxOffice = boxOffice.distribution[boxOfficeCount.lowBoxOfficeIndex];
  boxOffice.highest = {
    imdbId: highBoxOffice.imdbId,
    title: movies.find((i) => i.imdbID == highBoxOffice.imdbId).Title,
    amount: highBoxOffice.boxOffice,
  };
  boxOffice.lowest = {
    imdbId: lowBoxOffice.imdbId,
    title: movies.find((i) => i.imdbID == lowBoxOffice.imdbId).Title,
    amount: lowBoxOffice.boxOffice,
  };
  const highRelease = releaseYears.timeline[releaseYearsCount.highestIndex];
  const lowRelease = releaseYears.timeline[releaseYearsCount.lowestIndex];
  releaseYears.oldest = {
    imdbId: lowRelease.imdbId,
    title: movies.find((i) => i.imdbID == lowRelease.imdbId).Title,
    amount: lowRelease.year,
  };
  releaseYears.newest = {
    imdbId: highRelease.imdbId,
    title: movies.find((i) => i.imdbID == highRelease.imdbId).Title,
    amount: highRelease.year,
  };
  releaseYears.span = (releaseYearsCount.highest - releaseYearsCount.lowest)
    .toString();

  const highRuntime = runtime.distribution[runtimeCount.highestIndex];
  const lowRuntime = runtime.distribution[runtimeCount.lowestIndex];
  runtime.average =
    (runtimeCount.total / runtime.distribution.length).toFixed() + " min";
  runtime.longest = {
    imdbId: highRuntime.imdbId,
    title: movies.find((i) => i.imdbID == highRuntime.imdbId).Title,
    runtime: highRuntime.runtime,
  };
  runtime.shortest = {
    imdbId: lowRuntime.imdbId,
    title: movies.find((i) => i.imdbID == lowRuntime.imdbId).Title,
    runtime: lowRuntime.runtime,
  };

  const highMetascore = metascore.distribution[metascoreCount.highestIndex];
  const lowMetascore = metascore.distribution[metascoreCount.lowestIndex];
  metascore.average = (metascoreCount.total / metascoreCount.count)
    .toFixed().toString();
  metascore.range =
    (Number(highMetascore.metascore) - Number(lowMetascore.metascore))
      .toString();
  metascore.highest = {
    imdbId: highMetascore.imdbId,
    title: movies.find((i) => i.imdbID == highMetascore.imdbId).Title,
    runtime: highMetascore.metascore,
  };
  metascore.lowest = {
    imdbId: lowMetascore.imdbId,
    title: movies.find((i) => i.imdbID == lowMetascore.imdbId).Title,
    runtime: lowMetascore.metascore,
  };
  const coreBody = {
    movies,
    comparison: {
      ratings,
      runtime,
      releaseYears,
      boxOffice,
      metascore,
      commonActors: Array.from(commonActors.values()),
      commonGenres: Array.from(commonGenres.values()),
      uniqueDirectors: Array.from(directors.values()),
    },
    movieCount: imdbIds.length,
  };
  if (request.body.comparedAt) {
    //edited
    const movieComparisonResult = await movieComparison.findOne({
      where: {
        created_at: request.body.comparedAt,
      },
    });

    const items = await movieComparisonItems.findAll({
      attributes: ["id", "movie_comparison_id", "imdb_id", "index"],
      where: { movie_comparison_id: movieComparisonResult.id },
    });
    const count = items.length;
    const newItems = new Set(movies.map((i) => i.imdbID));
    const oldItems = new Set(items.map((i) => i.dataValues.imdb_id));
    const toAdd = newItems.difference(oldItems);
    const toDelete = oldItems.difference(newItems);

    await movieComparisonItems.bulkCreate(
      Array.from(toAdd).map((id, index) => {
        return {
          movie_comparison_id: movieComparisonResult.dataValues.id,
          imdb_id: id,
          index: count + index,
        };
      }),
    );

    for (let id of toDelete) {
      await movieComparisonItems.destroy({
        where: {
          movie_comparison_id: movieComparisonResult.dataValues.id,
          imdb_id: id,
        },
      });
    }
    return reply.status(200).send({
      ...coreBody,
      comparedAt: movieComparisonResult.dataValues.createdAt.toISOString(),
      id: movieComparisonResult.id,
    });
  } else {
    //new
    const movieComparisonResult = await movieComparison.create({
      created_at: new Date(),
      updated_at: new Date(),
    });
    await movieComparisonItems.bulkCreate(imdbIds.map((id, index) => ({
      movie_comparison_id: movieComparisonResult.id,
      imdb_id: id,
      index: index,
    })));
    return reply.status(200).send({
      ...coreBody,
      comparedAt: movieComparisonResult.dataValues.createdAt.toISOString(),
      id: movieComparisonResult.id,
    });
  }
}

function movieSummary(movie) {
  return {
    Title: movie.Title,
    imdbID: movie.imdbID,
    imdbRating: movie.imdbRating,
    Year: movie.Year,
    Runtime: movie.Runtime,
    Genre: movie.Genre,
    Metascore: movie.Metascore,
    BoxOffice: movie.BoxOffice,
  };
}

function validateBody(request) {
  const imdbIds = request.body.imdbIds;
  if (!request.body.imdbIds) {
    return {
      error: true,
      status: 400,
      error: { "error": "imdbIds array is required" },
    };
  }
  if (!Array.isArray(imdbIds)) {
    return {
      error: true,
      status: 400,
      error: { "error": "imdbIds must be an array" },
    };
  }
  if (imdbIds.length < 2) {
    return {
      error: true,
      status: 400,
      error: { "error": "At least 2 movies required for comparison" },
    };
  }
  if (imdbIds.length > 5) {
    return {
      error: true,
      status: 400,
      error: { "error": "Maximum 5 movies can be compared at once" },
    };
  }
  //format section
  if (
    !imdbIds.every((val) =>
      val.startsWith("tt") &&
      val.length >= 9 && val.length <= 10
    )
  ) {
    return {
      error: true,
      status: 400,
      error: { "error": "All IMDb IDs must be valid format" },
    };
  }
  //end format section
  //unique section
  const uniqueIds = new Set(imdbIds);
  if (uniqueIds.size !== imdbIds.length) {
    return {
      error: true,
      status: 400,
      error: { "error": "Duplicate IMDb IDs found. All movies must be unique" },
    };
  }
  //end unique section
  return { error: false };
}
