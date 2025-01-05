"use client";

import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

const badgeIdToUrl: Map<string, string> = new Map([
  ["night-owl", "/assets/badges/0.webp"],
  ["early_bird", "/assets/badges/early_bird.png"],
  ["polygot", "/assets/badges/polygot.png"],
  ["summer", "/assets/badges/summer.png"],
  ["winter", "/assets/badges/winter.png"],
  ["spring", "/assets/badges/spring.png"],
  ["autumn", "/assets/badges/autumn.png"],
  ["one_year", "/assets/badges/one_year.png"],
  ["five_years", "/assets/badges/five_years.png"],
]);

const badgeIdToDescription: Map<string, string> = new Map([
  ["night-owl", "I commit code frequently between midnight and 6 AM"],
  ["early_bird", "I commit code frequently in the morning!"],
  ["polygot", "I commit code in different languages!"],
  ["summer", "I commit code the most during the summer!"],
  ["winter", "I commit code the most during the winter!"],
  ["spring", "I commit code the most during the spring!"],
  ["autumn", "I commit code the most during Autumn"],
  ["one_year", "I have been hacking for at least 1 year!"],
  ["five_years", "I have been hacking for at least 5 years!"],
]);

export default function Badge({ badgeId }: { badgeId: string }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Image
            className="rounded w-16 h-16 hover:cursor-help"
            src={badgeIdToUrl.get(badgeId) || ""}
            alt="badge"
            width={64}
            height={64}
          />
        </TooltipTrigger>
        <TooltipContent>
          <p>{badgeIdToDescription.get(badgeId)}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
