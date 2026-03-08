import { useMutation } from "@tanstack/react-query";
import { API_SERVER } from "./../env.js";
import { useState } from "react";

export default function useCompareMovies(
  movies,
  idP = null,
) {
  const [id, setId] = useState(idP);
  const mutation = useMutation({
    mutationKey: ["/api/compare", movies, id],
    retry: false,
    mutationFn: fetchCompareMovies,
    onSuccess: (data) => {
      setId(data.id);
    },
  });
  return mutation;
}
async function fetchCompareMovies(search, mutation) {
  const ids = search;

  const id = mutation.mutationKey[2];
  const val = await fetch(
    `${API_SERVER}/api/compare`,
    {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        imdbIds: ids,
        id: id,
      }),
    },
  );
  if (!val.ok) {
    throw await val.json();
  }
  return await val.json();
}
