export type ColumnType = 'backlog' | 'in_progress' | 'in_review' | 'done';

export interface Task {
  id: string;
  title: string;
  description: string;
  column: ColumnType;
}

export const COLUMNS = [
  { id: 'backlog', label: 'Backlog', color: '#6366f1' },       // Indigo
  { id: 'in_progress', label: 'In Progress', color: '#f59e0b' }, // Amber
  { id: 'in_review', label: 'In Review', color: '#3b82f6' },    // Blue
  { id: 'done', label: 'Done', color: '#10b981' },           // Emerald
];