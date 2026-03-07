import assert from "node:assert";
import test from "node:test";
import { buildFastify } from "../src/fastifyBuilder.js";

test("sync pass", async (t) => {
  const fastify = await buildFastify();
  t.after(() => fastify.close());

  const response = await (await fastify.inject({
    method: "GET",
    url: "/",
  })).json();

  t.assert.deepEqual(response, { "hello": "world" });
});
