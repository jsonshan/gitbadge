import { LoaderCircleIcon } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex h-full w-full flex-row items-center justify-center">
      <LoaderCircleIcon size={64} className="stroke-primary animate-spin" />
    </div>
  );
}
