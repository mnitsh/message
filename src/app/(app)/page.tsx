"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Autoplay from "embla-carousel-autoplay";
import messages from "@/messages.json";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Main content fills remaining space */}
      <main className="flex-grow flex flex-col items-center justify-center px-6 md:px-24 py-12 bg-gray-800 text-white">
        <section className="text-center mb-10">
          <h1 className="text-3xl md:text-5xl font-bold leading-tight">
            Dive into the World of Anonymous Feedback
          </h1>
          <p className="mt-3 md:mt-4 text-lg text-gray-300">
            True Feedback - Where your identity remains a secret.
          </p>
        </section>

        {/* Carousel for Messages */}
        <div className="w-full max-w-lg md:max-w-2xl">
          <Carousel plugins={[Autoplay({ delay: 5000 })]} className="relative">
            <CarouselContent>
              {messages.map((message, index) => (
                <CarouselItem key={index} className="p-4">
                  <Card className="bg-gray-700 text-white shadow-md">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold">
                        {message.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-start space-y-2">
                      <div className="flex items-center space-x-3">
                        <Mail className="w-5 h-5 text-blue-400" />
                        <p className="text-gray-300">{message.content}</p>
                      </div>
                      <p className="text-xs text-gray-400">
                        {message.received}
                      </p>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </main>

      {/* Footer always at the bottom */}
      <footer className="w-full bg-gray-900 text-gray-300 py-6 px-4 md:px-12 text-center bottom-0">
        <div className="mb-4 flex justify-center space-x-6 text-sm">
          <Link href="#" className="hover:text-white transition">
            Home
          </Link>
          <Link href="#" className="hover:text-white transition">
            About
          </Link>
          <Link href="#" className="hover:text-white transition">
            Contact
          </Link>
          <Link href="#" className="hover:text-white transition">
            Privacy Policy
          </Link>
        </div>
        <p className="text-xs">&copy; {new Date().getFullYear()} True Feedback. All rights reserved.</p>
      </footer>
    </div>
  );
}
