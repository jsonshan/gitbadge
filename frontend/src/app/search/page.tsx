"use client";

import Navbar from "@/components/navbar";
import { redirect, useSearchParams } from "next/navigation";
import Badges from "./badges";
import Profile from "./profile";
import { Suspense, useEffect, useState } from "react";
import { gitbadges } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";
import Loading from "@/components/ui/loading";

export default function Page() {
  return (
    <Suspense>
      <Search />
    </Suspense>
  );
}

function Search() {
  const searchParams = useSearchParams();
  const username = (searchParams.get("q") || "").trim();
  if (username === "") {
    redirect("/");
  }

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
      <div className="h-full w-full items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <main className="w-full h-full flex flex-col">
      <Navbar showSearchBar={true} />

      <div className="w-full h-full flex flex-col-reverse md:flex-row items-center justify-center">
        <Badges username={username} badges={badges} />
        {badges?.length > 0 && <Profile username={username} />}
      </div>
    </main>
  );
}
