"use client";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import { useRouter } from "next/navigation";

import React from "react";
import UploadPdfDialog from "./UploadPdfDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

const Header = () => {
  const route = useRouter();
  return (
    <header className="flex justify-between p-5 shadow-md">
      <Image
        className="cursor-pointer hover:scale-105 transition-all"
        src="/logo.svg"
        width={45}
        height={45}
        alt="logo"
        onClick={() => route.push("/")}
      />

      <div className="flex items-center gap-5">
        <UploadPdfDialog>
          <Button className="cursor-pointer">
            <Plus className="hover:bg-red-600" /> Upload PDF
          </Button>
        </UploadPdfDialog>
        <UserButton />
      </div>
    </header>
  );
};

export default Header;
