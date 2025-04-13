"use client";
import React from "react";
import { Button } from "../button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { UserButton, useUser } from "@clerk/nextjs";

const Hero = () => {
  const router = useRouter();
  const { user } = useUser();
  return (
    <section className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-[#f1f2f6] via-[#f9fafe] to-[#e0f7ff] px-6 md:px-20 py-16 text-center">
      {/* Headline */}
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight max-w-4xl">
        Simplify <span className="text-red-500">PDF</span>{" "}
        <span className="text-blue-500">Note</span>
        -Taking with <span className="text-gray-800">AI-Powered</span>
      </h1>

      {/* Subtext */}
      <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-2xl">
        Elevate your note-taking experience with our AI-powered PDF app.
        Seamlessly extract key insights, summaries, and annotations from any PDF
        with just a few clicks.
      </p>

      {/* Buttons */}
      <div className="mt-10 flex gap-4 flex-col sm:flex-row">
        <Button
          onClick={() => router.push("/dashboard")}
          className="cursor-pointer hover:bg-[#ff0a0a] bg-black hover:scale-105  text-white px-6 py-3 rounded-full text-lg transition-all"
        >
          Get started
        </Button>
        <Button
          variant="secondary"
          className="bg-gray-200 cursor-pointer hover:bg-gray-300 text-black px-6 py-3 hover:scale-105 rounded-full text-lg transition-all"
        >
          Learn more
        </Button>
      </div>
    </section>
  );
};

export default Hero;
