"use client";
import React, { useState } from "react";
// Import Yup and react-hook-form
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Grid2 from "@mui/material/Grid2";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
//relative path imports
import CommonCard from "@/components/Cards/Common";
import CommonSelect from "@/components/CommonSelect";
import CommonButton from "@/components/CommonButton";
import CommonNoteCard from "@/components/CommonNoteCard";
import CommonDatePicker from "@/components/CommonDatePicker";
import SelectModal from "@/components/CommonSelectModal";
import { createNotification } from "@/services/api/notificationsApi";
import { useRouterLoading } from "@/hooks/useRouterLoading";

const userBasedOptions = [
  { label: "All", value: 1 },
  { label: "User", value: 2 },
  { label: "Carers", value: 3 },
  { label: "Clinical", value: 4 },
  { label: "Providers", value: 5 },
];

const reminderTypeOptions = [
  { label: "Immediate", value: 1 },
  { label: "Scheduled", value: 2 },
  { label: "Event", value: 3 },
];

interface FormData {
  notificationTitle: string;
  notificationMessage: string;
  userBase: number | null;
  reminderType: number | null;
  pushDate: string | null;
}

interface notificationData {
  _id: string;
  notificationTitle: string;
  notificationMessage: string;
  userBase: number | null;
  reminderType: number | null;
  pushDate: string | null;
}
interface notificationResponse {
  data: {
    success: boolean;
    message: string;
    data: notificationData[];
  };
}

const schema: yup.ObjectSchema<FormData> = yup.object({
  notificationTitle: yup.string().required("Required"),
  notificationMessage: yup.string().required("Required"),
  userBase: yup.number().nullable().required("Required"),
  reminderType: yup.number().nullable().required("Required"),
  pushDate: yup.string().required("Required"),
});

