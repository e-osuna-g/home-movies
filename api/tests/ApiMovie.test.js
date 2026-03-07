import assert from "node:assert";
import test, { afterEach, before, beforeEach, describe } from "node:test";
import { buildFastify } from "../src/fastifyBuilder.js";
import { sequalize } from "../src/db/connection.js";
import { MockAgent, setGlobalDispatcher } from "undici";
import { OMDB_API_KEY, OMDB_URL } from "../src/envVars.js";
import { MockById } from "./Mocks/mocks.js";

describe("/api/movie/:id", () => {
  //This 2 type annotations help a lot with intellisense
  /** @type {import('undici').MockAgent<MockAgent.Options>} */
  let agent;
  /** @type {import('fastify').FastifyInstance<Server<typeof IncomingMessage, typeof ServerResponse>, IncomingMessage, ServerResponse<IncomingMessage>, FastifyBaseLogger, FastifyTypeProviderDefault>} fastify*/
  let fastify;
  beforeEach(async () => {
    agent = new MockAgent();
    agent.disableNetConnect();
    fastify = await buildFastify();
    setGlobalDispatcher(agent);
  });
  before(async () => {
    await sequalize.sync({ force: true });
  });
  afterEach(async () => {
    fastify.close();
  });
  test("Missing :id parameter", async (t) => {
    const response = await fastify.inject({
      method: "GET",
      url: `/api/movie/`,
    });
    const json = await response.json();

    t.assert.deepEqual(response.statusCode, 400);

    t.assert.deepEqual(json, {
      Response: "Error",
      Error: "Search parameter 'i' is required",
    });
  });
  test("Wrong IMDB ID format", async (t) => {
    const response = await (await fastify.inject({
      method: "GET",
      url: `/api/movie/1`,
    })).json();

    t.assert.deepEqual(response, {
      Response: "False",
      Error: "Invalid IMDb ID format. Must be 'tt' followed by 7-8 digits",
    });
  });
  test("fetching to external API", async (t) => {
    agent.get(`${OMDB_URL}`).intercept({
      path: "/",
      method: "GET",
      query: {
        apikey: OMDB_API_KEY,
        i: MockById.tt0145487.imdbID,
      },
    }).reply(200, MockById.tt0145487);

    const response = await (await fastify.inject({
      method: "GET",
      url: `/api/movie/${MockById.tt0145487.imdbID}`,
    })).json();

    t.assert.deepEqual(response, MockById.tt0145487);
  });
});
