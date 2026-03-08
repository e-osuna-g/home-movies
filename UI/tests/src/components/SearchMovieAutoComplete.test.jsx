import { beforeEach, describe, expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";
import { theme } from "../../../src/theme.js";
import { ThemeProvider } from "@emotion/react";
import SearchMovieAutoComplete from "../../../src/components/SearchMovieAutoComplete.jsx";
import { userEvent } from "vitest/browser";
import { MockById } from "../../Mocks/movies.js";
const mockOptions = [
  MockById.tt0052602,
  MockById.tt0076584,
  MockById.tt0093058,
];

const defaultProps = {
  options: mockOptions,
  value: null,
  onChange: vi.fn(),
  inputValue: "",
  onInputChange: vi.fn(),
};
describe("SearchMovieAutoComplete", () => {
  beforeEach(() => {
    defaultProps.onChange.mockClear();
    defaultProps.onInputChange.mockClear();
  });
  test("it renders correctly", async () => {
    const { getByRole } = await render(
      <ThemeProvider theme={theme}>
        <SearchMovieAutoComplete {...defaultProps} />
      </ThemeProvider>,
    );
    await expect.element(getByRole("combobox")).toBeInTheDocument();
  });

  test("it correctly renders the input set correctly", async () => {
    const { getByRole } = await render(
      <ThemeProvider theme={theme}>
        <SearchMovieAutoComplete {...defaultProps} />
      </ThemeProvider>,
    );

    await getByRole("combobox").fill("Inter");
    expect(defaultProps.onInputChange).toHaveBeenLastCalledWith(
      expect.anything(),
      "Inter",
    );
  });
  test("it does not call OnInputChange on Enter", async () => {
    const { getByRole } = await render(
      <ThemeProvider theme={theme}>
        <SearchMovieAutoComplete {...defaultProps} />
      </ThemeProvider>,
    );

    await getByRole("combobox").click();
    await userEvent.keyboard("{Enter}");
    expect(defaultProps.onInputChange).not.toHaveBeenCalled();
  });
  test("it filters the options when text is added", async () => {
    const props = { ...defaultProps, inputValue: "The" };
    const { getByRole } = await render(
      <ThemeProvider theme={theme}>
        <SearchMovieAutoComplete
          {...props}
        />
      </ThemeProvider>,
    );
    await getByRole("combobox").click();
    await expect.element(getByRole("option", { name: "The Bat" }))
      .toBeInTheDocument();
    await expect.element(getByRole("option", { name: "Full Metal Jacket" })).not
      .toBeInTheDocument();
  });
});
