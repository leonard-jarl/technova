import { OllamaEmbeddings } from "@langchain/ollama";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_API_KEY = import.meta.env.VITE_SUPABASE_API_KEY;

const embeddings = new OllamaEmbeddings({ model: "mxbai-embed-large" });
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_API_KEY);

const vectorstore = new SupabaseVectorStore(embeddings, {
  client: supabaseClient,
  tableName: "documents",
  queryName: "match_documents",
});

export function retrieveDocuments(chapterId) {
  if (chapterId == null) {
    return vectorstore.asRetriever();
  } else {
    return vectorstore.asRetriever({ filter: { id: chapterId } });
  }
}
