"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Chat } from "@/components/ui/chat";
import { Search, Menu } from "lucide-react";
import TeamChatSidebar from "./TeamChatSidebar";

const dummyMessages = {
  1: [
    { id: "1", role: "user", content: "Hey John, how are you?" },
    { id: "2", role: "assistant", content: "Doing great, thanks!" },
  ],
  2: [
    { id: "3", role: "user", content: "Hi Sarah, are we meeting tomorrow?" },
    { id: "4", role: "assistant", content: "Yes, at 10 AM." },
  ],
  3: [
    { id: "5", role: "user", content: "Mike, did you finish the report?" },
    { id: "6", role: "assistant", content: "Almost done, sending soon." },
  ],
};

const TeamChat = () => {
  const [selectedChatId, setSelectedChatId] = useState("1");
  const [messages, setMessages] = useState(dummyMessages[selectedChatId]);
  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setMessages(dummyMessages[selectedChatId]);
    setInput("");
  }, [selectedChatId]);

  const handleInputChange = (e) => setInput(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setIsGenerating(true);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: "This is a dummy AI response.",
        },
      ]);
      setIsGenerating(false);
    }, 1000);
  };

  const stop = () => setIsGenerating(false);

  return (
    <div className="flex h-[93vh] overflow-hidden">
      {/* Sidebar */}
      <TeamChatSidebar
        selectedChatId={selectedChatId}
        onSelectChat={setSelectedChatId}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main chat area */}
      <main className="flex flex-1 flex-col">
        {/* Mobile header with hamburger */}
        <header className="flex items-center justify-between border-b pb-2 lg:hidden">
          <Button
            variant="ghost"
            onClick={() => setSidebarOpen(true)}
            className=""
            size="icon"
          >
            <Menu />
          </Button>
          <h1 className="text-lg font-semibold">
            {selectedChatId === "1"
              ? "John Doe"
              : selectedChatId === "2"
                ? "Sarah Smith"
                : "Mike Johnson"}
          </h1>
        </header>

        {/* Desktop header */}
        <header className="mb-6 hidden flex-col justify-between gap-6 border-b p-4 lg:flex lg:flex-row lg:items-center">
          <h1 className="text-2xl font-bold">
            {selectedChatId === "1"
              ? "John Doe"
              : selectedChatId === "2"
                ? "Sarah Smith"
                : "Mike Johnson"}
          </h1>
        </header>

        {/* Chat Component */}
        <div className="flex flex-1 flex-col overflow-hidden p-4">
          <Chat
            messages={messages}
            input={input}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            isGenerating={isGenerating}
            stop={stop}
          />
        </div>
      </main>
    </div>
  );
};

export default TeamChat;
