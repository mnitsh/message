"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { signInSchema } from "@/schemas/signInSchema";
import { signIn } from "next-auth/react";

function Page() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver<z.infer<typeof signInSchema>>(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const { watch } = form;
  const identifier = watch("identifier");
  const password = watch("password");

  const isFormValid = identifier.trim() !== "" && password.trim() !== "";

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true);
    try {
      const result = await signIn("Credentials", {
        redirect: false,
        identifier: data.identifier,
        password: data.password,
      });

      if (result?.error) {
        toast.error("Incorrect username or password");
      }

      if (result?.url) {
        router.replace("/dashboard");
      }
    } catch (error) {
      toast("Error while signing in");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#1F1F22] to-[#141416] text-gray-300 px-4">
      <div className="w-full max-w-md p-10 bg-[#1C1C1E] shadow-lg rounded-xl">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-gray-200">Welcome Back</h1>
          <p className="text-gray-400 mt-1">
            Sign in to continue your anonymous adventure
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-400">Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter username"
                      {...field}
                      className="bg-gray-800 text-gray-300 border-gray-700 focus:border-blue-500 focus:ring-0"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-400">Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter password"
                      {...field}
                      className="bg-gray-800 text-gray-300 border-gray-700 focus:border-blue-500 focus:ring-0"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className={`w-full text-white font-semibold rounded-lg py-2 transition-all ${
                isFormValid
                  ? "bg-blue-600 hover:bg-blue-500"
                  : "bg-gray-600 cursor-not-allowed"
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please Wait
                </>
              ) : (
                "Log In"
              )}
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p className="text-gray-400">
            New here?{" "}
            <Link href="/signup" className="text-blue-400 hover:text-blue-500">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Page;
