"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  //   Box,
  Button,
  Stack,
} from "@mui/material";
import KeyValueDetailsForUser, {
  KeyValueItem,
} from "../Cards/KeyValueDetailsForUser";

interface UserDetailsModalProps {
  open: boolean;
  onClose: () => void;
  items: KeyValueItem[];
  onChange: (key: string | undefined, value: string) => void;
  onSave: () => void;
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({
  open,
  onClose,
  items,
  onChange,
  onSave,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3, p: 1 },
      }}
    >
      <DialogTitle sx={{ fontWeight: 600 }}>Edit User Details</DialogTitle>
      <DialogContent>
        <KeyValueDetailsForUser
          items={items}
          isEditable
          isRemoveBorderBottom={false}
          onChange={onChange}
        />
        <Stack direction="row" justifyContent="flex-end" spacing={2} mt={3}>
          <Button onClick={onClose} variant="outlined" color="inherit">
            Cancel
          </Button>
          <Button onClick={onSave} variant="contained" color="primary">
            Save
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailsModal;
