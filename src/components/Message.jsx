import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";

function Message({ content, role, loader }) {
  const isOwnMessage = role === "user";

  let sender = role;
  if (role === "user") {
    sender = "Du";
  } else if (role === "assistant") {
    sender = "Techy (AI)";
  }

  const baseStyling =
    "flex flex-col max-w-4/5 w-fit pt-3 px-4 my-3 rounded break-words";
  const userStyling = "self-end bg-blue text-white rounded-2xl rounded-br-none";
  const assistantStyling =
    "self-start bg-white text-black border border-blue rounded-2xl rounded-bl-none";

  return (
    <article
      id="message"
      className={`${baseStyling} ${
        isOwnMessage ? userStyling : assistantStyling
      }`}
    >
      <span className="block font-bold capitalize opacity-80">{sender}</span>
      <ReactMarkdown remarkPlugins={[remarkBreaks]}>{content}</ReactMarkdown>
      {loader}
    </article>
  );
}

export default Message;
