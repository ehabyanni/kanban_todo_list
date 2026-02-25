"use client";
import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
  updateTaskStatus,
} from "@/app/api/task";
import { COLUMNS, Task } from "@/types/type";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import TaskModal from "./TaskModal";
import DeleteConfirmModal from "./DeleteConfirmationModal";

export default function KanbanToDo() {
  const queryClient = useQueryClient();
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
  });

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [activeColumn, setActiveColumn] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  // update task status
  const mutation = useMutation({
    mutationFn: ({ id, column }: { id: string; column: string }) =>
      updateTaskStatus(id, column),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    const { draggableId, destination } = result;
    mutation.mutate({ id: draggableId, column: destination.droppableId });
  };

  // create new task
  const createMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setModalOpen(false);
    },
  });

  // update an existing task
  const updateMutation = useMutation({
    mutationFn: updateTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setModalOpen(false);
      setEditingTask(null);
    },
  });

  // delete task
  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  // handle save new task
  const handleSave = (task: { title: string; description: string }) => {
    createMutation.mutate({
      title: task.title,
      description: task.description,
      column: activeColumn || "todo",
    });
  };

  // handle save updated task
  const handleUpdate = (task: { title: string; description: string }) => {
    if (editingTask) {
      updateMutation.mutate({
        ...editingTask,
        title: task.title,
        description: task.description,
      });
    }
  };

  // handle delete task
  const handleDeleteClick = (task: Task) => {
    setTaskToDelete(task);
    setDeleteDialogOpen(true);
  };

  // handle confirm delete
  const handleConfirmDelete = () => {
    if (taskToDelete) {
      deleteMutation.mutate(taskToDelete.id, {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setTaskToDelete(null);
        },
      });
    }
  };

  if (isLoading)
    return (
      <div className="w-full h-full text-lg font-semibold text-black flex items-center justify-center gap-2">
        <RefreshIcon fontSize="small" className="animate-spin" />
        <p>Loading...</p>
      </div>
    );

  return (
    <div className="w-full h-full">
      <DragDropContext onDragEnd={onDragEnd}>
        <Grid container spacing={2} sx={{ p: 4, minHeight: "80vh" }}>
          {COLUMNS.map((col) => (
            <Grid key={col.id} size={{ xs: 12, sm: 6, md: 3 }}>
              <Paper
                sx={{
                  p: 2,
                  bgcolor: "#e5e7eb",
                  minHeight: "500px",
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: "none",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Box
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        backgroundColor: col.color,
                      }}
                    />
                    <h1 className="text-lg font-semibold">{col.label}</h1>
                  </Box>
                  <IconButton
                    size="small"
                    onClick={() => {
                      setActiveColumn(col.id);
                      setModalOpen(true);
                    }}
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                </Box>

                <Droppable droppableId={col.id}>
                  {(provided) => (
                    <Box
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      sx={{ flexGrow: 1 }}
                    >
                      {tasks
                        .filter((t) => t.column === col.id)
                        .map((task, index) => (
                          <Draggable
                            key={task.id}
                            draggableId={task.id.toString()}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <Paper
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                sx={{
                                  p: 2,
                                  mb: 2,
                                  position: "relative",
                                  "&:hover .actions": { opacity: 1 },
                                  boxShadow: snapshot.isDragging
                                    ? "0 5px 15px rgba(0,0,0,0.3)"
                                    : "none",
                                }}
                              >
                                <h2 className="text-md font-semibold">
                                  {task.title}
                                </h2>
                                <p className="text-sm font-normal">
                                  {task.description}
                                </p>

                                {/* Action Buttons */}
                                <Box
                                  className="actions"
                                  sx={{
                                    opacity: 0,
                                    position: "absolute",
                                    top: 5,
                                    right: 5,
                                    transition: "0.2s",
                                  }}
                                >
                                  <IconButton
                                    size="small"
                                    onClick={() => {
                                      setEditingTask(task);
                                      setModalOpen(true);
                                    }}
                                  >
                                    <EditIcon fontSize="inherit" />
                                  </IconButton>
                                  <IconButton
                                    size="small"
                                    color="error"
                                    onClick={() => handleDeleteClick(task)}
                                  >
                                    <DeleteIcon fontSize="inherit" />
                                  </IconButton>
                                </Box>
                              </Paper>
                            )}
                          </Draggable>
                        ))}
                      {provided.placeholder}
                    </Box>
                  )}
                </Droppable>
              </Paper>
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
        onSave={editingTask ? handleUpdate : handleSave}
        initialData={editingTask}
        columnLabel={COLUMNS.find((c) => c.id === activeColumn)?.label}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      <DeleteConfirmModal
        open={isDeleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        isLoading={deleteMutation.isPending}
        taskTitle={taskToDelete?.title}
      />
    </div>
  );
}
