"use client";

import Navbar from "@/components/navbar";
import { redirect, useSearchParams } from "next/navigation";
import Badges from "./badges";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Profile from "./profile";

export default function Page() {
  const searchParams = useSearchParams();
  const username = (searchParams.get("q") || "").trim();
  if (username === "") {
    redirect("/");
  }

  return (
    <main className="w-full h-full flex flex-col">
      <Navbar showSearchBar={true} />

      <div className="w-full h-full flex flex-col-reverse md:flex-row">
        <Badges username={username} />
        <Profile username={username} />
      </div>
    </main>
  );
}
