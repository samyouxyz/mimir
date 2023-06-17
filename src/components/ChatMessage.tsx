import { Message } from "@/types/chat";

type Props = {
  message: Message;
};

export default function ChatMessage({ message }: Props) {
  return (
    <div className="">
      {message.role === "user" ? (
        <div className="w-full whitespace-pre-wrap p-2">
          You: {message.content}
        </div>
      ) : (
        <div className="w-full whitespace-pre-wrap bg-gray-100 p-2">
          AI: {message.content}
        </div>
      )}
    </div>
  );
}
