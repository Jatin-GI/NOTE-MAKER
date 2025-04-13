"use client";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { DeleteIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Dashboard = () => {
  const { user } = useUser();
  const fileList = useQuery(api.FileStorage.GetAllFilesByEmail, {
    email: user?.primaryEmailAddress?.emailAddress,
  });

  const deleteFile = async (fileId) => {
    await api.FileStorage.DeleteFile({ fileId });
  };

  const deleteNotes = async (fileId) => {
    await api.notes.DeleteNotesByFileId({ fileId });
  };

  const deleteRecords = async (fileId) => {
    await deleteFile(fileId);
    await deleteNotes(fileId);
    alert("File and associated notes deleted successfully!");
  };

  return (
    <div>
      {!fileList && <h2 className="font-medium text-3xl">Workspace</h2>}

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-7 mt-10">
        {fileList === undefined ? (
          // Loading skeletons
          [1, 2, 3, 4, 5, 6, 7].map((item, index) => (
            <div
              key={index}
              className="bg-slate-200 rounded-md h-[150px] animate-pulse"
            ></div>
          ))
        ) : fileList.length === 0 ? (
          // Empty state
          <div className="col-span-full text-center text-gray-500 py-10">
            <h3 className="text-lg font-semibold">No notes uploaded yet</h3>
            <p className="text-sm text-gray-500 mt-2">
              Start by uploading a PDF file to create your first note.
            </p>
          </div>
        ) : (
          // Render file cards

          fileList.map((file, index) => (
            <Link key={index} href={"/workspace/" + file.fileId}>
              <div className=" p-5 shadow-md rounded-md flex flex-col items-center justify-center border cursor-pointer hover:scale-105 transition-all relative w-full max-w-xs mx-auto sm:p-5">
                <Image src="/pdf.png" alt="file" width={70} height={70} />
                <div className="mt-3 w-full">
                  <div className="flex justify-center  items-center gap-2 transition-all duration-200">
                    <h2 className="font-medium text-lg text-center   w-full">
                      {file?.fileName}
                    </h2>
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
