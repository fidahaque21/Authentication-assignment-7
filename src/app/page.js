import AllProducts from "@/components/products/AllProducts";
import Hero from "@/components/Hero";
import Image from "next/image";
import Marquee from "react-fast-marquee";

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee/>
      <AllProducts />
    </>

  );
}
