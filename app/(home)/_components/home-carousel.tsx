"use client";

import * as React from "react";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Link from "next/link";

export default function HomeCarousel({
  items,
}: {
  items: {
    image: string;
    url: string;
    title: string;
  }[];
}) {
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  );

  return (
    <Carousel
      dir="ltr"
      plugins={[plugin.current]}
      opts={{ loop: true }}
      className="w-full mx-auto bg-white"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent>
        {items.map((item) => (
          <CarouselItem key={item.title}>
            <Link href={item.url}>
              <div className="flex aspect-[16/6] items-center justify-center p-6 relative -m-1 bg-muted overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                  priority
                />

                {/* Gradient overlay */}
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-b from-transparent to-border dark:to-[hsl(210,0%,12%)] pointer-events-none z-[1]" />

                <div className="absolute w-1/3 left-16 md:left-32 top-1/2 transform -translate-y-1/2 z-[2]">
                  <h2 className="text-xl md:text-6xl font-bold mb-4 text-primary drop-shadow-lg">
                    {item.title}
                  </h2>
                </div>
              </div>
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious
        variant={null}
        className="absolute left-0 md:left-3 top-1/4 text-black -translate-y-1/2 h-1/3 w-20 border-2 border-gray-200/50 hover:border-ring/70 cursor-pointer rounded-xl"
        iconSize={8}
      />
      <CarouselNext
        variant={null}
        className="absolute right-0 md:right-3 top-1/4 text-black -translate-y-1/2 h-1/3 w-20 border-2 border-gray-200/50 hover:border-ring/70 cursor-pointer rounded-xl"
        iconSize={8}
      />
    </Carousel>
  );
}
