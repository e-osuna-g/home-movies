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
    t.assert.equal(response.statusCode, 200);
    compareAllData(t, json, compare_all_data);
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
    t.assert.equal(response.statusCode, 200);
    compareAllData(t, json, compare_all_data);
  });

  test("get comparation creating a new comparison id and fetching a record", async (t) => {
    const imdbIds = ["tt0145487", "tt0052602", "tt0076584", "tt0093058"];
    await seed_movies_info(["tt0145487", "tt0052602", "tt0076584"]);
    await seed_comparisons();
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
    compareAllData(t, json, compare_all_data);
  });
});

function compareAllData(t, actual, expected) {
  delete expected.comparedAt;
  delete actual.comparedAt;
  //we already created 1 on purpose when doing the seed_comparison
  expected.id = 2;

  t.assert.equal(
    areSetsEquals(
      new Set(actual.comparison.uniqueDirectors),
      new Set(expected.comparison.uniqueDirectors),
    ),
    true,
    "comparison.uniqueDirectors are not equal",
  );
  for (let i in actual.comparison.boxOffice) {
    if (i == "distribution") {
      for (let row of actual.comparison.boxOffice.distribution) {
        let found = expected.comparison.boxOffice.distribution.find(
          (item) => item.imdbId == row.imdbId,
        );
        t.assert.deepEqual(row, found);
      }
    } else {
      t.assert.deepEqual(
        actual.comparison.boxOffice[i],
        expected.comparison.boxOffice[i],
      );
    }
  }
  for (let i in actual.comparison.releaseYears) {
    if (i == "timeline") {
      for (let row of actual.comparison.releaseYears.timeline) {
        let found = expected.comparison.releaseYears.timeline.find(
          (item) => item.imdbId == row.imdbId,
        );
        t.assert.deepEqual(row, found);
      }
    } else {
      t.assert.deepEqual(
        actual.comparison.releaseYears[i],
        expected.comparison.releaseYears[i],
      );
    }
  }

  for (let i in actual.comparison.metascore) {
    if (i == "distribution") {
      for (let row of actual.comparison.metascore.distribution) {
        let found = expected.comparison.metascore.distribution.find(
          (item) => item.imdbId == row.imdbId,
        );
        t.assert.deepEqual(row, found);
      }
    } else {
      t.assert.deepEqual(
        actual.comparison.metascore[i],
        expected.comparison.metascore[i],
      );
    }
  }
  for (let i in actual.comparison.ratings) {
    if (i == "distribution") {
      for (let row of actual.comparison.ratings.distribution) {
        let found = expected.comparison.ratings.distribution.find(
          (item) => item.imdbId == row.imdbId,
        );
        t.assert.deepEqual(row, found);
      }
    } else if (i == "average" || i == "range") {
      t.assert.equal(
        compareFloatsEpsilon(
          Number(actual.comparison.ratings[i]),
          Number(expected.comparison.ratings[i]),
          1e-1,
        ),
        true,
        `.comparison.ratings${i} is different:${
          Number(actual.comparison.ratings[i])
        }-${Number(expected.comparison.ratings[i])}`,
      );
    } else {
      t.assert.deepEqual(
        actual.comparison.ratings[i],
        expected.comparison.ratings[i],
        `.comparison.ratings${i} is different: ${
          actual.comparison.ratings[i]
        }|${expected.comparison.ratings[i]}`,
      );
    }
  }
  for (let i in actual.comparison.runtime) {
    if (i == "distribution") {
      for (let row of actual.comparison.runtime.distribution) {
        let found = expected.comparison.runtime.distribution.find(
          (item) => item.imdbId == row.imdbId,
        );
        t.assert.deepEqual(row, found);
      }
    } else if (i == "average") {
      t.assert.equal(
        compareFloatsEpsilon(
          Number(actual.comparison.runtime[i].split(" ")[0]),
          Number(expected.comparison.runtime[i].split(" ")[0]),
          1e-1,
        ),
        true,
        `.comparison.runtime.${i} is different:${
          Number(actual.comparison.runtime[i].split(" ")[0])
        }-${Number(expected.comparison.runtime[i].split(" ")[0])}`,
      );
    } else {
      t.assert.deepEqual(
        actual.comparison.runtime[i],
        expected.comparison.runtime[i],
      );
    }
  }

  for (let index in actual.comparison.commonGenres) {
    for (let i in actual.comparison.commonGenres[index]) {
      const expectedItem = expected.comparison.commonGenres.find((item) =>
        item.genre == actual.comparison.commonGenres[index].genre
      );
      if (i == "appearsIn") {
        t.assert.deepEqual(
          expectedItem[i],
          actual.comparison.commonGenres[index][i],
        );
      } else {
        t.assert.deepEqual(
          actual.comparison.commonGenres[index][i],
          expectedItem[i],
        );
      }
    }
  }
  for (let index in actual.comparison.commonActors) {
    for (let i in actual.comparison.commonActors[index]) {
      const expectedItem = expected.comparison.commonActors.find((item) => {
        item.actor == actual.comparison.commonActors[i].actor;
      }) ?? [];
      if (i == "appearsIn") {
        t.assert.deepEqual(
          expectedItem[i],
          actual.comparison.commonActors[index][i],
        );
      } else {
        t.assert.deepEqual(
          actual.comparison.commonActors[index][i],
          expectedItem[i],
        );
      }
    }
  }
}
