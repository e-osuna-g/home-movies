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
import { recentComparisons_1_3 } from "./Mocks/responses.js";
import { MockById } from "./Mocks/mocks.js";

describe("api/comparisons/recent", { concurrency: false }, () => {
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
  test(
    "with not results",
    { concurrency: false },
    async (t) => {
      const response = await fastify.inject({
        method: "GET",
        url: `/api/comparisons/recent`,
      });
      const json = await response.json();
      // we should not need any  agent intervention
      t.assert.equal(response.statusCode, 200);
      //delete compareAt as its not needed for this check
      t.assert.deepEqual(json, []);
    },
  );
  test(
    "get recent comparisons with no fetched data",
    { concurrency: false },
    async (t) => {
      await seed_all_movies_info();
      await seed_comparisons();

      const response = await fastify.inject({
        method: "GET",
        url: `/api/comparisons/recent`,
      });
      const json = await response.json();

      // we should not need any  agent intervention
      t.assert.equal(response.statusCode, 200);
      //delete compareAt as its not needed for this check
      delete json[0].comparedAt;
      t.assert.deepEqual(json, recentComparisons_1_3);
    },
  );

  test(
    "get recent comparisons with fetched data",
    { concurrency: false },
    async (t) => {
      await seed_movies_info(["tt0052602", "tt0076584"]);
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
        method: "GET",
        url: `/api/comparisons/recent`,
      });
      const json = await response.json();

      // we should not need any  agent intervention
      t.assert.equal(response.statusCode, 200);
      //delete compareAt as its not needed for this check
      delete json[0].comparedAt;
      t.assert.deepEqual(json, recentComparisons_1_3);
    },
  );
});
