import { describe, expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";
import MiniMovieView from "../../../src/components/MiniMovieView.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { afterAll, afterEach, beforeAll } from "vitest";
import { setupWorker } from "msw/browser";
import { http, HttpResponse } from "msw";
import { API_SERVER } from "../../../src/env.js";

const queryClient = new QueryClient();
const response = {
  "Title": "Shrek",
  "Year": "2001",
  "Rated": "PG",
  "Released": "18 May 2001",
  "Runtime": "90 min",
  "Genre": "Animation, Adventure, Comedy",
  "Director": "Andrew Adamson, Vicky Jenson",
  "Writer": "William Steig, Ted Elliott, Terry Rossio",
  "Actors": "Mike Myers, Eddie Murphy, Cameron Diaz",
  "Plot":
    "A mean lord exiles fairytale creatures to the swamp of a grumpy ogre, who must go on a quest and rescue a princess for the lord in order to get his land back.",
  "Language": "English",
  "Country": "United States",
  "Awards": "Won 1 Oscar. 40 wins & 60 nominations total",
  "Poster":
    "https://m.media-amazon.com/images/M/MV5BN2FkMTRkNTUtYTI0NC00ZjI4LWI5MzUtMDFmOGY0NmU2OGY1XkEyXkFqcGc@._V1_SX300.jpg",
  "Ratings": [{ "Source": "Internet Movie Database", "Value": "7.9/10" }, {
    "Source": "Rotten Tomatoes",
    "Value": "88%",
  }, { "Source": "Metacritic", "Value": "84/100" }],
  "Metascore": "84",
  "imdbRating": "7.9",
  "imdbVotes": "803,764",
  "imdbID": "tt0126029",
  "Type": "movie",
  "DVD": "N/A",
  "BoxOffice": "$268,698,241",
  "Production": "N/A",
  "Website": "N/A",
  "Response": "True",
};
const handlers = [
  http.get(`${API_SERVER}/api/movie/:id`, () => {
    return HttpResponse.json(response);
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

    expect(getByRole("img").element().src).toBe(response.Poster);
    expect(getByRole("button")).toBeInTheDocument();
    await getByRole("button").click();
    expect(mockRemoveMovie).toHaveBeenCalledOnce();
  });
});
