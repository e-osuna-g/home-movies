import { useQuery } from "@tanstack/react-query";
import useDebounce from "../hooks/useDebounce";
const DAY = 1000 * 60 * 60 * 24;
export function useSearchMovies(search, opts = { debounceTime: 300 }) {
  const debouncedSearch = useDebounce(search, opts.debounceTime);
  const { isPending, error, data } = useQuery({
    queryKey: ["/api/search/", debouncedSearch],
    queryFn: fetchSearchMovie,
    gcTime: Infinity,
    staleTime: DAY,
  });
  return { isPending, error, data };
}

async function fetchSearchMovie(search) {
  const params = new URLSearchParams();
  const s = search.queryKey[1];

  params.set("s", s);
  if (s.length == 0) {
    return { Search: [], totalResults: "0", Response: "True" };
  }
  const val = await fetch(
    `http://localhost:3000/api/search?${params.toString()}`,
    {
      mode: "cors",
    },
  );
  if (!val.ok) {
    throw new Error("Search error");
  }
  return await val.json();
}
