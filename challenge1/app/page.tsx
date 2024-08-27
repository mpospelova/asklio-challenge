import AddRequestButton from "@/components/AddRequestButton";
import RequestOverview from "@/components/RequestOverview";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex justify-flex flex-col h-screen bg-zinc-50">
      <div className="m-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Procurement Requests</h1>
          <AddRequestButton />
        </div>
        <Separator className="mt-3" />
        <RequestOverview />
      </div>
    </main>
  );
}
