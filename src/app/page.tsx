"use client";

import Chat from "@/components/Chat";
import Menu from "@/components/Menu";
import UserInput from "@/components/UserInput";
import { Message } from "@/types/chat";
import React, { useCallback, useRef } from "react";
import { useEffect, useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      content: "Hello! I'm ChatGPT. Ask me to do something for you!",
      role: "system",
    },
  ]);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to the bottom of the chat container when the messages change
    chatContainerRef.current?.scrollTo({
      top: chatContainerRef.current?.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  /**
   * Send the messages to the api/chat and update UI with streaming response
   */
  const submitRequest = useCallback(async (updatedMessages: Message[]) => {
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedMessages),
      });

      if (!res.ok) throw new Error("Failed to send message");

      const data = res.body;
      if (!data) {
        return;
      }
      const reader = data.getReader();
      const textDecoder = new TextDecoder();
      let text = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        text += textDecoder.decode(value);

        // Update the messages with the response
        setMessages([...updatedMessages, { role: "assistant", content: text }]);
      }
    } catch (e) {
      if (e instanceof Error) {
        console.error(e.message);
      }
    }
  }, []);

  const onSend = (userInput: string) => {
    const updatedMessages = [
      ...messages,
      { role: "user", content: userInput } as Message,
    ];

    // Update UI the messages with the user input
    setMessages(updatedMessages);

    // Send the request to the api/chat
    submitRequest(updatedMessages);
  };

  return (
    <div className="flex flex-col max-w-3xl m-auto font-mono h-screen">
      <div className="flex py-3 font-bold justify-center">Mimir</div>
      <Menu />
      <div className="flex flex-col h-full text-sm border border-black">
        <Chat messages={messages} containerRef={chatContainerRef} />
        <UserInput onSend={onSend} />
      </div>
    </div>
  );
}
