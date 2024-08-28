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
    })
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
    modelName: "gpt-4o",
    temperature: 0,
  });

  const retriever = vectorstore.asRetriever();
  const systemTemplate = [
    `Du bist ein Assisstent und hilfst mit der Extrahierung von Information aus einem PDF-Dokument.`,
    `Verwende den folgenden Kontext, um die noetige Information zu extrahieren.`,
    `Wenn Du die Antwort nicht weisst, dann gibst du ein N/A zurueck.`,
    `\n\n`,
    `Kontext: {context}`,
    `Formatierung der Antwort: {formatting_instructions}`,
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
      requestorName: z.string().describe("1"),
      title: z.array(z.string()).describe("2"),
      vendorName: z.string().describe("3"),
      vatID: z.string().describe("4"),
      department: z.string().describe("5"),
      totalCost: z.string().describe("6"),
      commodityGroup: z.string().describe("8"),
      orderLines: z
        .array(
          z.object({
            positionDescription: z
              .string()
              .describe("Beschreibung des Artikels/der Dienstleistung."),
            amount: z
              .string()
              .describe("Die Anzahl oder Menge der bestellten Einheiten."),
            unitPrice: z
              .string()
              .describe("Der Preis der pro Einheit/Dienstleistung/Artikel"),
            unit: z
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
    input: `Bitte extrahiere die folgenden Informationen aus dem Dokument:
  1. Vollstaendiger Name der Person, die die Anfrage stellt (Diese Person arbeitet fuer Lio Technologies GmbH. Wenn der Name nicht existiert, dann bitte antworte mit Lio Technologies GmbH als) vollstaendiger Name der Person, die die Anfrage stellt.
  2. Kurze Beschreibung des angeforderten Produkts/Dienstes.
  3. Name des Unternehmens oder der Person, die das Produkt/Dienstleistung bereitstellt (Die zweite Firma erwaehnt im Dokument).
  4. Umsatzsteuer-Identifikationsnummer des Anbieters (kann auch als UID, VAT ID, oder USt-IdNr bezeichnet werden).
  5. Abteilung des Anforderers.
  6. Gesamte geschaetzte Kosten der Anfrage (kann auch als Endsumme, Gesamtkosten, etc. bezeichnet werden).
  7. Liste der Produkte/Positionen/Leistungen aus dem Angebot, und jedes Produkt hat die folgenden Informationen:
     - Beschreibung oder Bezeichnung der bestellten Einheiten.
     - Anzahl oder Menge der bestellten Einheitenen
     - Gesamtpreis der Einheiten (kann auch als Gesamt oder Einzelpreis x Menge oder aehnliches bezeichnet werden).
     - Die Masseinheit oder Menge der bestellten Einheiten.
  
  8. Basierend auf der Liste der Produkte/Positionen/Leistungen, die du extrahierst, bitte bestimme die Kategorie und die Commodity Group aus der folgenden Tabelle:
  
  | ID  | Category                | Commodity Group                       |
  | --- | ----------------------- | ------------------------------------- |
  | 001 | General Services        | Accommodation Rentals                 |
  | 002 | General Services        | Membership Fees                       |
  | 003 | General Services        | Workplace Safety                      |
  | 004 | General Services        | Consulting                            |
  | 005 | General Services        | Financial Services                    |
  | 006 | General Services        | Fleet Management                      |
  | 007 | General Services        | Recruitment Services                  |
  | 008 | General Services        | Professional Development              |
  | 009 | General Services        | Miscellaneous Services                |
  | 010 | General Services        | Insurance                             |
  | 011 | Facility Management     | Electrical Engineering                |
  | 012 | Facility Management     | Facility Management Services          |
  | 013 | Facility Management     | Security                              |
  | 014 | Facility Management     | Renovations                           |
  | 015 | Facility Management     | Office Equipment                      |
  | 016 | Facility Management     | Energy Management                     |
  | 017 | Facility Management     | Maintenance                           |
  | 018 | Facility Management     | Cafeteria and Kitchenettes            |
  | 019 | Facility Management     | Cleaning                              |
  | 020 | Publishing Production   | Audio and Visual Production           |
  | 021 | Publishing Production   | Books/Videos/CDs                      |
  | 022 | Publishing Production   | Printing Costs                        |
  | 023 | Publishing Production   | Software Development for Publishing   |
  | 024 | Publishing Production   | Material Costs                        |
  | 025 | Publishing Production   | Shipping for Production               |
  | 026 | Publishing Production   | Digital Product Development           |
  | 027 | Publishing Production   | Pre-production                        |
  | 028 | Publishing Production   | Post-production Costs                 |
  | 029 | Information Technology  | Hardware                              |
  | 030 | Information Technology  | IT Services                           |
  | 031 | Information Technology  | Software                              |
  | 032 | Logistics               | Courier, Express, and Postal Services |
  | 033 | Logistics               | Warehousing and Material Handling     |
  | 034 | Logistics               | Transportation Logistics              |
  | 035 | Logistics               | Delivery Services                     |
  | 036 | Marketing & Advertising | Advertising                           |
  | 037 | Marketing & Advertising | Outdoor Advertising                   |
  | 038 | Marketing & Advertising | Marketing Agencies                    |
  | 039 | Marketing & Advertising | Direct Mail                           |
  | 040 | Marketing & Advertising | Customer Communication                |
  | 041 | Marketing & Advertising | Online Marketing                      |
  | 042 | Marketing & Advertising | Events                                |
  | 043 | Marketing & Advertising | Promotional Materials                 |
  | 044 | Production              | Warehouse and Operational Equipment   |
  | 045 | Production              | Production Machinery                  |
  | 046 | Production              | Spare Parts                           |
  | 047 | Production              | Internal Transportation               |
  | 048 | Production              | Production Materials                  |
  | 049 | Production              | Consumables                           |
  | 050 | Production              | Maintenance and Repairs               |
  `,
  });

  const parsedResult = outputParser.parse(result.answer);

  return parsedResult;
}
