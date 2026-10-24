import Carousel from "@/components/Carousel";
import CtaBanner from "@/components/CtaBanner";
import Hero from "@/components/Hero";
import Services from "@/components/Services";

export default function Home() {
  return (
    <>
      <Hero />
      <div style={{ height: 60 }} />
      <Services />
      <div style={{ height: 60 }} />
      <CtaBanner />
      <div style={{ height: 60 }} />
      <Carousel />
    </>
  );
}
