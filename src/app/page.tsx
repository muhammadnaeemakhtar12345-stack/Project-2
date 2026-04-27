import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { HowItWorks } from "@/components/HowItWorks";
import { Uploader } from "@/components/Uploader";

export default function Home() {
  return (
    <>
      <Hero />
      <Uploader />
      <HowItWorks />
      <Features />
    </>
  );
}
