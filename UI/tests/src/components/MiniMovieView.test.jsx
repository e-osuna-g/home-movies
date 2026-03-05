import { describe, expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";
import MiniMovieView from "../../../src/components/MiniMovieView.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { afterAll, afterEach, beforeAll } from "vitest";
import { setupWorker } from "msw/browser";
import { http, HttpResponse } from "msw";
import { API_SERVER } from "../../../src/env.js";
import { MovieMock } from "../../mockResponses.js";

const queryClient = new QueryClient();

const handlers = [
  http.get(`${API_SERVER}/api/movie/:id`, () => {
    return HttpResponse.json(MovieMock.shrek);
  }),
];
const worker = setupWorker(...handlers);
describe("MiniMovie", () => {
  // Start server before all tests
  beforeAll(async () => await worker.start({ onUnhandledRequest: "error" }));

  // Close server after all tests
  afterAll(() => {
    //worker.stop();
    queryClient.clear();
  });

  // Reset handlers after each test for test isolation
  afterEach(() => worker.resetHandlers());
  test("renders renders correctly", async () => {
    const mockRemoveMovie = vi.fn();
    const { getByText, getByRole } = await render(
      <QueryClientProvider client={queryClient}>
        <MiniMovieView
          movieId={"tt0126029"}
          removeMovie={() => mockRemoveMovie("tt0126029")}
        />
      </QueryClientProvider>,
    );
    await expect.element(getByText("Shrek")).toBeInTheDocument();

    expect(getByRole("img").element().src).toBe(MovieMock.shrek.Poster);
    expect(getByRole("button")).toBeInTheDocument();
    await getByRole("button").click();
    expect(mockRemoveMovie).toHaveBeenCalledOnce();
  });
});
