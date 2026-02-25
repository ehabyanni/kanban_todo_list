"use client";
import { TaskPage } from "@/types/type";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { Box, InputAdornment, Paper, TextField } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";

export default function Header({
  onSearch,
  searchTerm
}: {
  onSearch: (val: string) => void;
  searchTerm: string
}) {
  const queryClient = useQueryClient();
  const [displayCount, setDisplayCount] = useState<number>(0);
  const [inputValue, setInputValue] = useState<string>("");

  // debounce function to delay the search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(inputValue);
    }, 500);

    return () => clearTimeout(timer);
  }, [inputValue, onSearch]);

  // calc function to calculate the number of displayed tasks
  const calculateDisplayedTasks = () => {
    const allQueriesData = queryClient.getQueriesData({ queryKey: ["tasks"] });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return allQueriesData.reduce((acc, [queryKey, data]: any) => {
      if (!data?.pages || !queryKey.includes(searchTerm)) return acc;
      // fetch the number of tasks in each page
      const loadedInColumn = data.pages.reduce(
        (sum: number, page: TaskPage) => sum + (page.tasks?.length || 0),
        0,
      );
      return acc + loadedInColumn;
    }, 0);
  };

  useEffect(() => {
    const unsubscribe = queryClient.getQueryCache().subscribe(() => {
      setDisplayCount(calculateDisplayedTasks());
    });

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDisplayCount(calculateDisplayedTasks());

    return () => unsubscribe();
  }, [queryClient, searchTerm]);
  

  return (
    <div className="w-full h-fit rounded-0 shadow-none">
      <Paper
        elevation={0}
        sx={{
          p: 3,
          width: "100%",
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          bgcolor: "white",
          borderRadius: "0px",
          borderBottom: "1px solid #e5e7eb",
          gap: { xs: 2, sm: 0 },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              bgcolor: "#3b82f6",
              p: 1,
              borderRadius: "10px",
              display: "flex",
              color: "white",
            }}
          >
            <AssignmentIcon />
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0 }}>
            <h1 className="text-xl uppercase font-semibold text-black">
              {"Kanban Board"}
            </h1>
            <p className="text-md font-normal text-black">
              <strong>{displayCount}</strong>
              {" tasks"}
            </p>
          </Box>
        </Box>
        <TextField
          size="small"
          placeholder="Search tasks..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          sx={{ width: 300 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'gray' }} />
              </InputAdornment>
            ),
          }}
        />
      </Paper>
    </div>
  );
}
