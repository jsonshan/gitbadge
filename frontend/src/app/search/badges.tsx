"use client";

import Badge from "@/components/badges/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Loading from "@/components/ui/loading";
import { Spotlight } from "@/components/ui/spotlight";
import { gitbadges } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";
import { useEffect, useState } from "react";

export default function Badges({ username }: { username: string }) {
  const [loading, setLoading] = useState(false);
  const [badges, setBadges] = useState<InferSelectModel<typeof gitbadges>[]>(
    [],
  );

  useEffect(() => {
    setLoading(true);
    (async () => {
      const request = await fetch(
        `${window.location.origin}/api/badges?username=${username}`,
      );
      const data = await request.json();
      setLoading(false);
      setBadges(data.badges as InferSelectModel<typeof gitbadges>[]);
    })();
  }, [username]);

  if (loading) {
    return (
      <div className="flex-grow">
        <Loading />
      </div>
    );
  }

  if (badges.length === 0) {
    return (
      <div className="h-full flex-grow-0 rounded-md flex md:items-center md:justify-center bg-background antialiased bg-grid-white/[0.02] relative overflow-hidden">
        <Spotlight
          className="-top-40 left-0 md:left-60 md:-top-20"
          fill="white"
        />
        <div className="p-4 max-w-7xl mx-auto relative z-10 w-full pt-20 md:pt-0">
          <h1 className="text-4xl md:text-6xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
            {username} doesn&apos;t have any badges yet <br /> Check back later!
          </h1>
          <p className="mt-4 font-normal text-base text-neutral-300 max-w-lg text-center mx-auto">
            If this is your account, sign in with GitHub to queue your badges!
          </p>
        </div>
      </div>
    );
  }

  const b = [];
  for (let i = 0; i < 150; i++) {
    b.push(badges[0]);
  }

  return (
    <div className="flex-1 h-full p-8 flex flex-row items-center justify-center">
      <div className="w-full h-full flex flex-col gap-2">
        <div className="border rounded border-accent p-4 flex flex-row flex-wrap gap-4 items-start justify-start">
          {b.map((badge, i) => {
            return <Badge key={i} badgeId={badge.badgeId} />;
          })}
        </div>
      </div>
    </div>
  );
}
