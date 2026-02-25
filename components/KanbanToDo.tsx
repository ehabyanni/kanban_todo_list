"use client";
import { useState } from "react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { COLUMNS, Task } from "@/types/type";
import {
  updateTaskStatus,
  createTask,
  updateTask,
  deleteTask,
} from "@/app/api/task";
import TaskColumn from "./TaskColumn";
import TaskModal from "./TaskModal";
import DeleteConfirmModal from "./DeleteConfirmationModal";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

export default function KanbanToDo() {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [activeColumn, setActiveColumn] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  const statusMutation = useMutation({
    mutationFn: ({ id, column }: { id: string; column: string }) =>
      updateTaskStatus(id, column),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination || destination.droppableId === source.droppableId) return;

    statusMutation.mutate({ id: draggableId, column: destination.droppableId });
  };

  const createMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setModalOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setModalOpen(false);
      setEditingTask(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setDeleteDialogOpen(false);
    },
  });

  return (
    <div className="w-full h-full">
      <Box sx={{ p: 4 }}>
        <DragDropContext onDragEnd={onDragEnd}>
          <Grid container spacing={3}>
            {COLUMNS.map((col) => (
              <Grid key={col.id} size={{ xs: 12, sm: 6, md: 3 }}>
                <TaskColumn
                  col={col}
                  onAddTask={(id) => {
                    setActiveColumn(id);
                    setModalOpen(true);
                  }}
                  onEditTask={(task) => {
                    setEditingTask(task);
                    setModalOpen(true);
                  }}
                  onDeleteTask={(task) => {
                    setTaskToDelete(task);
                    setDeleteDialogOpen(true);
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </DragDropContext>

        <TaskModal
          open={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setEditingTask(null);
          }}
          onSave={(data) =>
            editingTask
              ? updateMutation.mutate({ ...editingTask, ...data })
              : createMutation.mutate({
                  ...data,
                  column: activeColumn || "backlog",
                })
          }
          initialData={editingTask}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />

        <DeleteConfirmModal
          open={isDeleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={() =>
            taskToDelete && deleteMutation.mutate(taskToDelete.id)
          }
          isLoading={deleteMutation.isPending}
          taskTitle={taskToDelete?.title}
        />
      </Box>
    </div>
  );
}
