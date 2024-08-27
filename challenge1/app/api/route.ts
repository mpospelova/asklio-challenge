import { Document } from "@langchain/core/documents";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "langchain/output_parsers";
import { ChatOpenAI } from "@langchain/openai";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { createRetrievalChain } from "langchain/chains/retrieval";
import z from "zod";

export async function POST(req: Request) {
  const file = await req.blob();
  const vectorstore = await createVectorStore(file);
  const extractedInformation = await callStructuredOutputParser(vectorstore);

  return new Response(
    JSON.stringify({
      extractedInformation,
    }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}

async function createVectorStore(file: Blob) {
  const loader = new PDFLoader(file);
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
    `Wenn Du die Antwort nicht weisst, dann gibst du ein N/A oder ein leeres Array zurueck.`,
    `Formatiere die Antwort laut dieser Anleitung: {formatting_instructions}`,
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

  const outputParser = StructuredOutputParser.fromZodSchema(
    z.object({
      requestorName: z
        .string()
        .describe("Vollstaendiger Name der Person, die die Anfrage stellt."),
      title: z
        .array(z.string())
        .describe(
          "Kurzer Name oder Beschreibung des angeforderten Produkts/Dienstes."
        ),
      vendorName: z
        .string()
        .describe(
          "Name des Unternehmens oder der Person, die den Produkt/Dienstleistungen bereitstellt."
        ),
      vatID: z
        .string()
        .describe(
          "Umsatzsteuer-Identifikationsnummer des Anbieters. Auch als UID bezeichnet."
        ),
      commodityGroup: z
        .string()
        .describe(
          "Die Kategorie oder Gruppe, zu der die angeforderten Artikel/Dienstleistungen gehoeren."
        ),
      department: z.string().describe("Die Abteilung des Anforderers."),
      totalCost: z.string().describe("Geschaetzte Gesamtkosten der Anfrage."),
      orderLines: z
        .array(
          z.object({
            positionDescription: z
              .string()
              .describe("Beschreibung des Artikels/der Dienstleistung."),
            unitPrice: z
              .string()
              .describe("Die Anzahl oder Menge der bestellten Einheiten."),
            amount: z
              .string()
              .describe("Die Masseinheit oder Menge (z.B. Lizenzen)."),
            totalPrice: z
              .string()
              .describe(
                "Gesamtpreis fuer diese Position (Einzelpreis x Menge)."
              ),
          })
        )
        .describe("Liste der Produkte aus dem Angebot, detailliert wie folgt"),
    })
  );

  const result = await ragChain.invoke({
    formatting_instructions: outputParser.getFormatInstructions(),
    input: `Was ist der vollstaendige Name der Person, die die Anfrage stellt?
      Was ist die kurze Beschreibung des angeforderten Produkts/Dienstes?
      Was ist der Name des Unternehmens oder der Person, die den Produkt/Dienstleistungen bereitstellt?
      Was ist die Umsatzsteuer-Identifikationsnummer des Anbieters?
      Was ist die Kategorie oder Gruppe, zu der die angeforderten Artikel/Dienstleistungen gehoeren?
      Was ist Die Abteilung des Anforderers? Was ist der Gesamtpreis fuer diese Position (Einzelpreis x Menge)?
      Was sind die Geschaetzte Gesamtkosten der Anfrage?
      Was ist die Liste der Produkte/Positionen aus dem Angebot? Bitte gebe eine Liste der Produkte zurueck, wo jedes Objekt in der Liste die folgende Information enthaelt (wenn du keine Produkte findest, gebe bitte eine leere Liste zurueck):
      Was ist die Beschreibung des Artikels/der Dienstleistung?
      Was ist die Die Anzahl oder Menge der bestellten Einheiten?
      Was ist der Gesamtpreis fuer diese Position (Einzelpreis x Menge)? 
      `,
  });

  const parsedResult = outputParser.parse(result.answer);

  return parsedResult;
}
