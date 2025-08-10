import React from "react";

const Box = ({ className = "" }) => (
  <div className={`rounded-2xl bg-gradient-to-br from-white/40 to-white/20 dark:from-white/10 dark:to-white/5 border dark:border-white/10 border-lightaccent/30 ${className}`}></div>
);

export default function GallerySkeleton() {
  return (
    <div className="md:px-[10%] px-[5%] w-full sm:mt-0 mt-[3rem]">
      <div className="text-center pb-8">
        <div className="inline-block h-8 md:h-10 w-40 md:w-56 rounded-lg bg-white/60 dark:bg-white/10 animate-pulse" />
        <div className="mx-auto mt-3 h-4 w-64 md:w-96 rounded bg-white/50 dark:bg-white/10 animate-pulse" />
      </div>
      <div className="portfolio-tabs relative rounded-[20px] overflow-hidden md:px-4">
        <Box className="h-16 w-full animate-pulse" />
      </div>
      <div className="container mx-auto flex justify-center items-center overflow-hidden pb-[5%] mt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-2xl overflow-hidden animate-pulse">
              <div className="aspect-[9/16] sm:aspect-video lg:aspect-square bg-white/60 dark:bg-white/10" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
