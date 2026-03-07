import { afterAll, beforeAll, describe, expect, test } from "vitest";
import { render } from "vitest-browser-react";
import RecentComparisons from "../../../src/components/RecentComparisons.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { http, HttpResponse } from "msw";
import { API_SERVER } from "../../../src/env.js";
import { recentComparisonsMock } from "../../mockResponses.js";
import { ThemeProvider } from "@emotion/react";
import { theme } from "../../../src/theme.js";
import { setupWorker } from "msw/browser";
const queryClient = new QueryClient();

const handlers = [
  http.get(`${API_SERVER}/api/comparisons/recent`, () => {
    return HttpResponse.json(recentComparisonsMock);
  }),
];
const worker = setupWorker(...handlers);

describe("RecentComparisons", () => {
  // Start server before all tests
  beforeAll(async () => await worker.start({ onUnhandledRequest: "error" }));

  // Close server after all tests
  afterAll(() => {
    worker.stop();
    queryClient.clear();
  });

  test("it renders correctly shows Circular progressing", async () => {
    let { getByRole } = await render(
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <RecentComparisons />
        </ThemeProvider>
      </QueryClientProvider>,
    );
    await expect.element(getByRole("progressbar")).toBeInTheDocument();
  });

  test("it renders correctly shows recent comparisons", async () => {
    let { getByRole } = await render(
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <RecentComparisons />
        </ThemeProvider>
      </QueryClientProvider>,
    );
    await expect.element(getByRole("progressbar")).not.toBeInTheDocument();
    await expect.element(getByRole("link").first()).toBeInTheDocument();
    expect(getByRole("link").elements().length).toBe(8);
  });
});
