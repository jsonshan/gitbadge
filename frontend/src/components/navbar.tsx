"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import Image from "next/image";
import {
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenu,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { UserIcon } from "lucide-react";
import { HoverBorderGradient } from "./ui/hover-border-gradient";
import SearchBar from "./searchbar";

export default function Navbar({ showSearchBar }: { showSearchBar: boolean }) {
  const { data: session } = useSession();

  return (
    <div className="w-full p-8 flex flex-row items-center justify-between border-b border-secondary">
      <div className="flex flex-row gap-8 items-center w-full">
        <Image
          className="rounded-full w-16 h-16"
          src="/assets/logo.png"
          alt="gitbadge logo"
          width={64}
          height={64}
        />

        {showSearchBar && <SearchBar />}
      </div>

      {!!session && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <HoverBorderGradient as="span" className="p-1">
              <Avatar className="w-16 h-16">
                <AvatarImage src={session.user?.image || ""} />
                <AvatarFallback></AvatarFallback>
              </Avatar>
            </HoverBorderGradient>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => signOut()}>
                <UserIcon />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {session === null && (
        <HoverBorderGradient
          className="w-full text-nowrap"
          as="button"
          onClick={() => signIn()}
        >
          <span>Sign in</span>
        </HoverBorderGradient>
      )}
    </div>
  );
}
