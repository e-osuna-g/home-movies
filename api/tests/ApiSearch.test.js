import test, { afterEach, before, beforeEach, describe } from "node:test";
import { buildFastify } from "../src/fastifyBuilder.js";
import { MockAgent, setGlobalDispatcher } from "undici";
import { OMDB_API_KEY, OMDB_URL } from "../src/envVars.js";
import { searchMocks } from "./Mocks/mocks.js";

describe("/api/search/", () => {
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
  afterEach(async () => {
    fastify.close();
  });
  test("s parameter is not present", async (t) => {
    const response = await fastify.inject({
      method: "GET",
      url: `/api/search`,
      query: {},
    });
    const json = await response.json();

    t.assert.deepEqual(response.statusCode, 400);

    t.assert.deepEqual(json, {
      Response: "Error",
      Error: "Search parameter 's' is required",
    });
  });
  test("correct request but, not found movie", async (t) => {
    const searchString = "AMovieDoesNotExist400";
    agent.get(`${OMDB_URL}`).intercept({
      path: "/",
      method: "GET",
      query: {
        apikey: OMDB_API_KEY,
        s: searchString,
      },
    }).reply(
      searchMocks["not-found"].statusCode,
      searchMocks["not-found"].json,
    );
    const response = await fastify.inject({
      method: "GET",
      url: `/api/search`,
      query: {
        s: searchString,
      },
    });
    const json = await response.json();
    //OMDB returns 200, but our server returns 400
    t.assert.deepEqual(
      response.statusCode,
      400,
    );

    t.assert.deepEqual(json, searchMocks["not-found"].json);
  });
  test("only s parameter is present", async (t) => {
    const searchString = "Shrek";
    agent.get(`${OMDB_URL}`).intercept({
      path: "/",
      method: "GET",
      query: {
        apikey: OMDB_API_KEY,
        s: searchString,
      },
    }).reply(searchMocks.Shrek.statusCode, searchMocks.Shrek.json);
    const response = await fastify.inject({
      method: "GET",
      url: `/api/search`,
      query: {
        s: searchString,
      },
    });
    const json = await response.json();

    t.assert.deepEqual(response.statusCode, searchMocks.Shrek.statusCode);

    t.assert.deepEqual(json, searchMocks.Shrek.json);
  });

  test("s,type,y and page parameters are present", async (t) => {
    const searchString = "Shrek";
    agent.get(`${OMDB_URL}`).intercept({
      path: "/",
      method: "GET",
      query: {
        apikey: OMDB_API_KEY,
        s: searchString,
        type: "movie",
        y: "2005",
        page: "2",
      },
    }).reply(searchMocks.Shrek.statusCode, searchMocks.Shrek.json);
    const response = await fastify.inject({
      method: "GET",
      url: `/api/search`,
      query: {
        s: searchString,
        type: "movie",
        y: "2005",
        page: "2",
      },
    });
    const json = await response.json();
    //NOTE: here the only thing that matter is that the mock happened succesfully
    t.assert.deepEqual(response.statusCode, searchMocks.Shrek.statusCode);

    t.assert.deepEqual(json, searchMocks.Shrek.json);
  });
});
