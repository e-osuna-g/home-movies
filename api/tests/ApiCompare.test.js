import test, { afterEach, before, beforeEach, describe } from "node:test";
import { buildFastify } from "../src/fastifyBuilder.js";
import { MockAgent, setGlobalDispatcher } from "undici";
import { OMDB_API_KEY, OMDB_URL } from "../src/envVars.js";
import { seed_comparisons } from "./Seeds/MovieComparison.seed.js";
import { sequalize } from "../src/db/connection.js";
import {
  seed_all_movies_info,
  seed_movies_info,
} from "./Seeds/MovieInfo.seed.js";
import { compare_all_data, recentComparisons_1_3 } from "./Mocks/responses.js";
import { MockById } from "./Mocks/mocks.js";
import { areSetsEquals, compareFloatsEpsilon } from "../src/utils.js";

describe("/api/compare", { concurrency: false }, () => {
  //This 2 type annotations help a lot with intellisense
  /** @type {import('undici').MockAgent<MockAgent.Options>} */
  let agent;
  /** @type {import('fastify').FastifyInstance<Server<typeof IncomingMessage, typeof ServerResponse>, IncomingMessage, ServerResponse<IncomingMessage>, FastifyBaseLogger, FastifyTypeProviderDefault>} fastify*/
  let fastify;
  beforeEach(async () => {
    // This will use a new DB on each test
    await sequalize.drop();
    await sequalize.sync({ force: true });
    agent = new MockAgent();
    agent.disableNetConnect();
    fastify = await buildFastify();
    setGlobalDispatcher(agent);
  });
  afterEach(async () => {
    fastify.close();
  });
  test("get comparation with all data in db", async (t) => {
    await seed_all_movies_info();
    const { movieComparison } = await seed_comparisons();
    const imdbIds = ["tt0145487", "tt0052602", "tt0076584", "tt0093058"];
    const response = await fastify.inject({
      method: "POST",
      url: `/api/compare`,
      body: {
        imdbIds,
        id: movieComparison.dataValues.id,
      },
    });
    const json = await response.json();
    //make the saved response have the comparedAt that was just created in the DB
    compare_all_data.comparedAt = movieComparison.dataValues.createdAt
      .toISOString();

    t.assert.equal(response.statusCode, 200);
    t.assert.deepEqual(json, compare_all_data);
  });
  test("get comparation creating a new comparison id", async (t) => {
    await seed_all_movies_info();
    const { movieComparison } = await seed_comparisons();
    const imdbIds = ["tt0145487", "tt0052602", "tt0076584", "tt0093058"];
    const response = await fastify.inject({
      method: "POST",
      url: `/api/compare`,
      body: {
        imdbIds,
      },
    });
    const json = await response.json();
    //we do not know what the compareAt is, as it happened in the back
    delete compare_all_data.comparedAt;
    delete json.comparedAt;
    //we already created 1 on purpose when doing the seed_comparison
    compare_all_data.id = 2;

    t.assert.equal(response.statusCode, 200);
    t.assert.deepEqual(json, compare_all_data);
  });

  test("get comparation creating a new comparison id and fetching a record", async (t) => {
    const imdbIds = ["tt0145487", "tt0052602", "tt0076584", "tt0093058"];

    await seed_movies_info(["tt0145487", "tt0052602", "tt0076584"]);
    const { movieComparison } = await seed_comparisons();
    agent.get(`${OMDB_URL}`).intercept({
      path: "/",
      method: "GET",
      query: {
        apikey: OMDB_API_KEY,
        i: "tt0093058",
      },
    }).reply(200, MockById["tt0093058"]);
    const response = await fastify.inject({
      method: "POST",
      url: `/api/compare`,
      body: {
        imdbIds,
      },
    });
    const json = await response.json();
    //we do not know what the compareAt is, as it happened in the back
    delete compare_all_data.comparedAt;
    delete json.comparedAt;
    //we already created 1 on purpose when doing the seed_comparison
    compare_all_data.id = 2;
    t.assert.equal(response.statusCode, 200);

    t.assert.deepEqual(
      json.comparison.commonActors,
      compare_all_data.comparison.commonActors,
      "comparison.commonActors are not equal",
    );
    t.assert.deepEqual(
      json.comparison.commonGenres,
      compare_all_data.comparison.commonGenres,
      "comparison.commonGenres are not equal",
    );
    t.assert.equal(
      areSetsEquals(
        new Set(json.comparison.uniqueDirectors),
        new Set(compare_all_data.comparison.uniqueDirectors),
      ),
      true,
      "comparison.uniqueDirectors are not equal",
    );
    for (let i in json.comparison.boxOffice) {
      if (i == "distribution") {
        for (let row of json.comparison.boxOffice.distribution) {
          let found = compare_all_data.comparison.boxOffice.distribution.find(
            (item) => item.imdbId == row.imdbId,
          );
          t.assert.deepEqual(row, found);
        }
      } else {
        t.assert.deepEqual(
          json.comparison.boxOffice[i],
          compare_all_data.comparison.boxOffice[i],
        );
      }
    }
    for (let i in json.comparison.releaseYears) {
      if (i == "timeline") {
        for (let row of json.comparison.releaseYears.timeline) {
          let found = compare_all_data.comparison.releaseYears.timeline.find(
            (item) => item.imdbId == row.imdbId,
          );
          t.assert.deepEqual(row, found);
        }
      } else {
        t.assert.deepEqual(
          json.comparison.releaseYears[i],
          compare_all_data.comparison.releaseYears[i],
        );
      }
    }

    for (let i in json.comparison.metascore) {
      if (i == "distribution") {
        for (let row of json.comparison.metascore.distribution) {
          let found = compare_all_data.comparison.metascore.distribution.find(
            (item) => item.imdbId == row.imdbId,
          );
          t.assert.deepEqual(row, found);
        }
      } else {
        t.assert.deepEqual(
          json.comparison.metascore[i],
          compare_all_data.comparison.metascore[i],
        );
      }
    }
    for (let i in json.comparison.ratings) {
      if (i == "distribution") {
        for (let row of json.comparison.ratings.distribution) {
          let found = compare_all_data.comparison.ratings.distribution.find(
            (item) => item.imdbId == row.imdbId,
          );
          t.assert.deepEqual(row, found);
        }
      } else if (i == "average" || i == "range") {
        t.assert.equal(
          compareFloatsEpsilon(
            Number(json.comparison.ratings[i]),
            Number(compare_all_data.comparison.ratings[i]),
            1e-1,
          ),
          true,
          `.comparison.ratings${i} is different:${
            Number(json.comparison.ratings[i])
          }-${Number(compare_all_data.comparison.ratings[i])}`,
        );
      } else {
        t.assert.deepEqual(
          json.comparison.ratings[i],
          compare_all_data.comparison.ratings[i],
          `.comparison.ratings${i} is different: ${
            json.comparison.ratings[i]
          }|${compare_all_data.comparison.ratings[i]}`,
        );
      }
    }
    for (let i in json.comparison.runtime) {
      if (i == "distribution") {
        for (let row of json.comparison.runtime.distribution) {
          let found = compare_all_data.comparison.runtime.distribution.find(
            (item) => item.imdbId == row.imdbId,
          );
          t.assert.deepEqual(row, found);
        }
      } else if (i == "average") {
        t.assert.equal(
          compareFloatsEpsilon(
            Number(json.comparison.runtime[i].split(" ")[0]),
            Number(compare_all_data.comparison.runtime[i].split(" ")[0]),
            1e-1,
          ),
          true,
          `.comparison.runtime.${i} is different:${
            Number(json.comparison.runtime[i].split(" ")[0])
          }-${Number(compare_all_data.comparison.runtime[i].split(" ")[0])}`,
        );
      } else {
        t.assert.deepEqual(
          json.comparison.runtime[i],
          compare_all_data.comparison.runtime[i],
        );
      }
    }
  });
});
