"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2} from "lucide-react";
import { useCompletion } from "@ai-sdk/react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { messageSchema } from "@/schemas/messageSchema";
import { useEffect, useState } from "react";
import axios, { all, AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { toast } from "sonner";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import Slider from "@/components/Slider";

const specialChar = "||";

const parseStringMessages = (messageString: string): string[] => {
  return messageString.split(specialChar);
};

const initialMessageString =
  "What's your favorite movie?||Do you have any pets?||What's your dream job?";

const Page = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [gettingUsers, setGettingUser] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const { username } = useParams<{ username: string }>();

  const {
    complete,
    completion,
    isLoading: isSuggestLoading,
    error,
  } = useCompletion({
    api: "/api/suggestMessages",
    initialCompletion: initialMessageString,
  });

  const getAllUsers = async () => {
    setGettingUser(true);
    try {
      const response = await axios.get("/api/getUsers");
      setAllUsers(response.data.message);
      toast.success("User fetched successfully..");
    } catch (error) {
      console.error("Error in fetching all users: ", error);
      const axiosError = error as AxiosError<ApiResponse>;
      const axiosErrorMessage = axiosError.response?.data.message;
      toast.error(axiosErrorMessage);
    } finally {
      setGettingUser(false);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
    },
  });

  const messageContent = form.watch("content");
  const handleMessageClick = (message: string) => {
    form.setValue("content", message);
  };

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post("/api/sendMessage", {
        username,
        content: data.content,
      });
      toast.success(response?.data.message || "Message Send Successfully");
      form.reset();
    } catch (error) {
      console.error("Error in submiting message: ", error);
      const axiosError = error as AxiosError<ApiResponse>;
      const axiosErrorMessage = axiosError.response?.data.message;
      toast.error(axiosErrorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSuggestedMessages = async () => {
    try {
      complete("");
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Error while suggesting messages...");
    }
  };

  return (
    <div className="container flex flex-col items-center justify-center mt-7  text-white gap-5">
      <div className=" flex flex-col justify-start min-w-[80%] ">
        <div className="flex justify-between">
          <h1 className="text-4xl font-bold mb-6 text-center">
            Public Profile Link
          </h1>
          {/* Slider card */}
          <Slider
            gettingUsers={gettingUsers}
            allUsers={allUsers}
          />
        </div>

        {/* Form to handel textarea */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 w-full"
          >
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xl text-white">
                    Send Anonymous Message to @{username}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write your anonymous message here"
                      className="resize-none  bg-gray-400 text-xl text-gray-700"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-center">
              {isLoading ? (
                <>
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-6 w-6 animate-spin text-blue-400" />
                    <h2 className="text-sm font-semibold tracking-wide">
                      Submitting...
                    </h2>
                  </div>
                </>
              ) : (
                <Button
                  disabled={!messageContent}
                  type="submit"
                  className="flex items-center gap-2 bg-gray-800 text-white hover:bg-gray-700 rounded-lg px-4 py-2 transition-all"
                >
                  Send It
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>
      <div className="flex flex-col justify-start items-start min-w-[80%]">
        <div className="mb-5">
          <Button
            onClick={fetchSuggestedMessages}
            disabled={isSuggestLoading}
            className="mb-4 flex items-center gap-2 bg-gray-800 text-white hover:bg-gray-700 rounded-lg px-4 py-2 transition-all"
          >
            Suggest Messages
          </Button>
          <p>Click on any message below to select it</p>
        </div>

        <Card className="w-full h-full bg-gray-700">
          <CardHeader>
            <h3 className="text-xl font-semibold">Messages</h3>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4">
            {error ? (
              <p className="text-red-500">{error.message}</p>
            ) : (
              parseStringMessages(completion).map((message, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="mb-2 bg-gray-400"
                  onClick={() => handleMessageClick(message)}
                >
                  {message}
                </Button>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <Separator className="my-4" />
      <div className="text-center">
        <div className="mb-4">Get Your Message Board</div>
        <Link href={"/signup"}>
          <Button className="flex items-center gap-2 bg-gray-800 text-white hover:bg-gray-700 rounded-lg px-4 py-2 transition-all">
            Create Your Account
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Page;
