"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Stack,
  Divider,
  useMediaQuery,
} from "@mui/material";
import { toast } from "react-toastify";
import { useTheme } from "@mui/material/styles";
// Import Yup and react-hook-form
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
//relative path imports
import CommonButton from "../CommonButton";
import CommonInput from "../CommonInput";
import { addCms } from "@/services/api/cmsApi";

interface CmsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRemove: () => void;
}

interface FormData {
  title: string | null;
  alias: string | null;
}

interface AddCMSResponseData {
  title: string;
  alias: string;
}

interface AddCMSResponse {
  data: {
    success: boolean;
    message: string;
    data: AddCMSResponseData[];
  };
}

const schema: yup.ObjectSchema<FormData> = yup.object({
  title: yup.string().required("Required"),
  alias: yup.string().required("Required"),
});

const CmsAddEditModal: React.FC<CmsModalProps> = ({
  isOpen,
  onClose,
  onRemove,
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
      title: "",
      alias: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const payload = {
        ...data,
      };
      const response = (await addCms(payload)) as AddCMSResponse;
      //   console.log(response, "response");
      if (response?.data?.success) {
        toast.success(response?.data?.message);
        setTimeout(() => {
          onRemove();
        }, 500);
      }
    } catch (error) {
      console.error("error:", error);
    }
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
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{
            p: 2,
          }}
        >
          <Typography variant="h6" fontWeight={500} sx={{ mb: 1 }}>
            Add CMS
          </Typography>

          <Divider />

          <Stack mt={3} rowGap={2}>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <CommonInput
                  label="CMS Title *"
                  error={!!errors.title}
                  helperText={errors.title?.message}
                  sx={{
                    border: errors.title
                      ? `1px solid ${theme.palette.error.main}`
                      : "1px solid black !important",
                  }}
                  {...field}
                />
              )}
            />

            <Controller
              name="alias"
              control={control}
              render={({ field }) => (
                <CommonInput
                  label="CMS Alias *"
                  error={!!errors.alias}
                  helperText={errors.alias?.message}
                  sx={{
                    border: errors.title
                      ? `1px solid ${theme.palette.error.main}`
                      : "1px solid black !important",
                  }}
                  {...field}
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
              buttonText="Save"
              type="submit"
              onClick={handleSubmit(onSubmit)}
            />
          </Stack>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default CmsAddEditModal;
