import { describe, expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";
import { theme } from "../../../src/theme.js";
import { ThemeProvider } from "@emotion/react";
import CompareSection from "../../../src/components/CompareSection.jsx";

vi.mock(import("../../../src/components/RecentComparisons.jsx"), () => ({
  default: vi.fn(() => `<div>Recent comparisons</div>`),
}));
describe("CompareSection", () => {
  test("it has the correct link", async () => {
    const { getByRole } = await render(
      <ThemeProvider theme={theme}>
        <CompareSection />
      </ThemeProvider>,
    );
    const link = await getByRole("link").element().href;
    let url = new URL(link);
    expect(url.pathname).toBe("/compare");
  });
});
