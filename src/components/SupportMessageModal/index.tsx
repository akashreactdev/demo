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
import { useTheme } from "@mui/material/styles";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import CommonButton from "../CommonButton";
import CommonInput from "../CommonInput";
import CMSEditor from "../CMSEditor";

interface FormData {
  recipient: string | null;
  subject: string | null;
  message: string;
}

interface SupportMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (data: FormData) => Promise<void>;
  defaultRecipient?: string;
}

const schema: yup.ObjectSchema<FormData> = yup.object({
  recipient: yup
    .string()
    .required("Required")
    .email("Enter a valid email address"),
  subject: yup.string().required("Required"),
  message: yup.string().required("Required"),
});

const SupportMessageModal: React.FC<SupportMessageModalProps> = ({
  isOpen,
  onClose,
  onSend,
  defaultRecipient = "",
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const {
    control,
    handleSubmit,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      recipient: defaultRecipient,
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await onSend(data);
    //   handleClose();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleClose = () => {
    reset({
      recipient: defaultRecipient,
      subject: "",
      message: "",
    });
    clearErrors();
    onClose();
  };

  //   const handleClear = () => {
  //     reset({
  //       recipient: defaultRecipient,
  //       subject: "",
  //       message: "",
  //     });
  //     clearErrors();
  //   };

  return (
    <Dialog
      fullWidth
      maxWidth="md"
      open={isOpen}
      onClose={handleClose}
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
            variant="h6"
            fontWeight={500}
            sx={{ mb: 1, textAlign: "center" }}
          >
            New Message
          </Typography>

          <Divider sx={{ mb: 3 }} />

          {/* Subject Field */}
          <Box sx={{ mb: 2 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                border: "1px solid #e0e0e0",
                borderRadius: "10px",
                p: 2,
                backgroundColor: "#fff",
              }}
            >
              <Typography fontSize="16px" fontWeight={500}>
                SUBJECT:
              </Typography>
              <Box sx={{ width: "100%" }}>
                <Controller
                  name="subject"
                  control={control}
                  render={({ field }) => (
                    <CommonInput
                      label=""
                      sx={{
                        border: "none",
                        paddingInline: "0",
                        width: "100%",
                        "&.Mui-error": {
                          border: "none !important",
                          backgroundColor: theme.palette.error.light + "10",
                        },
                      }}
                      height="30px"
                      placeholder="Enter Subject"
                      {...field}
                    />
                  )}
                />
              </Box>
            </Box>
            {errors.subject && (
              <Typography color="error" fontSize="12px" mt={1} ml={1}>
                {errors.subject.message}
              </Typography>
            )}
          </Box>

          {/* Message Field */}
          <Box sx={{ mb: 2 , borderRadius : "10px"}}>
            <Controller
              name="message"
              control={control}
              render={({ field }) => (
                <Box>
                  <CMSEditor
                    value={field.value}
                    onChange={field.onChange}
                    height={"400px"}
                    placeholder="Please provide details..."
                  />
                </Box>
              )}
            />
            {errors.message && (
              <Typography color="error" fontSize="12px" mt={1} ml={1}>
                {errors.message.message}
              </Typography>
            )}
          </Box>

          {/* Action Buttons */}
          {/* <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 3,
            }}
          > */}
            {/* Right side buttons (Cancel) */}
            <Stack
              direction={isMobile ? "column" : "row"}
              spacing={2}
              justifyContent="center"
              sx={{ mt: 3 }}
            >
              <CommonButton
                buttonText="Cancel"
                onClick={handleClose}
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
                buttonText="Send message"
                type="submit"
                //   onClick={handleSubmit(onSubmit)}
              />
            </Stack>
          {/* </Box> */}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default SupportMessageModal;
