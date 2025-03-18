import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "./ui/button";
import Link from "next/link";
import { Menu } from "lucide-react";

type SliderCardProps = {
  gettingUsers: boolean;
  allUsers: { _id: string; username: string }[];
};

function Slider({ gettingUsers, allUsers }: SliderCardProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          className="w-10 h-10 flex items-center justify-center bg-gray-700 hover:bg-gray-600 rounded-md shadow-md transition-all md:w-12 md:h-12"
          disabled={gettingUsers}
        >
          <Menu size={20} className="text-white" />
        </Button>
      </SheetTrigger>
      <SheetContent className="bg-gray-800 text-white p-5 rounded-lg shadow-lg w-72 sm:w-80 md:w-96 lg:w-[28rem]">
        <SheetHeader>
          <SheetTitle className="text-lg md:text-xl font-bold text-center">
            Users
          </SheetTitle>
          <SheetDescription className="text-xs md:text-sm text-gray-400 text-center">
            "WhisperChat: Send Secret Messages Anonymously!"
          </SheetDescription>
        </SheetHeader>
        <div className="mt-4 space-y-2 max-h-[50vh] overflow-y-auto">
          {allUsers.map(({ _id, username }) => (
            <div
              key={_id}
              className="p-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-all text-center text-sm md:text-base"
            >
              <Link href={`/u/${username}`} className="block text-white">
                {username}
              </Link>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default Slider;
