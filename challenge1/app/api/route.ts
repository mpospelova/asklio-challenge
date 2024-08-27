import { openai } from "@ai-sdk/openai";
import { Document } from "@langchain/core/documents";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "langchain/output_parsers";
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { HttpResponseOutputParser } from "langchain/output_parsers";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { MessagesPlaceholder } from "@langchain/core/prompts";
import { createHistoryAwareRetriever } from "langchain/chains/history_aware_retriever";

import path from "path";
import fs from "fs";

// export const maxDuration = 30;
const pdfPath = path.resolve(process.cwd(), "data", "test2.pdf");

const replacements = {
  ö: "o",
  ä: "a",
  ü: "u",
  ß: "ss",
  Ö: "O",
  Ä: "A",
  Ü: "U",
};

export async function POST(req: Request) {
  const request = await req.json();
  const vectorstore = await createVectorStore();
  const extractedInformation = await callStructuredOutputParser(vectorstore);
  console.log(extractedInformation);

  return new Response(
    JSON.stringify({
      test: "Hello, world!",
    })
  );
}

async function createVectorStore() {
  if (!fs.existsSync(pdfPath)) {
    throw new Error(`File not found: ${pdfPath}`);
  }

  const loader = new PDFLoader(pdfPath);
  const docs = await loader.load();

  const newDocs = [];
  for (let i = 0; i < docs.length; i++) {
    const doc = docs[i];

    let replaceChar = doc.pageContent.replaceAll("ä", "ae");
    replaceChar = replaceChar.replaceAll("ö", "oe");
    replaceChar = replaceChar.replaceAll("ü", "ue");
    replaceChar = replaceChar.replaceAll("ß", "ss");
    replaceChar = replaceChar.replaceAll("Ä", "Ae");
    replaceChar = replaceChar.replaceAll("Ü", "Ue");
    replaceChar = replaceChar.replaceAll("Ö", "Oe");

    const newDoc = new Document({
      pageContent: replaceChar,
      id: doc.id,
      metadata: doc.metadata,
    });

    newDocs.push(newDoc);
  }

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 200,
    chunkOverlap: 20,
  });

  const splittedDocs = await splitter.splitDocuments(newDocs);
  const embeddings = new OpenAIEmbeddings();
  const vectorstore = await MemoryVectorStore.fromDocuments(
    splittedDocs,
    embeddings
  );

  return vectorstore;
}

async function callStructuredOutputParser(vectorstore: any) {
  const model = new ChatOpenAI({
    modelName: "gpt-3.5-turbo",
    temperature: 0,
  });

  const retriever = vectorstore.asRetriever();
  const systemTemplate = [
    `Du bist ein Assisstent und hilfst mit der Extrahierung von Information aus einem PDF-Dokumenten.`,
    `Verwende die folgenden Teile des Kontexts, um die noetige Information zu extrahieren.`,
    `Wenn Du die Antwort nicht weisst, dann gibst du ein N/A zurueck.`,
    `Die Antworten musst du in json zurueckgeben, so wie es in der Formattierungsanleitung vorgegeben ist: {input}`,
    `\n\n`,
    `{context}`,
  ].join("");

  const prompt = ChatPromptTemplate.fromMessages([
    ["system", systemTemplate],
    ["human", "{input}"],
  ]);

  const documentChain = await createStuffDocumentsChain({
    llm: model,
    prompt,
  });

  const ragChain = await createRetrievalChain({
    retriever,
    combineDocsChain: documentChain,
  });

  const outputParser = StructuredOutputParser.fromNamesAndDescriptions({
    requestorName: "Vollstaendiger Name der Person, die die Anfrage stellt.",
    title: "Kurzer Name oder Beschreibung des angeforderten Produkts/Dienstes.",
    vendorName:
      "Name des Unternehmens oder der Person, die den Produkt/Dienstleistungen bereitstellt.",
    vatID: "Umsatzsteuer-Identifikationsnummer des Anbieters.",
    commodityGroup:
      "Die Kategorie oder Gruppe, zu der die angeforderten Artikel/Dienstleistungen gehoeren.",
    department: "Die Abteilung des Anforderers.",
  });

  const test = await ragChain.invoke({
    formatting_instructions: outputParser.getFormatInstructions(),
    input:
      "Was ist der vollstaendige Name der Person, die die Anfrage stellt? Was ist die kurze Beschreibung des angeforderten Produkts/Dienstes? Was ist der Name des Unternehmens oder der Person, die den Produkt/Dienstleistungen bereitstellt? Was ist die Umsatzsteuer-Identifikationsnummer des Anbieters? Was ist die Kategorie oder Gruppe, zu der die angeforderten Artikel/Dienstleistungen gehoeren? Was ist Die Abteilung des Anforderers?",
  });

  return test;
}
