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
import { boolean } from "zod";

type sliderCardProps = {
  gettingUsers: boolean;
  getAllUsers: () => void;
  allUsers: { _id: string; username: string }[];
};

function Slider({ getAllUsers, gettingUsers, allUsers }: sliderCardProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          onClick={getAllUsers}
          className="w-10 h-10 flex items-center justify-center bg-gray-700 hover:bg-gray-600 rounded-md shadow-md transition-all"
          disabled={gettingUsers}
        >
          <Menu size={20} className="text-white" />
        </Button>
      </SheetTrigger>
      <SheetContent className="bg-gray-800 text-white p-5 rounded-lg shadow-lg w-72">
        <SheetHeader>
          <SheetTitle className="text-xl font-bold text-center">
            Users
          </SheetTitle>
          <SheetDescription className="text-sm text-gray-400 text-center">
            "WhisperChat: Send Secret Messages Anonymously!"
          </SheetDescription>
        </SheetHeader>
        <div className="mt-4 space-y-2">
          {allUsers.map(({ _id, username }) => (
            <div
              key={_id}
              className="p-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-all"
            >
              <Link
                href={`/u/${username}`}
                className="block text-white text-center"
              >
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
