"use client";
import React from "react";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "./ui/button";
import Link from "next/link";

const Navbar = () => {
  const { data: session } = useSession();
  const user: User = session?.user as unknown as User;

  return (
    <nav className="p-5 md:p-6 shadow-md bg-[#1C1C1E] border-b border-gray-700">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="text-2xl font-semibold text-gray-100 tracking-wide">
          Mystery Message
        </a>

        {/* Authentication Section */}
        {session ? (
          <div className="flex items-center gap-6">
            <span className="text-lg font-medium text-gray-300">
              Welcome, {user?.username || user?.email}
            </span>
            <Button
              className="px-5 py-2 text-white bg-gray-800 hover:bg-gray-700 rounded-lg shadow-md transition-all"
              onClick={() => signOut()}
            >
              Logout
            </Button>
          </div>
        ) : (
          <Link href="/signIn">
            <Button className="px-5 py-2 text-white bg-gray-800 hover:bg-gray-700 rounded-lg shadow-md transition-all">
              Login
            </Button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
