import { useQuery } from "@tanstack/react-query";
import useDebounce from "../hooks/useDebounce";
import { API_SERVER } from "../env.js";
import { DAY_IN_MILI } from "../utils.js";
export function useSearchMovies(search, opts = { debounceTime: 500 }) {
  const debouncedSearch = useDebounce(search, opts.debounceTime);
  const { isPending, error, data } = useQuery({
    retry: false,
    queryKey: ["/api/search", debouncedSearch],
    queryFn: fetchSearchMovie,
    gcTime: Infinity,
    staleTime: DAY_IN_MILI,
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
