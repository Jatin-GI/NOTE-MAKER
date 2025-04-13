"use Client";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { UserButton } from "@clerk/nextjs";
import { useEditor } from "@tiptap/react";
import { useMutation } from "convex/react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

const WorkspaceHeader = ({ fileName, editor }) => {
  const { fileId } = useParams();
  const saveNotes = useMutation(api.notes.updateNotes);
  const route = useRouter();
  const handleSave = async () => {
    if (!fileId || !editor) return;
    toast("Notes Saved");
    const content = editor.getHTML();
    await saveNotes({
      fileId: fileId.toString(), // make sure it's a string
      notes: content,
    });
  };

  return (
    <div className="flex justify-between shadow-md p-4">
      <Image
        className="cursor-pointer hover:scale-105 transition-all"
        onClick={() => route.push("/dashboard")}
        src={"/logo.svg"}
        width={45}
        height={45}
        alt="logo"
      />
      <h2 className="text-black text-3xl font-bold hover:scale-105">
        {fileName || "Untitled File"}
      </h2>
      <div className="flex gap-7">
        <Button
          className="cursor-pointer hover:bg-[#ff0a0a] hover:scale-105 transition-all"
          onClick={handleSave}
        >
          Save
        </Button>
        <UserButton />
      </div>
    </div>
  );
};

export default WorkspaceHeader;
