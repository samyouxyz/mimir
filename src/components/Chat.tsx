import { Message } from "@/types/chat";
import ChatMessage from "./ChatMessage";

type Props = {
  messages: Message[];
  containerRef: React.RefObject<HTMLDivElement>;
};

export default function Chat({ messages, containerRef }: Props) {
  return (
    <div ref={containerRef} className="flex flex-col h-full overflow-x-hidden">
      {messages.map((msg, i) => (
        <ChatMessage key={i} message={msg} />
      ))}
    </div>
  );
}
