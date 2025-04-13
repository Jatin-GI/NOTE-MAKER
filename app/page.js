"use client";
import { Button } from "@/components/ui/button";
import Hero from "@/components/ui/custom/Hero";
import { api } from "@/convex/_generated/api";
import { UserButton, useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import React, { useEffect } from "react";

const page = () => {
  const { user } = useUser();
  const createUser = useMutation(api.user.createUser);
  const route = useRouter();
  useEffect(() => {
    user && CheckUser();
  }, [user]);

  const CheckUser = async () => {
    const result = await createUser({
      name: user?.fullName,
      email: user?.primaryEmailAddress?.emailAddress,
      picture: user?.imageUrl,
    });
    console.log(result);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="w-full flex items-center justify-between ">
        <Image
          className="cursor-pointer m-3"
          src="/logo.svg"
          width={45}
          height={45}
          alt="logo"
          onClick={() => route.push("/")}
        />
        {user ? (
          <div className="m-3">
            <UserButton />
          </div>
        ) : (
          <Button
            onClick={() => route.push("/dashboard")}
            className="m-3 text-base cursor-pointer sm:text-lg px-6 py-3 rounded-xl shadow-md hover:bg-[#ff0a0a] text-white transition-transform hover:scale-105"
          >
            Sign In
          </Button>
        )}
      </header>
      <main className="h-screen">
        <Hero />
      </main>
    </div>
  );
};

export default page;
