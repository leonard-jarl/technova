import { useEffect, useRef, useState } from "react";
import Message from "./Message";
import { chain } from "../langchain/chains";
import { memory } from "../langchain/memory";

function Chatbot() {
  const messageEndRef = useRef(null);

  const [chatOpen, setChatOpen] = useState(false);
  const [opening, setOpening] = useState(false);
  const [closing, setClosing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (!chatOpen) return;
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, chatOpen ]);

  async function getAnswer(q) {
    const question = q ?? inputValue;
    setInputValue("");
    setIsLoading(true);

    setMessages((prev) => [...prev, { role: "user", content: question }]);

    try {
      const answer = await chain.invoke({ question });
      await memory.saveContext({ question }, { answer });
      console.log(memory);

      setMessages((prev) => [...prev, { role: "assistant", content: answer }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Vår chattfunktion har tyvärr tekniska problem just nu. Du är välkommen att kontakta oss på mejl eller telefon om du har några frågor. Telefonnummer: 08–555 321 90 & Mejladress: support@technova.se",
        },
      ]);
    }
    setIsLoading(false);
  }

  const messageComponents = messages.map((message, index) => {
    return (
      <Message content={message.content} role={message.role} key={index} />
    );
  });

  return (
    <article className="fixed inset-0 z-20 pointer-events-none">
      <section
        className={
          "fixed bottom-0 right-4 rounded-t-2xl shadow-xl border border-blue overflow-hidden flex flex-col bg-white pointer-events-auto " +
          (opening
            ? " w-40 h-12 md:w-40 md:h-12 animate-chat-open"
            : closing
            ? " w-100 h-120 md:w-120 md:h-140 animate-chat-close"
            : chatOpen
            ? " w-100 h-120 md:w-120 md:h-140"
            : " w-48 h-12 md:w-48 md:h-12 cursor-pointer")
        }
        onClick={() => {
          if (!chatOpen && !opening) setOpening(true);
        }}
        onAnimationEnd={() => {
          if (opening) {
            setOpening(false);
            setChatOpen(true);
          } else if (closing) {
            setClosing(false);
            setChatOpen(false);
          }
        }}
      >
        <header className="bg-blue text-white h-12 px-4 py-4 flex items-center justify-between select-none">
          <h2 className="text-lg font-semibold">Hjälpchatt</h2>
          {chatOpen || closing ? (
            <button
              type="button"
              className="rounded-full px-2 py-1 text-white hover:bg-white/10 transition cursor-pointer"
              aria-label="Stäng chatbot"
              onClick={(e) => {
                e.stopPropagation();
                if (!closing) setClosing(true);
              }}
            >
              ✕
            </button>
          ) : !opening && !chatOpen ? (
            <button
              type="button"
              className="rounded-full px-2 py-1 text-white hover:bg-white/10 transition cursor-pointer"
              aria-label="Öppna chatbot"
              onClick={(e) => {
                e.stopPropagation();
                if (!opening) setOpening(true);
              }}
            >
              ↑
            </button>
          ) : null}
        </header>

        <section className="flex flex-col overflow-y-auto no-scrollbar p-8 pb-25">
          <Message
            role="assistant"
            content="Hej! Mitt namn är Techy 😁, jag är en AI-robot som kan svara på frågor om TechNova! Hur kan jag hjälpa dig idag?"
          />
          <div className="font-bold max-w-4/5 my-4">
            Vanliga frågor:
            <div className="grid grid-cols-1 gap-4 mt-2">
              {[
                "Hur lång leveranstid har ni?",
                "Vad har ni för ångerrätt?",
                "Vad täcker garantin?",
                "Vilka öppettider har ni?",
              ].map((q) => (
                <button
                  key={q}
                  type="button"
                  className="p-2 rounded-full text-sm border border-blue text-blue hover:bg-blue hover:text-white transition cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    getAnswer(q);
                  }}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
          {messageComponents}
          {isLoading && (
            <Message
              loader={
                <div className="loading text-blue mt-2">
                  <span className="loading-dot" />
                  <span className="loading-dot" />
                  <span className="loading-dot" />
                </div>
              }
              role="assistant"
            />
          )}
          <div ref={messageEndRef} />
        </section>
        <form
          className={`mx-4 my-4 px-3 py-2 rounded-full bg-white border border-blue/20 shadow-md absolute bottom-4 left-4 right-4 flex items-center gap-2 ${!chatOpen || closing || opening ? "hidden" : ""}`}
          onSubmit={(e) => {
            e.preventDefault();
            getAnswer();
          }}
        >
          <input
            name="chat"
            id="chat"
            type="text"
            placeholder="Ställ en fråga..."
            aria-label="Meddelande"
            className="flex-1 bg-transparent px-3 py-2 h-12 rounded-full text-black placeholder-black/60 focus:outline-none"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button
            type="submit"
            className="p-3 rounded-full bg-blue text-white border-0 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed hover:bg-blue/90 focus:outline-none focus:ring-2 focus:ring-blue/40 transition"
            disabled={isLoading || inputValue.trim().length === 0}
            aria-label="Skicka meddelande"
            title="Skicka"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="white"
              className="w-4 h-4"
              aria-hidden="true"
            >
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </form>
      </section>
    </article>
  );
}

export default Chatbot;
