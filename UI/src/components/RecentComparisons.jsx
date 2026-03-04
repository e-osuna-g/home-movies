import { useRecentComparisons } from "../Query/useRecentComparisons.js";
import CompareItem from "./CompareItem.jsx";

export default function RecentComparisons() {
  const { isPending, data, isSuccess } = useRecentComparisons();
  console.log("What is data", data);
  return (
    <div className="compare-carousel">
      {isPending
        ? <div>Loading...</div>
        : isSuccess
        ? data.map((i) => <CompareItem {...i} />)
        : <div>Error on fetching</div>}
    </div>
  );
}
