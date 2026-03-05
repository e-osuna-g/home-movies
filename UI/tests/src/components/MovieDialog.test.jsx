import { describe, expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";
import MiniMovieView from "../../../src/components/MiniMovieView.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { afterAll, afterEach, beforeAll } from "vitest";
import { setupWorker } from "msw/browser";
import { http, HttpResponse } from "msw";
import { API_SERVER } from "../../../src/env.js";
import { MovieMock } from "../../mockResponses.js";
import MovieDialog from "../../../src/components/MovieDialog.jsx";

const queryClient = new QueryClient();

const handlers = [
  http.get(`${API_SERVER}/api/movie/:id`, () => {
    return HttpResponse.json(MovieMock.shrek);
  }),
];
const worker = setupWorker(...handlers);
describe("MovieDialog", () => {
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
    const mockClose = vi.fn();

    const { getByRole, getByText } = await render(
      <QueryClientProvider client={queryClient}>
        <MovieDialog
          movieId={MovieMock.shrek}
          open={true}
          handleClose={mockClose}
        />
      </QueryClientProvider>,
    );
    await expect.element(
      getByRole("progressbar"),
    ).toBeInTheDocument();
    await expect.element(getByText("Shrek")).toBeInTheDocument();
    await expect(getByRole("img").element().src).toBe(MovieMock.shrek.Poster);
  });
  test("renders closes on close button", async () => {
    const mockClose = vi.fn();

    const { getByRole, getByText } = await render(
      <QueryClientProvider client={queryClient}>
        <MovieDialog
          movieId={MovieMock.shrek}
          open={true}
          handleClose={mockClose}
        />
      </QueryClientProvider>,
    );

    await expect.element(getByText("Shrek")).toBeInTheDocument();
    await getByRole("button").click();
    expect(mockClose).toHaveBeenCalledOnce();
  });

  test("Links correctly", async () => {
    const mockClose = vi.fn();

    const { getByRole, getByText } = await render(
      <QueryClientProvider client={queryClient}>
        <MovieDialog
          movieId={MovieMock.shrek.imdbID}
          open={true}
          handleClose={mockClose}
        />
      </QueryClientProvider>,
    );

    await expect.element(getByText(MovieMock.shrek.Title)).toBeInTheDocument();
    console.log(getByRole("link").element());
    const link = await getByRole("link").element().href;
    console.log(link);
    let search = new URL(link).searchParams;
    console.log("searchParams", search.toString());
    expect(search.get("movies")).toBe(MovieMock.shrek.imdbID);
  });
});
