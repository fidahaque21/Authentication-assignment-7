import React from "react";
import Link from "next/link";
import Image from "next/image";

const Hero = () => {
return ( <section className="bg-[#f0f5f1] px-4 py-6 sm:px-6 lg:px-8"> <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-8 rounded-[24px] border border-[#e0e9e1] bg-[#fbfdfb] px-5 py-7 sm:px-8 sm:py-9 md:flex-row md:gap-6 lg:px-10">

```
    {/* Left Content */}
    <div className="w-full md:max-w-[65%]">
      <span className="inline-block rounded-full bg-[#e0f2e7] px-3 py-1.5 text-sm font-semibold text-[#159447]">
        শনিবার, ৩ অক্টোবর, ২০২৬
      </span>

      <h1 className="mt-4 text-2xl font-extrabold leading-tight text-[#202923] sm:text-3xl lg:text-4xl">
        আজকের বাজারের দাম এক নজরে
      </h1>

      <p className="mt-5 max-w-xl text-sm leading-7 text-[#747d76] sm:text-base">
        চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম —
        বাজারভিত্তিক বিস্তারিত, গড়, সর্বনিম্ন-সর্বোচ্চ
        এবং দামের পরিবর্তন এক জায়গায়।
      </p>

      <Link
        href="#"
        className="mt-7 inline-flex items-center justify-center rounded-lg bg-[#078b42] px-6 py-3 text-sm font-bold text-white shadow-md transition duration-200 hover:bg-[#067536] hover:shadow-lg"
      >
        সব পণ্য দেখুন
      </Link>
    </div>

    {/* Right Illustration */}
    <div className="flex w-full items-center justify-center md:w-[35%]">
      <Image
        src="/bazar-hero.png"
        alt="বাজারের বিভিন্ন পণ্য"
        width={280}
        height={250}
        priority
        className="h-auto w-48 object-contain sm:w-56 md:w-full md:max-w-[280px]"
      />
    </div>

  </div>
</section>


);
};

export default Hero;
