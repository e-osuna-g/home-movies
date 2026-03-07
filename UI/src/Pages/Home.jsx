import Stack from "@mui/material/Stack";
import CompareSection from "../components/CompareSection";
import HeroSection from "../components/HeroSection";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    document.title = "Movie Comparison - Home";
  }, []); // Empty dependency array means it runs once on mount
  return (
    <Stack spacing={4} maxWidth={"xl"}>
      <HeroSection />
      <CompareSection />
    </Stack>
  );
}
