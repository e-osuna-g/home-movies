import { useQuery } from "@tanstack/react-query";

const DAY = 1000 * 60 * 60 * 24;

export function useGetMovie(id) {
  console.log("gettign id", id);
  const { isPending, error, data } = useQuery({
    queryKey: ["/api/movie/:imdbId", id],
    queryFn: fetchSearchMovie,
    gcTime: DAY,
    staleTime: DAY,
  });
  return { isPending, error, data };
}

async function fetchSearchMovie(search) {
  const id = search.queryKey[1];
  if (!id) {
    return { "Response": "False", "Error": "Incorrect IMDb ID." };
  }
  const val = await fetch(
    `http://localhost:3000/api/movie/${id}`,
    {
      mode: "cors",
    },
  );
  if (!val.ok) {
    throw new Error("Search error");
  }
  return await val.json();
}
