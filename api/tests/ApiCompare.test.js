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
    console.log("json", JSON.stringify(json));
    //we do not know what the compareAt is, as it happened in the back
    delete compare_all_data.comparedAt;
    delete json.comparedAt;
    //we already created 1 on purpose when doing the seed_comparison
    compare_all_data.id = 2;
    t.assert.equal(response.statusCode, 200);

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

    for (let i in json.comparison.commonGenres) {
      if (i == "appearsIn") {
        for (let row of json.comparison.commonGenres[i]) {
          let found = compare_all_data.comparison.commonGenres[i].find(
            (item) => item.imdbId == row.imdbId,
          );
          t.assert.deepEqual(row, found);
        }
      } else {
        t.assert.deepEqual(
          json.comparison.commonGenres[i],
          compare_all_data.comparison.commonGenres[i],
        );
      }
    }
    for (let i in json.comparison.commonActors) {
      if (i == "appearsIn") {
        for (let row of json.comparison.commonActors[i]) {
          let found = compare_all_data.comparison.commonActors[i].find(
            (item) => item.imdbId == row.imdbId,
          );
          t.assert.deepEqual(row, found);
        }
      } else {
        t.assert.deepEqual(
          json.comparison.commonActors[i],
          compare_all_data.comparison.commonActors[i],
        );
      }
    }
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

  for (let i in actual.comparison.commonGenres) {
    if (i == "appearsIn") {
      for (let row of actual.comparison.commonGenres[i]) {
        let found = expected.comparison.commonGenres[i].find(
          (item) => item.imdbId == row.imdbId,
        );
        t.assert.deepEqual(row, found);
      }
    } else {
      t.assert.deepEqual(
        actual.comparison.commonGenres[i],
        expected.comparison.commonGenres[i],
      );
    }
  }
  for (let i in actual.comparison.commonActors) {
    if (i == "appearsIn") {
      for (let row of actual.comparison.commonActors[i]) {
        let found = expected.comparison.commonActors[i].find(
          (item) => item.imdbId == row.imdbId,
        );
        t.assert.deepEqual(row, found);
      }
    } else {
      t.assert.deepEqual(
        actual.comparison.commonActors[i],
        expected.comparison.commonActors[i],
      );
    }
  }
}
