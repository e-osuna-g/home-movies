import { describe, expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";
import { theme } from "../../../src/theme.js";
import { ThemeProvider } from "@emotion/react";
import SearchMovieAutoComplete from "../../../src/components/SearchMovieAutoComplete.jsx";
import { userEvent } from "vitest/browser";
const mockOptions = ["Inception", "Interstellar", "Dune", "Matrix"];

const defaultProps = {
  options: mockOptions,
  value: null,
  onChange: vi.fn(),
  inputValue: "",
  onInputChange: vi.fn(),
};
describe("SearchMovieAutoComplete", () => {
  test("it renders correctly", async () => {
    const { getByLabelText } = await render(
      <ThemeProvider theme={theme}>
        <SearchMovieAutoComplete {...defaultProps} />
      </ThemeProvider>,
    );
    await expect.element(getByLabelText(/search movie/i)).toBeInTheDocument();
  });

  test("it correctly renders the input set correctly", async () => {
    const { getByRole } = await render(
      <ThemeProvider theme={theme}>
        <SearchMovieAutoComplete {...defaultProps} />
      </ThemeProvider>,
    );

    await getByRole("combobox", { name: /search movie/i }).fill("Inter");
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
    const props = { ...defaultProps, inputValue: "mat" };
    const { getByRole } = await render(
      <ThemeProvider theme={theme}>
        <SearchMovieAutoComplete
          {...props}
        />
      </ThemeProvider>,
    );
    await getByRole("combobox").click();
    await expect.element(getByRole("option", { name: "matrix" }))
      .toBeInTheDocument();
    await expect.element(getByRole("option", { name: "Interstellar" })).not
      .toBeInTheDocument();
  });
});
