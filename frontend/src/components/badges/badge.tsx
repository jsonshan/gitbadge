"use client";

import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

function badgeIdToUrl(badgeId: string): string {
  return `/assets/badges/0.webp`;
}

const badgeIdToDescription: Map<string, string> = new Map([
  ["0", "I commit code frequently between midnight and 6 AM"],
]);

export default function Badge({ badgeId }: { badgeId: string }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Image
            className="rounded w-16 h-16 hover:cursor-help"
            src={badgeIdToUrl(badgeId)}
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
