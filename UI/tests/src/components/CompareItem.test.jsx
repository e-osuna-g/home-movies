import { describe, expect, test } from "vitest";
import CompareItem from "../../../src/components/CompareItem.jsx";
import { render } from "vitest-browser-react";
import { theme } from "../../../src/theme.js";
import { ThemeProvider } from "@emotion/react";
const Titles = [
  "Comparing",
  "Comparing 2: The return",
  "Comparing 3: The comparing",
  "Comparing 4: it came back for more comparing",
  "Comparing 5: the last one i swear",
];
const imdbIds = ["1", "2", "3", "4", "5"];

describe("CompareItem", () => {
  test("it shows the correct titles", async () => {
    const { getByText } = await render(
      <ThemeProvider theme={theme}>
        <CompareItem
          Titles={Titles}
          imdbIds={imdbIds}
          id={1}
        />
      </ThemeProvider>,
    );
    for (let i of Titles) {
      expect(getByText(i, { exact: true })).toBeInTheDocument();
    }
  });
  test("the link is correct", async () => {
    const { getByRole } = await render(
      <ThemeProvider theme={theme}>
        <CompareItem
          Titles={Titles}
          imdbIds={imdbIds}
          id={1}
        />
      </ThemeProvider>,
    );
    expect(getByRole("link")).toBeInTheDocument();
    const link = await getByRole("link").element().href;
    let url = new URL(link);
    expect(url.searchParams.getAll("movies")).toStrictEqual(imdbIds);
    expect(url.searchParams.get("id")).toBe("1");
    expect(url.pathname).toBe("/compare");
  });
});
