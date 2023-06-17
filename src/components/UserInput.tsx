import { useState } from "react";
import TextareaAutosize from "react-textarea-autosize";

type Props = {
  onSend: (userInput: string) => void;
};

export default function UserInput({ onSend: onSendMessage }: Props) {
  const [userInput, setUserInput] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserInput(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSendMessage(userInput);
      setUserInput("");
    }
  };
  return (
    <div className="flex p-2 border-t border-black">
      <TextareaAutosize
        autoFocus
        className="w-full resize-none p-2 focus:ring-black focus:outline-none"
        placeholder="Type your message..."
        value={userInput}
        rows={1}
        maxRows={8}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}
