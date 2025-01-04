"use client";

import { redirect, RedirectType } from "next/navigation";
import { Input } from "./ui/input";

export default function SearchBar() {
  return (
    <form
      className="w-full max-w-sm"
      action={(form) => {
        const username = (form.get("username")?.toString() || "").trim();
        if (!!!username) {
        } else {
          redirect(`/search?q=${form.get("username")}`, RedirectType.push);
        }
      }}
    >
      <Input
        className="w-full"
        name="username"
        type="text"
        autoComplete="off"
        placeholder="🔍 Search a GitHub username (ex: torvalds)"
      />
    </form>
  );
}
