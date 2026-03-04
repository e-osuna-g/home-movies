import Link from "@mui/material/Link";

export default function CompareItem(prop) {
  console.log("###props", prop);
  const query = new URLSearchParams();
  for (let i of prop.imdbIds) {
    query.append("movies", i);
  }
  query.append("compared_at", prop.comparedAt);
  return (
    <div>
      <div className="compare-carousel-item">
        {prop.Titles.map((title) => <div>{title}</div>)}
      </div>
      <Link underline="always" href={`/compare?${query.toString()}`}>
        Compare
      </Link>
    </div>
  );
}
