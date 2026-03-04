import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
const DAY = 1000 * 60 * 60 * 24;
let fmtOpts = {
  timeZone: "-12:00",
  dateStyle: "short",
  hour12: false,
  timeStyle: "medium",
};

export default function useCompareMovies(movies, lastComparedAtProp = "") {
  const [lastComparedAt, setLastComparedAt] = useState(lastComparedAtProp);
  const [_, setComparedData] = useState(null);
  const mutation = useMutation({
    mutationKey: ["/api/compare", movies, lastComparedAt],
    retry: false,
    mutationFn: fetchCompareMovies,
    onSuccess: (data, variables, onMutateResult, context) => {
      console.log(
        data,
        variables,
        onMutateResult,
        context,
      );
      setComparedData(data);
      setLastComparedAt(data.comparedAt);
    },
  });
  return mutation;
}
async function fetchCompareMovies(search, mutation) {
  const ids = search;
  console.log("received on fetch", search, arguments, mutation);

  const comparedAt = mutation.mutationKey[2];

  const val = await fetch(
    `http://localhost:3000/api/compare`,
    {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        imdbIds: ids,

        comparedAt: comparedAt
          ? new Intl.DateTimeFormat("en-CA", fmtOpts).format(
            new Date(comparedAt),
          ).split(",").join("") + ".000"
          : null, //fragtionalseconds are always 000
      }),
    },
  );
  if (!val.ok) {
    throw new Error("Search error");
  }
  return await val.json();
}
