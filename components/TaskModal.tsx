"use client";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { useState, useEffect } from "react";

interface TaskModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (task: { title: string; description: string }) => void;
  initialData?: { title: string; description: string } | null;
  columnLabel?: string;
  isLoading?: boolean;
}

export default function TaskModal({
  open,
  onClose,
  onSave,
  initialData,
  columnLabel,
  isLoading,
}: TaskModalProps) {
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
  }>({ title: "", description: "" });
  const [saveBtn , setSaveBtn] = useState<"Save" | "Update">("Save");

  useEffect(() => {
    if (open) {
      if (initialData) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSaveBtn("Update");
        setFormData({
          title: initialData.title,
          description: initialData.description,
        });
      } else {
        setFormData({ title: "", description: "" });
      }
    }
  }, [initialData, open]);

  const handleSubmit = () => {
    if (formData.title.trim()) {
      onSave(formData);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ fontWeight: "semibold" }}>
        {initialData ? "Edit Task" : `Add Task: ${columnLabel}`}
      </DialogTitle>

      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField
            label="Task Title"
            fullWidth
            required
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
          <TextField
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, justifyContent: "space-between" }}>
        <Button onClick={onClose} color="error">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!formData.title.trim() || isLoading}
          loading={isLoading}
          sx={{ px: 4 }}
        >
          {saveBtn}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
