import { ThemeProvider } from "@emotion/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { afterAll, beforeAll, describe, expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { SearchMovie } from "../../../src/components/SearchMovie.jsx";
import { theme } from "../../../src/theme.js";
import { http, HttpResponse } from "msw";
import { API_SERVER } from "../../../src/env.js";
import { MovieMock } from "../../mockResponses.js";
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
];
const worker = setupWorker(...handlers);

describe("SearchMovie", () => {
  beforeAll(async () => await worker.start({ onUnhandledRequest: "error" }));

  // Close server after all tests
  afterAll(() => {
    worker.stop();
    queryClient.clear();
  });

  test("It renders correctly", async () => {
    const { getByRole } = await render(
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <SearchMovie />
        </ThemeProvider>
      </QueryClientProvider>,
    );
    const combo = getByRole("combobox");
    await expect.element(combo).toBeInTheDocument();
    await combo.fill("Shre");
    await getByRole("presentation").click();
    await expect.element(getByRole("dialog")).toBeInTheDocument();
  });
});
