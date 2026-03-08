import { afterAll, beforeAll, describe, expect, test, vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@emotion/react";
import { render } from "vitest-browser-react";
import { theme } from "../../../src/theme.js";
import MovieDialogSearch from "../../../src/components/MovieDialogSearch.jsx";
import { API_SERVER } from "../../../src/env.js";
import { http, HttpResponse } from "msw";
import { MovieMock } from "../../Mocks/mockResponses.js";
import { setupWorker } from "msw/browser";
const queryClient = new QueryClient();
const handlers = [
  http.get(`${API_SERVER}/api/search`, (r) => {
    if (!r.request.url) return;
    let search = new URL(r.request.url).searchParams;
    if (
      r.request.method == "GET" &&
      search.get("s") == "Shre"
    ) {
      return HttpResponse.json({ Search: [MovieMock.shrek] });
    } else {
      HttpResponse.error("an error");
    }
  }),
  http.get(`${API_SERVER}/api/movie/:imdbId`, () => {
    return HttpResponse.json(MovieMock.shrek);
  }),
];
const worker = setupWorker(...handlers);

vi.mock(import("../../../src/components/MovieDialogContent.jsx"), () => ({
  default: vi.fn(() => `<div>Content</div>`),
}));
describe("MovieDialogSearch", async () => {
  beforeAll(async () => await worker.start({ onUnhandledRequest: "error" }));

  // Close server after all tests
  afterAll(() => {
    worker.stop();
    queryClient.clear();
  });
  test("Compare button is enable and closes the dialog", async () => {
    const mockClose = vi.fn();
    const mockAddMovieHandler = vi.fn();

    const { getByRole } = await render(
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <MovieDialogSearch
            open={true}
            handleClose={mockClose}
            addMovieHandler={mockAddMovieHandler}
          />
        </ThemeProvider>
      </QueryClientProvider>,
    );
    await getByRole("combobox").fill("Shre");

    const element = getByRole("presentation").nth(1);
    await getByRole("combobox").hover();
    await expect.element(element).toBeInTheDocument();
    await element.click();
    const compareButton = getByRole("button", { name: "Add to compare" });
    await expect.element(compareButton).toBeEnabled();
    await compareButton.click();
    expect(mockAddMovieHandler).toBeCalled();
  });
  test("It renders", async () => {
    const mockClose = vi.fn();
    const { getByRole } = await render(
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <MovieDialogSearch open={true} handleClose={mockClose} />
        </ThemeProvider>
      </QueryClientProvider>,
    );
    await expect(getByRole("button", { name: "close" })).toBeInTheDocument();
    await expect(getByRole("button", { name: "Add to compare" }))
      .toBeInTheDocument();
  });
  test("It closes with the X button", async () => {
    const mockClose = vi.fn();
    const { getByRole } = await render(
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <MovieDialogSearch open={true} handleClose={mockClose} />
        </ThemeProvider>
      </QueryClientProvider>,
    );
    await expect(getByRole("button", { name: "close" })).toBeInTheDocument();
    await getByRole("button", { name: "close" }).click();
    await expect(mockClose).toBeCalled();
  });
  test("Compare button is disabled", async () => {
    const mockClose = vi.fn();
    const { getByRole } = await render(
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <MovieDialogSearch open={true} handleClose={mockClose} />
        </ThemeProvider>
      </QueryClientProvider>,
    );
    await expect(getByRole("button", { name: "Add to compare" }))
      .toBeInTheDocument();
    await expect(getByRole("button", { name: "Add to compare" }))
      .toBeDisabled();
  });
});
