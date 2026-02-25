'use client';
import Header from "@/components/Header";
import KanbanToDo from "@/components/KanbanToDo";

export default function Home() {
  return (
    <div className="w-full flex flex-col h-dvh items-center justify-center bg-zinc-50 font-sans">
      <Header />
      <KanbanToDo />
    </div>
  );
}
