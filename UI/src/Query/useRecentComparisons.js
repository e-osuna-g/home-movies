import { useQuery } from "@tanstack/react-query";

const DAY = 1000 * 60 * 60 * 24;

export function useRecentComparisons() {
  //remember to remove cache after compare mutation
  const { isPending, error, data, isSuccess } = useQuery({
    queryKey: ["/api/comparisons/recent"],
    queryFn: fetchRecentComparisons,
    gcTime: DAY,
    staleTime: DAY,
  });
  return { isPending, error, data, isSuccess };
}

async function fetchRecentComparisons() {
  const val = await fetch(
    `http://localhost:3000/api/comparisons/recent`,
    {
      mode: "cors",
    },
  );
  if (!val.ok) {
    throw new Error("Error on fetch comparisons");
  }
  return await val.json();
}
