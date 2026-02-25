"use client";
import Header from "@/components/Header";
import KanbanToDo from "@/components/KanbanToDo";
import { useState } from "react";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  return (
    <div className="w-full min-h-screen flex flex-col bg-zinc-50 font-sans">
      <Header onSearch={(val) => setSearchTerm(val)} searchTerm={searchTerm} />
      <main className="grow w-full max-w-350 mx-auto p-4 md:p-6">
        <KanbanToDo searchTerm={searchTerm} />
      </main>
    </div>
  );
}
