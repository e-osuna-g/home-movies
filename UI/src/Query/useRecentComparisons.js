import { useQuery } from "@tanstack/react-query";
import { API_SERVER } from "../env.js";
import { DAY_IN_MILI } from "../utils.js";

export function useRecentComparisons() {
  //remember to remove cache after compare mutation
  const { isPending, error, data, isSuccess } = useQuery({
    queryKey: ["/api/comparisons/recent"],
    queryFn: fetchRecentComparisons,
    gcTime: DAY_IN_MILI,
    staleTime: DAY_IN_MILI,
  });
  return { isPending, error, data, isSuccess };
}

async function fetchRecentComparisons() {
  const val = await fetch(
    `${API_SERVER}/api/comparisons/recent`,
    {
      mode: "cors",
    },
  );
  if (!val.ok) {
    throw new Error("Error on fetch comparisons");
  }
  return await val.json();
}
