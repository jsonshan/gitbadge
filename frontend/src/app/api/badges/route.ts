import { db } from "@/db/drizzle";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const username = (request.nextUrl.searchParams.get("username") || "").trim();

  if (username === "") {
    return Response.json(
      { message: "expected query parameter 'username'" },
      { status: 400 },
    );
  }

  try {
    const data = await db.query.users.findFirst({
      where: eq(users.username, username),
      with: { badges: true },
    });

    if (data === undefined) {
      return Response.json({ message: "", badges: undefined }, { status: 200 });
    }
    return Response.json(
      { message: "", badges: data?.badges },
      { status: 200 },
    );
  } catch (e) {
    console.error(e);
    return Response.json(
      { message: "there was an issue fetching those badges" },
      { status: 500 },
    );
  }
}