const NewPushNotification: React.FC = () => {
  const theme = useTheme();
  const { navigateWithLoading } = useRouterLoading();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [isScheduledOpen, setIsScheduledOpen] = useState<boolean>(false);
  const [isEventOpen, setIsEventOpen] = useState<boolean>(false);
  const [scheduleModalDate, setScheduleModalDate] = useState<Date | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      notificationTitle: "",
      notificationMessage: "",
      userBase: null,
      reminderType: null,
      pushDate: "",
    },
  });

  const handleScheduleModalChange = (date: Date | null) => {
    if (date) {
      setScheduleModalDate(date);
      setValue("pushDate", date.toISOString().split(".")[0]);
      setTimeout(() => {
        handleScheduleClose();
      }, 500);
    }
  };

  const handleScheduleClose = () => {
    setIsScheduledOpen(false);
  };

  const handleEventClose = () => {
    setIsEventOpen(false);
  };

  const handleEventSet = () => {
    setIsEventOpen(false);
  };

  const handleEventChange = (value: number | null) => {
    setSelectedEvent(value);
  };

  const onSubmit = async (data: FormData) => {
    try {
      const payload = {
        ...data,
        eventName: selectedEvent,
      };
      const response = (await createNotification(
        payload
      )) as notificationResponse;
      if (response?.data?.success) {
        toast.success(response?.data?.message);
        setTimeout(() => {
          navigateWithLoading("/settings/push-notifications");
        }, 500);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <Grid2 container spacing={2}>
        <Grid2 size={{ md: 6, lg: 6, xl: 6, sm: 12, xs: 12 }} >
          <CommonCard sx={{ height : "100%"}}>
            <Typography variant="h6" fontWeight={500}>
              Add Details
            </Typography>

            <Box mt={3}>
              <Controller
                name="notificationTitle"
                control={control}
                render={({ field }) => (
                  <CommonNoteCard
                    rows={1}
                    title="Notification title"
                    error={!!errors.notificationTitle}
                    helperText={errors.notificationTitle?.message}
                    sx={{
                      "& textarea": {
                        minHeight: "40px !important",
                        height: "40px",
                      },
                    }}
                    {...field}
                  />
                )}
              />
            </Box>
            <Box mt={3}>
              <Controller
                name="notificationMessage"
                control={control}
                render={({ field }) => (
                  <CommonNoteCard
                    rows={1}
                    title="Notification message"
                    error={!!errors.notificationMessage}
                    helperText={errors.notificationMessage?.message}
                    sx={{
                      "& textarea": {
                        minHeight: "100px !important",
                        height: "100px",
                      },
                    }}
                    {...field}
                  />
                )}
              />
            </Box>
          </CommonCard>
        </Grid2>
        <Grid2 size={{ md: 6, lg: 6, xl: 6, sm: 12, xs: 12 }}>
          <CommonCard sx={{ height : "100%"}}>
            <Typography variant="h6" fontWeight={500}>
              Schedule
            </Typography>
            <Box mt={3}>
              <Controller
                name="userBase"
                control={control}
                render={({ field }) => (
                  <CommonSelect
                    label="User base"
                    placeholder="Please Select...."
                    value={field.value}
                    onChange={field.onChange}
                    options={userBasedOptions}
                    helperText={errors.userBase?.message}
                    error={!!errors.userBase}
                    sx={{
                      width: "100%",
                      height: "50px",
                      fontSize: "16px",
                      backgroundColor: "#ffffff",
                      border: "1px solid #EAEAEA",
                    }}
                  />
                )}
              />
            </Box>
            <Box mt={3}>
              <Controller
                name="reminderType"
                control={control}
                render={({ field }) => (
                  <CommonSelect
                    label="Push reminder"
                    placeholder="Please Select...."
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value);
                      if (value === 2) {
                        setIsScheduledOpen(true);
                      }
                      if (value === 3) {
                        setIsEventOpen(true);
                      }
                    }}
                    options={reminderTypeOptions}
                    helperText={errors.reminderType?.message}
                    error={!!errors.reminderType}
                    sx={{
                      width: "100%",
                      height: "50px",
                      fontSize: "16px",
                      backgroundColor: "#ffffff",
                      border: "1px solid #EAEAEA",
                    }}
                  />
                )}
              />
            </Box>
            <Box mt={3}>
              <Controller
                name="pushDate"
                control={control}
                render={({ field }) => (
                  <CommonDatePicker
                    label="Push date"
                    value={field.value ? new Date(field.value) : null}
                    onChange={(date) =>
                      field.onChange(
                        date ? date.toISOString().split(".")[0] : null
                      )
                    }
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: theme.palette.common.black,
                        },
                        "&:hover fieldset": {
                          borderColor: theme.palette.common.black,
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: theme.palette.common.black,
                        },
                      },
                    }}
                    placeholder="Please select"
                    isBoldLabel
                  />
                )}
              />
            </Box>
          </CommonCard>
        </Grid2>
      </Grid2>
      <Box mt={2}>
        {/* <CommonCard> */}
          {/* <Typography variant="h6" fontWeight={500}>
            Save details
          </Typography>
          <Typography>
            Save the details of this push notification. You can always return
            and edit it if needed.
          </Typography> */}

          <Stack alignItems={"flex-end"} justifyContent={"flex-end"} mt={4}>
            <Box
              sx={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                gap: 2,
              }}
            >
              <CommonButton
                buttonText="Cancel"
                sx={{
                  backgroundColor: "#E2E6EB",
                  maxWidth: isMobile ? "100%" : "max-content",
                }}
                buttonTextStyle={{ fontSize: "14px !important" }}
                onClick={() =>
                  navigateWithLoading("/settings/push-notifications")
                }
              />
              <CommonButton
                buttonText="Submit for approval"
                sx={{ maxWidth: isMobile ? "100%" : "max-content" }}
                buttonTextStyle={{ fontSize: "14px !important" }}
                type="submit"
              />
            </Box>
          </Stack>
        {/* </CommonCard> */}
      </Box>
      {isScheduledOpen && (
        <Dialog
          fullWidth
          maxWidth="xs"
          open={isScheduledOpen}
          onClose={handleScheduleClose}
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
              sx={{
                textAlign: "center",
              }}
            >
              <CommonCard>
                <CommonDatePicker
                  label=""
                  value={scheduleModalDate}
                  isStatic={true}
                  disablePast={true}
                  onChange={handleScheduleModalChange}
                  isBoldLabel
                  placeholder="Please select"
                />
              </CommonCard>
            </Box>
          </DialogContent>
        </Dialog>
      )}
      {isEventOpen && (
        <SelectModal
          isOpen={isEventOpen}
          onClose={handleEventClose}
          onSet={handleEventSet}
          onChangeEvent={handleEventChange}
        />
      )}
    </Box>
  );
};

export default NewPushNotification;
