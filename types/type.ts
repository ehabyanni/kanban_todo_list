export type ColumnType = "backlog" | "in_progress" | "in_review" | "done";

export interface Task {
  id: string;
  title: string;
  description: string;
  column: string;
}

export interface TaskPage {
  tasks: Task[];
  nextPage: number | undefined;
}

export const COLUMNS = [
  { id: "backlog", label: "Backlog", color: "#6366f1" },
  { id: "in_progress", label: "In Progress", color: "#f59e0b" },
  { id: "in_review", label: "In Review", color: "#3b82f6" },
  { id: "done", label: "Done", color: "#10b981" },
];

export interface TaskColumnProps {
  col: { id: string; label: string; color: string };
  searchTerm: string;
  onAddTask: (id: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
}
