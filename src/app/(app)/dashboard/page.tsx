"use client";

import { Message } from "@/model/Message.model";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { acceptMessageScheam } from "@/schemas/acceptMessageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import axios, { AxiosError } from "axios";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Loader2, RefreshCcw, Copy } from "lucide-react";
import MessageCard from "@/components/MessageCard";

function Page() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const { data: session } = useSession();

  const form = useForm<z.infer<typeof acceptMessageScheam>>({
    resolver: zodResolver(acceptMessageScheam),
    defaultValues: {
      acceptMessages: true,
    },
  });

  const { setValue, watch, register } = form;
  const acceptMessages = watch("acceptMessages");

  const fetchAcceptMessages = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/acceptMessages");
      setValue("acceptMessages", response.data.isAcceptingMessage ?? true);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data?.message || "Failed to fetch message setting"
      );
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  const fetchMessages = useCallback(async (refresh: boolean = false) => {
    setIsLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/getMessages");
      setMessages(
        Array.isArray(response.data.message) ? response.data.message : []
      );
      if (refresh) toast.success("Showing latest messages");
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data?.message || "Failed to fetch messages"
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!session || !session.user) return;
    fetchAcceptMessages();
    fetchMessages();
  }, [fetchAcceptMessages, fetchMessages, session]);

  const handleSwitchChange = async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.post<ApiResponse>("/api/acceptMessages", {
        acceptMessages: !acceptMessages,
      });
      setValue("acceptMessages", !acceptMessages);
      toast.success(response.data.message);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data?.message || "Failed to update settings"
      );
    } finally {
      setIsSwitchLoading(false);
    }
  };

  const handleDeleteMessage = (messageId: string) => {
    setMessages((prevMessages) =>
      prevMessages.filter((message) => message._id !== messageId)
    );
  };

  const username = session?.user?.username;
  const baseUrl = `${window.location.protocol}//${window.location.hostname}`;
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      toast.success("Profile URL copied!");
    } catch {
      toast.error("Failed to copy URL");
    }
  };

  if (!session || !session.user) {
    return (
      <div className="flex items-center gap-3 p-6">
        <Loader2 className="h-12 w-12 animate-spin text-blue-400" />
        <h2 className="text-2xl font-semibold tracking-wide">Loading...</h2>
      </div>
    );
  }

  return (
    <>
      {/* Main content wrapper, starts right after navbar */}
      <div className="flex-grow flex flex-col items-center w-full px-4 md:px-8 lg:px-16 overflow-auto">
        <div className="w-full max-w-6xl p-8 bg-gradient-to-br from-[#2C2C2E] to-[#1C1C1E] shadow-lg rounded-lg text-white relative">
          <h1 className="text-4xl font-extrabold mb-6 text-center">
            User Dashboard
          </h1>

          {/* Unique Link Section */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">
              Your Unique Profile Link
            </h2>
            <div className="flex items-center bg-gray-400 p-3 rounded-lg shadow-md">
              <input
                type="text"
                value={profileUrl}
                disabled
                className="flex-1 p-2 text-gray-700 bg-transparent outline-none font-semibold"
              />
              <Button
                onClick={copyToClipboard}
                className="ml-2 flex items-center gap-2 bg-gray-800 text-white hover:bg-gray-700 rounded-lg px-4 py-2 transition-all"
              >
                <Copy className="w-4 h-4" />
                Copy
              </Button>
            </div>
          </div>

          {/* Accept Messages Toggle */}
          <div className="mb-6 flex items-center">
            <Switch
              {...register("acceptMessages")}
              checked={acceptMessages}
              onCheckedChange={handleSwitchChange}
              disabled={isSwitchLoading}
            />
            <span className="ml-2 text-lg font-semibold">
              Accept Messages: {acceptMessages ? "On" : "Off"}
            </span>
          </div>
          <Separator className="border-white opacity-30" />

          {/* Refresh Messages Button */}
          <div className="flex justify-center mt-6">
            <Button
              variant="outline"
              onClick={() => fetchMessages(true)}
              disabled={isLoading}
              className="bg-gray-800 text-white hover:bg-gray-700 rounded-lg px-4 py-2 transition-all flex items-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <RefreshCcw className="h-5 w-5" />
              )}
              Refresh Messages
            </Button>
          </div>

          {/* Messages List */}
          <div className="mt-6 w-full flex justify-center max-h-[315px] overflow-y-auto scrollbar-hidden">
            {messages.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                {messages.map((message, index) => (
                  <MessageCard
                    key={(message?._id as string) || `fallback-${index}`}
                    message={message}
                    onMessageDelete={handleDeleteMessage}
                  />
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-200 text-lg font-semibold flex items-center justify-center min-h-[300px]">
                No messages to display.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Page;
