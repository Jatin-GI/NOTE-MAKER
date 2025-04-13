"use client";

import React from "react";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Highlighter,
  Heading1,
  Heading2,
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  SparklesIcon,
} from "lucide-react";
import { useAction, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import { getChatSession } from "@/configs/AIModel";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";

const EditorExtension = ({ editor }) => {
  const { fileId } = useParams();
  const searchAction = useAction(api.myActions.search);
  const saveNotes = useMutation(api.notes.AddNotes);
  const { user } = useUser();
  const onAiClick = async () => {
    toast("AI is generating the result....");
    const { from, to } = editor.state.selection;
    const selectedText = editor.state.doc.textBetween(from, to, " ");
    console.log("Selected text:", selectedText);

    const result = await searchAction({
      query: selectedText,
      fileId: fileId,
    });

    const UnformattedAns = JSON.parse(result);
    let AllUnformattedAns = "";
    UnformattedAns &&
      UnformattedAns.forEach((item) => {
        AllUnformattedAns = AllUnformattedAns + item.pageContent;
      });

    const PROMPT =
      "For question: " +
      selectedText +
      " and with the given content as answer, " +
      "Only include the formatted, cleaned-up HTML answer. " +
      "please provide an appropriate response in HTML format. The answer content is: " +
      "The answer content is: " +
      AllUnformattedAns;

    const session = await getChatSession(); // ✅ waits for chat to initialize
    const aiResult = await session.sendMessage(PROMPT);

    console.log(aiResult.response.text());

    const FinalAns = aiResult.response
      .text()
      .replace("'''", "")
      .replace("'''", "")
      .replace("html", "")
      .trim();
    // .text()
    // .replaceAll(/```|html/g, "")
    // .replace(/(\*\*Key improvements[\s\S]*?)$/i, "") // <- removes from "Key improvements" to the end
    // .replace(/<\/?h[1-6][^>]*>/g, "")
    // .replace(selectedText, "")
    // .replace(/^\s*[\r\n]/gm, "")
    // .replace(/<lang=['"]?en['"]?>/gi, "")
    // .trim();

    const AllText = editor.getHTML();
    editor.commands.setContent(
      AllText + "<p><strong>Answer:</strong> " + FinalAns.trim() + "</p>"
    );
    saveNotes({
      notes: editor.getHTML(),
      fileId: fileId,
      createdBy: user?.primaryEmailAddress?.emailAddress,
    });
  };

  const baseButton =
    "hover:text-blue-500 cursor-pointer transition duration-200";

  return (
    editor && (
      <div className="p-4 mt-3 border-b  bg-white flex flex-wrap gap-3 items-center">
        {/* Headings */}
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={`${
            editor.isActive("heading", { level: 1 }) ? "text-blue-500" : ""
          } ${baseButton}`}
        >
          <Heading1 />
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={`${
            editor.isActive("heading", { level: 2 }) ? "text-blue-500" : ""
          } ${baseButton}`}
        >
          <Heading2 />
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={`${
            editor.isActive("heading", { level: 3 }) ? "text-blue-500" : ""
          } ${baseButton}`}
        >
          <Heading3 />
        </button>

        {/* Text Styles */}
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`${
            editor.isActive("bold") ? "text-blue-500" : ""
          } ${baseButton}`}
        >
          <Bold />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`${
            editor.isActive("italic") ? "text-blue-500" : ""
          } ${baseButton}`}
        >
          <Italic />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`${
            editor.isActive("underline") ? "text-blue-500" : ""
          } ${baseButton}`}
        >
          <UnderlineIcon />
        </button>

        {/* Lists */}
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`${
            editor.isActive("bulletList") ? "text-blue-500" : ""
          } ${baseButton}`}
        >
          <List />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`${
            editor.isActive("orderedList") ? "text-blue-500" : ""
          } ${baseButton}`}
        >
          <ListOrdered />
        </button>

        {/* Highlighter */}
        <button
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          className={`${
            editor.isActive("highlight") ? "text-yellow-500" : ""
          } ${baseButton}`}
        >
          <Highlighter />
        </button>

        {/* Text Alignment */}
        <button
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={`${
            editor.isActive({ textAlign: "left" }) ? "text-blue-500" : ""
          } ${baseButton}`}
        >
          <AlignLeft />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={`${
            editor.isActive({ textAlign: "center" }) ? "text-blue-500" : ""
          } ${baseButton}`}
        >
          <AlignCenter />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={`${
            editor.isActive({ textAlign: "right" }) ? "text-blue-500" : ""
          } ${baseButton}`}
        >
          <AlignRight />
        </button>

        <button onClick={() => onAiClick()} className={` ${baseButton}`}>
          <SparklesIcon />
        </button>
      </div>
    )
  );
};

export default EditorExtension;
