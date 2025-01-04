import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Profile({ username }: { username: string }) {
  return (
    <div className="h-full w-1/3 py-8 pr-8">
      <div className="flex flex-col gap-4 border border-accent rounded p-8">
        <div className="w-full flex flex-row gap-4 items-center">
          <Avatar className="w-16 h-16 border border-primary">
            <AvatarImage src="" />
            <AvatarFallback>{username.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <h1 className="text-2xl">{username}</h1>
        </div>

        <div className="w-fit">
          <div className="w-full flex flex-row gap-14 items-center justify-between">
            <h1>Hacking Since:</h1>
            <p>12/15/2001</p>
          </div>

          <div className="w-full flex flex-row gap-14 items-center justify-between">
            <h1>Total Number of Commits:</h1>
            <p>56,000</p>
          </div>

          <div className="w-full flex flex-row gap-14 items-center justify-between">
            <h1>Total Number of Repos:</h1>
            <p>8</p>
          </div>

          <div className="w-full flex flex-row gap-14 items-center justify-between">
            <h1>Number of Badges Earned:</h1>
            <p>150</p>
          </div>
        </div>
      </div>
    </div>
  );
}
