"use client";
import React from "react";
import {
  Box,
  Dialog,
  DialogContent,
  Divider,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import CommonButton from "@/components/CommonButton";
import CommonNoteCard from "@/components/CommonNoteCard";

interface FormData {
  reason: string;
}

interface ReasonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClick: (value: string) => void;
  value?: string;
  title?: string;
  description?: string;
  placeholder?: string;
}

const schema: yup.ObjectSchema<FormData> = yup.object({
  reason: yup.string().required("Required"),
});

const ReasonForDeclineModal: React.FC<ReasonModalProps> = ({
  isOpen,
  onClose,
  onClick,
  value,
  title,
  description,
  placeholder,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      reason: value || "",
    },
  });

  const onSubmit = (data: FormData) => {
    onClick(data.reason);
  };

  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      open={isOpen}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: 3,
          p: 0,
        },
      }}
    >
      <DialogContent sx={{ p: 2 }}>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ p: 2 }}>
          <Typography
            textAlign="center"
            variant="h6"
            fontWeight={500}
            sx={{ mb: 1 }}
          >
            {title ? title : "Reason for decline"}
          </Typography>

          <Divider />

          <Stack mt={3} rowGap={2}>
            <Typography
              textAlign="center"
              component={"p"}
              variant="caption"
              fontWeight={400}
              fontSize={"15px"}
              sx={{ mb: 1 }}
              dangerouslySetInnerHTML={{
                __html: description
                  ? description
                  : `Reason why this recruitment<br /> application is being declined`,
              }}
            />

            <Controller
              name="reason"
              control={control}
              render={({ field }) => (
                <CommonNoteCard
                  title=""
                  description=""
                  placeholder={placeholder ? placeholder : ""}
                  rows={3}
                  {...field}
                  error={!!errors.reason}
                  helperText={errors.reason?.message}
                />
              )}
            />
          </Stack>

          <Stack
            direction={isMobile ? "column" : "row"}
            spacing={2}
            justifyContent="center"
            sx={{ mt: 3 }}
          >
            <CommonButton
              buttonText="Cancel"
              onClick={onClose}
              sx={{
                bgcolor: "#ffffff",
                color: "#000",
                border: "1px solid #e0e0e0",
                borderRadius: 4,
                "&:hover": {
                  bgcolor: "#e0e0e0",
                },
              }}
            />
            <CommonButton
              buttonText="Done"
              type="submit"
              onClick={handleSubmit(onSubmit)}
            />
          </Stack>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ReasonForDeclineModal;
