import Stack from "@mui/material/Stack";
import CompareSection from "../components/CompareSection";
import HeroSection from "../components/HeroSection";

export default function Home() {
  return (
    <Stack spacing={4} maxWidth={"xl"}>
      <HeroSection />
      <CompareSection />
    </Stack>
  );
}
