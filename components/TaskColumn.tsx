"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import { getTasksByColumn } from "@/app/api/task";
import {
  Box,
  Paper,
  IconButton,
  Button,
  CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { TaskColumnProps } from "@/types/type";

export default function TaskColumn({
  col,
  searchTerm,
  onAddTask,
  onEditTask,
  onDeleteTask,
}: TaskColumnProps) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["tasks", col.id, searchTerm],
      queryFn: ({ pageParam }) => getTasksByColumn(col.id, pageParam as number, searchTerm),
      initialPageParam: 1,
      getNextPageParam: (lastPage) => lastPage.nextPage,
    });

  const allTasks = data?.pages.flatMap((page) => page.tasks) || [];

  return (
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
        <IconButton size="small" onClick={() => onAddTask(col.id)}>
          <AddIcon fontSize="small" />
        </IconButton>
      </Box>

      {isLoading ? (
        <Box display="flex" justifyContent="center" p={2}>
          <CircularProgress size={24} />
        </Box>
      ) : (
        <Droppable droppableId={col.id}>
          {(provided) => (
            <Box
              {...provided.droppableProps}
              ref={provided.innerRef}
              sx={{
                flexGrow: 1,
                maxHeight: "420px",
                overflowY: "auto",
                px: 1,
                "::-webkit-scrollbar": { width: "6px" },
                "::-webkit-scrollbar-thumb": {
                  backgroundColor: "#cbd5e1",
                  borderRadius: "10px",
                },
                "::-webkit-scrollbar-track": { backgroundColor: "transparent" },
              }}
            >
              {allTasks.map((task, index) => (
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
                          ? "0 5px 15px rgba(0,0,0,0.2)"
                          : "none",
                      }}
                    >
                      <h2 className="text-md font-semibold">{task.title}</h2>
                      <p className="text-sm text-gray-600">
                        {task.description}
                      </p>
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
                          onClick={() => onEditTask(task)}
                        >
                          <EditIcon fontSize="inherit" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => onDeleteTask(task)}
                        >
                          <DeleteIcon fontSize="inherit" />
                        </IconButton>
                      </Box>
                    </Paper>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}

              {hasNextPage && (
                <Button
                  fullWidth
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  sx={{ mt: 1, fontSize: "0.75rem" }}
                >
                  {isFetchingNextPage ? "Loading..." : "Load More"}
                </Button>
              )}
            </Box>
          )}
        </Droppable>
      )}
    </Paper>
  );
}
