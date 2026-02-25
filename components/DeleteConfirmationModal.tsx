"use client";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";

interface DeleteConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  taskTitle?: string;
}

export default function DeleteConfirmModal({
  open,
  onClose,
  onConfirm,
  isLoading,
  taskTitle,
}: DeleteConfirmModalProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogContent sx={{ textAlign: "center", pt: 4 }}>
        <Box sx={{ mb: 2 }}>
          <WarningAmberIcon color="error" sx={{ fontSize: 50 }} />
        </Box>
        <h1 className="text-lg font-bold">{"Confirm Deletion"}</h1>
        <p className="text-sm font-normal text-zinc-700">
          Are you sure you want to delete &quot;
          <strong>{taskTitle || "this task"}</strong>&quot;? This action cannot be
          undone.
        </p>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3, justifyContent: "center", gap: 1 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          color="inherit"
          disabled={isLoading}
          sx={{ borderRadius: "8px", flex: 1 }}
        >
          {"Cancel"}
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="error"
          loading={isLoading}
          sx={{ borderRadius: "8px", flex: 1 }}
        >
          {"Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
