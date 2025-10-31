import {
  RunnableSequence,
  RunnablePassthrough,
} from "@langchain/core/runnables";
import { ChatOllama } from "@langchain/ollama";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { rephrasedQuestionTemplate, answerTemplate } from "./promptTemplates";
import { retrieveDocuments } from "./setupRetriever";
import { memory } from "./memory";
import getChapter from "./getChapter";

const llm = new ChatOllama({
  model: "qwen3:30b-a3b",
});

function mergeDocuments(docs) {
  return docs.map((doc) => doc.pageContent).join("\n\n");
}

const rephrasedQuestionChain = RunnableSequence.from([
  rephrasedQuestionTemplate,
  llm,
  new StringOutputParser(),
]);

const retrieveDocumentsChain = RunnableSequence.from([
  (data) => {
    const chapterId = getChapter(data.rephrasedQuestion);
    return { rephrasedQuestion: data.rephrasedQuestion, chapterId };
  },
  async (data) => {
    const retriever = retrieveDocuments(data.chapterId);
    const docs = await retriever.invoke(data.rephrasedQuestion);
    return mergeDocuments(docs);
  },
]);

const answerChain = RunnableSequence.from([
  async ({ question, context }) => ({
    question,
    context,
    chat_history:
      (await memory.loadMemoryVariables({ question })).chat_history ?? "",
  }),
  answerTemplate,
  llm,
  new StringOutputParser(),
]);

export const chain = RunnableSequence.from([
  {
    rephrasedQuestion: rephrasedQuestionChain,
    originalQuestion: new RunnablePassthrough(),
  },
  {
    context: retrieveDocumentsChain,
    question: ({ originalQuestion }) => originalQuestion.question,
  },
  answerChain,
]);
