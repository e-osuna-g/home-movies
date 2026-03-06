import { describe, expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { afterAll, afterEach, beforeAll } from "vitest";
import { setupWorker } from "msw/browser";
import { http, HttpResponse } from "msw";
import { API_SERVER } from "../../../src/env.js";
import { MovieMock } from "../../mockResponses.js";
import MovieDialogContent from "../../../src/components/MovieDialogContent.jsx";

const queryClient = new QueryClient();

const handlers = [
  http.get(`${API_SERVER}/api/movie/:id`, () => {
    return HttpResponse.json(MovieMock.shrek);
  }),
];
const worker = setupWorker(...handlers);
describe("MovieDialogContent", () => {
  // Start server before all tests
  beforeAll(async () => await worker.start({ onUnhandledRequest: "error" }));

  // Close server after all tests
  afterAll(() => {
    //worker.stop();
    queryClient.clear();
  });

  // Reset handlers after each test for test isolation
  afterEach(() => worker.resetHandlers());
  test("Circular progress render", async () => {
    const { getByRole } = await render(
      <QueryClientProvider client={queryClient}>
        <MovieDialogContent />
      </QueryClientProvider>,
    );

    await expect.element(getByRole("progressbar")).toBeInTheDocument();
  });
  test("Alert Message when movie failed", async () => {
    const { getByRole } = await render(
      <QueryClientProvider client={queryClient}>
        <MovieDialogContent movie={{ Response: "False" }} />
      </QueryClientProvider>,
    );

    await expect.element(getByRole("alert"))
      .toBeInTheDocument();
  });
  test("Alert Message when search failed and Too many results", async () => {
    const { getByRole } = await render(
      <QueryClientProvider client={queryClient}>
        <MovieDialogContent
          movie={{}}
          searchError={{ Response: "False", Error: "Too many results." }}
        />
      </QueryClientProvider>,
    );
    await expect.element(getByRole("alert")).toBeInTheDocument();
  });
});
