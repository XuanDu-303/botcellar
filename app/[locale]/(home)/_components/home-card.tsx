"use client"; // Đảm bảo chạy ở client

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { CardItem } from "@/types";
import useDeviceType from "@/hooks/use-device-type";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const CardUnit = ({ card }: { card: CardItem }) => (
  <Card className="flex flex-col h-full rounded-none border-none bg-white/90 dark:bg-black/80 shadow-lg">
    <CardContent className="px-4 pt-6 flex-grow">
      <h3 className="text-xl font-bold mb-4 line-clamp-1">{card.title}</h3>
      <div className="grid grid-cols-2 gap-4">
        {card.items.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex flex-col group"
          >
            <div className="relative aspect-square mb-2 overflow-hidden bg-gray-100 rounded-sm">
              <Image
                src={item.image}
                alt={item.name}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-contain transition-transform group-hover:scale-105"
              />
            </div>
            <p className="text-center text-xs md:text-sm font-medium truncate">
              {item.name}
            </p>
          </Link>
        ))}
      </div>
    </CardContent>
    {card.link && (
      <CardFooter className="pt-2">
        <Link
          href={card.link.href}
          className="text-blue-600 hover:underline text-sm font-medium"
        >
          {card.link.text}
        </Link>
      </CardFooter>
    )}
  </Card>
);

export default function HomeCard({ cards }: { cards: CardItem[] }) {
  const deviceType = useDeviceType();
  const [mounted, setMounted] = useState(false);

  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true }),
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="min-h-[300px]" />;

  if (deviceType === "mobile") {
    return (
      <Carousel
        opts={{ align: "start", loop: true }}
        className="w-full"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {cards.map((card, index) => (
            <CarouselItem
              key={index}
              className="pl-2 md:pl-4 basis-full sm:basis-1/2"
            >
              <CardUnit card={card} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious
          variant={null}
          className="absolute left-2 md:left-3 top-2/4 -translate-y-1/2 h-1/8 w-1/6 border-2 border-gray-200/50 hover:border-ring/70 cursor-pointer rounded-xl"
          iconSize={8}
        />
        <CarouselNext
          variant={null}
          className="absolute right-2 md:right-3 top-2/4 -translate-y-1/2 h-1/8 w-1/6 border-2 border-gray-200/50 hover:border-ring/70 cursor-pointer rounded-xl"
          iconSize={8}
        />
      </Carousel>
    );
  }

  // Desktop Grid
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <CardUnit key={index} card={card} />
      ))}
    </div>
  );
}
