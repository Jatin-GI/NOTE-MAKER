const { NextResponse } = require("next/server");
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

// const pdfUrl =
//   "https://glad-cheetah-457.convex.cloud/api/storage/088ee320-0f6b-46ac-883c-b6c7cdbde1de";
export async function GET(req) {
  const reqUrl = req.url;
  const { searchParams } = new URL(reqUrl);
  const pdfUrl = searchParams.get("pdfUrl");
  console.log(pdfUrl);
  //1) load the pdf file
  const response = await fetch(pdfUrl);
  const data = await response.blob();
  const loader = new WebPDFLoader(data);
  const docs = await loader.load();

  let pdfTextContent = "";
  docs.forEach((docs) => {
    pdfTextContent = pdfTextContent + docs.pageContent;
  });

  //2) split the text into smaller chunks
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 100,
    chunkOverlap: 20,
  });

  const output = await splitter.createDocuments([pdfTextContent]);
  //3) make a single list
  let splitterList = [];
  output.forEach((docs) => {
    splitterList.push(docs.pageContent);
  });
  return NextResponse.json({ result: splitterList });
}
