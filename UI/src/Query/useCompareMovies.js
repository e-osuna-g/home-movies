import { useMutation } from "@tanstack/react-query";
import { API_SERVER } from "./../env.js";
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
  const mutation = useMutation({
    mutationKey: ["/api/compare", movies, lastComparedAt],
    retry: false,
    mutationFn: fetchCompareMovies,
    onSuccess: (data) => {
      setLastComparedAt(data.comparedAt);
    },
  });
  return mutation;
}
async function fetchCompareMovies(search, mutation) {
  const ids = search;

  const comparedAt = mutation.mutationKey[2];

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

        comparedAt: comparedAt // we should be comparing IDs
          ? new Intl.DateTimeFormat("en-CA", fmtOpts).format(
            new Date(comparedAt),
          ).split(",").join("") + ".000"
          : null, //fragtionalseconds are always 000
      }),
    },
  );
  if (!val.ok) {
    console.log("throwing compare error", val);
    throw await val.json();
  }
  return await val.json();
}
