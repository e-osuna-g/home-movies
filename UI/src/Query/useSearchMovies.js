import { useQuery } from "@tanstack/react-query";
import useDebounce from "../hooks/useDebounce";
import { API_SERVER } from "../env.js";
const DAY = 1000 * 60 * 60 * 24;
export function useSearchMovies(search, opts = { debounceTime: 500 }) {
  const debouncedSearch = useDebounce(search, opts.debounceTime);
  const { isPending, error, data } = useQuery({
    retry: false,
    queryKey: ["/api/search", debouncedSearch],
    queryFn: fetchSearchMovie,
    gcTime: Infinity,
    staleTime: DAY,
  });
  return { isPending, error, data };
}

async function fetchSearchMovie(search) {
  const params = new URLSearchParams();
  const s = search.queryKey[1];

  params.set("s", s.trim());
  if (s.length == 0) {
    return { Search: [], totalResults: "0", Response: "True" };
  }
  const val = await fetch(
    `${API_SERVER}/api/search?${params.toString()}`,
    {
      mode: "cors",
    },
  );
  if (!val.ok) {
    throw await val.json();
  }
  return await val.json();
}
