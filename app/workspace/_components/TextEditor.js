"use client";
import React, { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";

import EditorExtension from "./EditorExtension";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
const TextEditor = ({ fileId, editor }) => {
  const notes = useQuery(api.notes.GetAllNotes, {
    fileId: fileId,
  });

  console.log(notes);

  useEffect(() => {
    editor && editor.commands.setContent(notes);
  }, [notes && editor]);

  return (
    <div>
      <EditorExtension editor={editor} />
      <div className="h-[88vh] overflow-auto [&::-webkit-scrollbar]:hidden">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default TextEditor;
