"use client";
import { TaskPage } from '@/types/type';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { Box, Paper } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

export default function Header() {
const queryClient = useQueryClient();
  const [displayCount, setDisplayCount] = useState<number>(0);

  // calc function to calculate the number of displayed tasks
  const calculateDisplayedTasks = () => {
    const allQueriesData = queryClient.getQueriesData({ queryKey: ["tasks"] });
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return allQueriesData.reduce((acc, [_, data]: any) => {
      if (!data?.pages) return acc;
      // fetch the number of tasks in each page
      const loadedInColumn = data.pages.reduce(
        (sum: number, page: TaskPage) => sum + (page.tasks?.length || 0),
        0
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
  }, [queryClient]);

  return (
    <div className="w-full h-fit rounded-0 shadow-none">
      <Paper
        elevation={0}
        sx={{
          p: 3,
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          bgcolor: "white",
          borderRadius: "0px",
          borderBottom: "1px solid #e5e7eb",
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
      </Paper>
    </div>
  );
}
