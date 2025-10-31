import { readFile } from "fs/promises";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { createClient } from "@supabase/supabase-js";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { OllamaEmbeddings } from "@langchain/ollama";
import "dotenv/config";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_API_KEY = process.env.SUPABASE_API_KEY;

try {
  const document = await readFile(
    `${process.cwd()}/technova_policy.txt`,
    "utf-8"
  );

  const text_splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 100,
    separators: ["§MARKER§", "\n\n", "\n- ", "\n• ", "? ", ". ", "! ", " ", ""],
  });

  const markedDocument = document.replace(
    /(^|\n)(\d+\.\s[A-ZÅÄÖ])/g,
    "\n§MARKER§ $2"
  );

  const splittedText = await text_splitter.createDocuments([markedDocument]);

  const documentsWithMetadata = splittedText.map((chunk, index) => {
    const pageContent = chunk.pageContent.replace(/§MARKER§ /g, "");

    if (index === 3) {
      const nextChunk = splittedText[index + 1];
      const combinedContent =
        pageContent + "\n\n" + nextChunk.pageContent.replace(/§MARKER§ /g, "");
      return {
        pageContent: combinedContent,
        metadata: { id: 4 },
      };
    }

    if (index === 4) return null;

    return { pageContent, metadata: { id: index + 1 } };
  }).filter(Boolean);

  const supabaseClient = createClient(SUPABASE_URL, SUPABASE_API_KEY);

  await SupabaseVectorStore.fromDocuments(
    documentsWithMetadata,
    new OllamaEmbeddings({ model: "mxbai-embed-large" }),
    { client: supabaseClient, tableName: "documents" }
  );
} catch (error) {
  console.log(error);
}