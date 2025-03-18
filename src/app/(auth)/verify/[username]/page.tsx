"use client";

import axios, { AxiosError } from "axios";
import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { verifySchema } from "@/schemas/verifySchema";
import { ApiResponse } from "@/types/ApiResponse";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

function Page({ params }: { params: { username: string } }) {
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [isSubmittingOtp, setIsSubmittingOtp] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const router = useRouter();

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: "",
    },
  });

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    const otpString = newOtp.join("");
    form.setValue("code", otpString);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowRight" && index < 5 && otp[index]) {
      inputRefs.current[index + 1]?.focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    setIsSubmittingOtp(true);
    try {
      const otpString = otp.join("");
      const response = await axios.post("/api/verifyCode", {
        username: params?.username,
        verifyCode: otpString,
      });
      toast.success(response.data.message);
      setOtp(new Array(6).fill(""));
      inputRefs.current[0]?.focus();
      router.replace("/signIn");
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message);
    } finally {
      setIsSubmittingOtp(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 p-4">
      <div className="bg-gray-800 text-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <div className="text-center">
          <h1 className="text-5xl font-extrabold tracking-tight text-white lg:text-6xl mb-6">
            Verify Your Account
          </h1>
          <p className="mb-6 text-lg text-gray-300">
            Enter the verification code sent to your email
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="code"
              render={() => (
                <FormItem>
                  <FormLabel className="text-gray-300">
                    Verification Code
                  </FormLabel>
                  <FormControl>
                    <div className="flex justify-center gap-2">
                      {otp.map((digit, index) => (
                        <Input
                          key={index}
                          ref={(el) => {
                            inputRefs.current[index] = el;
                          }}
                          type="tel"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleChange(index, e.target.value)}
                          onKeyDown={(e) => handleKeyDown(index, e)}
                          className="w-12 h-12 text-center text-xl border border-gray-600 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={isSubmittingOtp}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition disabled:opacity-50"
            >
              {isSubmittingOtp ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Please Wait
                </>
              ) : (
                "Submit"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default Page;
