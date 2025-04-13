"use client";
import { Button } from "@/components/ui/button";
import { Layout, Plus, Shield } from "lucide-react";
import Image from "next/image";
import React from "react";
import UploadPdfDialog from "./UploadPdfDialog";
import { useRouter } from "next/navigation";

const SideBar = () => {
  const route = useRouter();
  return (
    <div className="shadow-md h-screen p-7">
      <Image
        onClick={() => route.push("/")}
        className="cursor-pointer hover:scale-105 transition-all"
        src={"./logo.svg"}
        width={45}
        height={45}
        alt="logo"
      />
      <div className="mt-10">
        <UploadPdfDialog>
          <Button className="cursor-pointer">
            <Plus className="hover:bg-red-600" /> Upload PDF
          </Button>
        </UploadPdfDialog>

        <div className="flex items-center gap-2 p-3 mt-5 hover:bg-slate-100 rounded-lg cursor-pointer">
          <Layout />
          <h2>Workspace</h2>
        </div>
        <div className="flex items-center gap-2 p-3 mt-5 hover:bg-slate-100 rounded-lg cursor-pointer">
          <Shield />
          <h2>Upgrade</h2>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
