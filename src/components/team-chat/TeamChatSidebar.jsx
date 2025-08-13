"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Menu } from "lucide-react";

const dummyChats = [
  { id: "1", name: "John Doe", lastMessage: "Hey, are you coming today?" },
  { id: "2", name: "Sarah Smith", lastMessage: "Let's catch up tomorrow." },
  { id: "3", name: "Mike Johnson", lastMessage: "Did you review the report?" },
];

export default function TeamChatSidebar({
  selectedChatId,
  onSelectChat,
  isOpen,
  onClose,
}) {
  const [search, setSearch] = useState("");

  const filteredChats = dummyChats.filter((chat) =>
    chat.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      {/* Overlay for mobile when sidebar is open */}
      <div
        className={`bg-opacity-50 fixed inset-0 z-40 transition-opacity lg:hidden ${
          isOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />

      <aside
        className={`bg-sidebar fixed top-0 left-0 z-50 flex h-full w-64 transform flex-col rounded-tr-xl border-t border-r py-0 ps-4 pr-4 transition-transform lg:bg-transparent lg:ps-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:static lg:flex-shrink-0 lg:translate-x-0`}
      >
        <form
          onSubmit={(e) => e.preventDefault()}
          className="mb-4 flex items-center gap-2"
        >
          <Input
            placeholder="Search by name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button
            type="submit"
            variant="outline"
            className="mt-3.5 min-w-[40px]"
          >
            <Search size={16} />
          </Button>
        </form>

        <ul className="flex-1 space-y-2 overflow-y-auto">
          {filteredChats.map((chat) => (
            <li
              key={chat.id}
              onClick={() => {
                onSelectChat(chat.id);
                onClose(); // close sidebar on mobile after select
              }}
              className={`cursor-pointer rounded-md px-3.5 py-3 ${
                selectedChatId === chat.id
                  ? "bg-muted text-white"
                  : "hover:bg-muted"
              }`}
            >
              <div className="mb-1 font-semibold">{chat.name}</div>
              <div className="text-muted-foreground truncate text-sm">
                {chat.lastMessage}
              </div>
            </li>
          ))}
        </ul>
      </aside>
    </>
  );
}
