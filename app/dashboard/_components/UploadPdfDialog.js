"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAction, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Loader2Icon, PlusIcon } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import uuid4 from "uuid4";
import axios from "axios";
import { toast } from "sonner";

const UploadPdfDialog = ({ children }) => {
  const [file, setFile] = useState();
  const [loader, setLoader] = useState(false);
  const [fileNmae, setFilename] = useState();
  const [open, setOpen] = useState(false);

  const { user } = useUser();
  const generateUploadUrl = useMutation(api.FileStorage.generateUploadUrl);
  const AddFileEntryToDb = useMutation(api.FileStorage.AddFileEntryToDb);
  const getFileUrl = useMutation(api.FileStorage.getFileUrl);
  const embeddDocument = useAction(api.myActions.ingest);
  const onFileSelect = (event) => {
    setFile(event.target.files[0]);
  };

  const OnUpload = async () => {
    if (!fileNmae || !user?.primaryEmailAddress?.emailAddress || !file) {
      toast.error(
        "Please provide a file name, select a PDF, and ensure you are logged in."
      );
      return;
    }

    setLoader(true);

    try {
      const postUrl = await generateUploadUrl();
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file?.type },
        body: file,
      });

      const { storageId } = await result.json();
      const fileId = uuid4();
      const fileUrl = await getFileUrl({ storageId });

      await AddFileEntryToDb({
        fileId,
        fileName: fileNmae,
        storageId,
        createdBy: user.primaryEmailAddress.emailAddress,
        fileUrl,
      });

      const ApiResp = await axios.get("/api/pdf-loader?pdfUrl=" + fileUrl);

      await embeddDocument({
        splitText: ApiResp.data.result,
        fileId,
      });

      toast.success("PDF uploaded and embedded successfully!");
    } catch (error) {
      console.error("Upload failed", error);
      toast.error("Something went wrong during upload.");
    }

    setLoader(false);
    setFile(null);
    setFilename("");
    setOpen(false);
  };
  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            className="w-full hover:bg-[#ff0a0a] hover:scale-105 transition-all cursor-pointer"
            onClick={() => setOpen(true)}
          >
            <PlusIcon />
            Upload PDF file
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex justify-center hover:scale-105 transition-all">
              Upload PDF File
            </DialogTitle>
            <DialogDescription asChild>
              <div>
                <div className="mt-5 ">
                  <label>File Name</label>
                  <Input
                    required
                    onChange={(event) => setFilename(event.target.value)}
                    className="mt-2"
                    placeholder="File Nmae"
                  />
                </div>
                <h2 className="mt-2">Select a File To Upload</h2>
                <div className=" p-3 mt-2 rounded-md shadow-2xs hover:shadow-sm border">
                  <input
                    required
                    onChange={(e) => onFileSelect(e)}
                    type="file"
                    accept="application/pdf"
                  />
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose>
              <Button
                className="hover:bg-slate-200 cursor-pointer hover:scale-105"
                type="submit"
                variant="secondary"
                onClick={() => setOpen(false)}
              >
                Close
              </Button>
            </DialogClose>
            <Button
              onClick={OnUpload}
              disabled={loader}
              className="hover:scale-105 hover:bg-[#ff0a0a] transition-all cursor-pointer"
            >
              {loader ? <Loader2Icon className="animate-spin" /> : "Upload"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UploadPdfDialog;
