"use client";
import React, { useEffect } from "react";
import WorkspaceHeader from "../_components/WorkspaceHeader";
import { useParams } from "next/navigation";
import PdfViewer from "../_components/PdfViewer";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import TextEditor from "../_components/TextEditor";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import BulletList from "@tiptap/extension-bullet-list";
import Document from "@tiptap/extension-document";
import ListItem from "@tiptap/extension-list-item";
import Paragraph from "@tiptap/extension-paragraph";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Text from "@tiptap/extension-text";
import { useEditor } from "@tiptap/react";

const Workspace = () => {
  const editor = useEditor({
    extensions: [
      Document,
      Underline,
      Highlight,
      Paragraph,
      Text,
      BulletList,
      ListItem,
      StarterKit.configure({
        underline: false,
        highlight: false,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Placeholder.configure({
        placeholder: "Start Taking Your Notes.....",
      }),
    ],

    editorProps: {
      attributes: {
        class: "focus:outline-none h-screen p-5",
      },
    },
    immediatelyRender: false,
  });

  const { fileId } = useParams();
  const fileInfo = useQuery(api.FileStorage.GetFileRecord, {
    fileId: fileId,
  });

  useEffect(() => {
    console.log(fileInfo);
  }, [fileInfo]);

  return (
    <div className="h-screen">
      <WorkspaceHeader editor={editor} fileName={fileInfo?.[0]?.fileName} />
      <div className="grid grid-cols-2 gap-5">
        <div>
          <TextEditor editor={editor} fileId={fileId} />
        </div>
        <div>
          <PdfViewer fileUrl={fileInfo?.[0]?.fileUrl} />
        </div>
      </div>
    </div>
  );
};

export default Workspace;
