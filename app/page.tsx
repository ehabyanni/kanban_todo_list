'use client';
import KanbanToDo from "@/components/KanbanToDo";

export default function Home() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-zinc-50 font-sans">
      <KanbanToDo />
    </div>
  );
}
