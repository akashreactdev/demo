"use client";
import React, { useEffect, useState } from "react";
import * as yup from "yup";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMediaQuery } from "@mui/material";
import { useTheme, styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Grid2 from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import CommonCard from "@/components/Cards/Common";
import CommonInput from "@/components/CommonInput";
import CommonDatePicker from "@/components/CommonDatePicker";
import CommonSelect from "@/components/CommonSelect";
import CommonButton from "@/components/CommonButton";
import SelectCancelModal from "@/components/CommonModal";
import moment from "moment";
import {
  fetchFollowUpCall,
  FollowUpCall,
  getRtcToken,
  startCall,
  upadateFollowUpCall,
} from "@/services/api/assessmentApi";
import { UserMeetingStatus } from "@/constants/assessmentData";
import CallModal from "@/components/CallModal";

type LegalSignedStatus = "Pending" | "Accepted" | "Declined";

interface StyledChipProps {
  isBgColor?: string;
  isBorderColor?: string;
}
const StyledChip = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isBgColor" && prop !== "isBorderColor",
})<StyledChipProps>(({ theme, isBgColor, isBorderColor }) => ({
  width: "100%",
  padding: "25px",
  borderRadius: "10px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: isBgColor || theme.palette.primary.main,
  border: `1px solid ${isBorderColor || theme.palette.primary.main}`,
  height: "45px",

  [theme.breakpoints.up("md")]: {
    height: "50px !important",
    padding: "25px !important",
  },

  [theme.breakpoints.up("sm")]: {
    height: "45px",
    padding: "20px 25px",
  },
  [theme.breakpoints.up("xs")]: {
    height: "45px",
    padding: "20px 25px",
  },
}));

interface FormData {
  name: string;
  email: string;
  duration: number | null;
  time: string | null;
  pushDate: string | null;
}

interface ParamsProps {
  id: string;
}

interface AssessmentUserData {
  firstName: string | null;
  lastName: string | null;
  email: string;
  role: number | null;
  createdAt: string | null;
}
interface FollowUpCallData {
  title?: string;
}
interface FollowUpCallResponse {
  data: {
    success: boolean;
    message: string;
    data: FollowUpCallData;
  };
}

interface RequestACallPayload {
  name: string | null;
  email: string | null;
  duration: string | null;
  startTime: string | null;
  date: string | null;
  assessMentId: string | null;
}

interface UpdateACallPayload {
  name: string | null;
  duration: string | null;
  startTime: string | null;
  date: string | null;
}
interface Answer {
  _id: string;
  question: string;
  answer: string;
}
interface Assessment {
  _id: string;
  testId: string;
  userId: string;
  answers: Answer[];
  status: string | null;
  isApproved: boolean | string | null;
  score: number | null;
  patientReport: string | null;
  infectionControl: string | null;
  feedBackMessage: string | null;
  taskCompletion: string | null;
  createdAt: string;
}

interface participants {
  user: string;
  role: string;
  status: number;
  _id: number;
}

interface RescheduleRequestData {
  _id: string;
  title: string;
  name: string;
  description: string;
  date: string;
  startTime: string;
  duration: string | number;
  endTime: string | number | null;
  participants: participants[];
  organizer: string;
  status: string;
  notes: string | null;
  service: string | null;
  metadata: {
    rescheduleDate: string;
    rescheduleTime: string;
  };
  createdAt: string;
  updatedAt: string;
}
interface RescheduleRequestResponse {
  data: {
    success: boolean;
    message: string;
    data: RescheduleRequestData[];
  };
}

interface RtcTokenResponse {
  data: {
    success: boolean;
    message: string;
    data: {
      channelName: string;
      token: string;
      uid: number;
    };
  };
}

interface StartCallResponse {
  data: {
    success: boolean;
    message: string;
  };
}

const durationOptions = [
  { label: "30 mins", value: "30" },
  { label: "60 mins", value: "60" },
  { label: "90 mins", value: "90" },
];

const timeOptions = Array.from({ length: 48 }, (_, i) => {
  const hour = Math.floor(i / 2);
  const minute = i % 2 === 0 ? "00" : "30";
  const value = `${String(hour).padStart(2, "0")}:${minute}`;
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  const ampm = hour < 12 ? "AM" : "PM";
  const label = `${hour12}:${minute} ${ampm}`;

  return { label, value };
});

const schema: yup.ObjectSchema<FormData> = yup.object({
  name: yup.string().required("Required"),
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Required"),
  duration: yup.number().nullable().required("Required"),
  time: yup.string().required("Required"),
  pushDate: yup.string().required("Required"),
});

const RequestCall: React.FC = () => {
  const [sendModalOpen, setSendModalOpen] = useState<boolean>(false);
  const params = useParams() as unknown as ParamsProps;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [userData, setUserData] = useState<AssessmentUserData | null>(null);
  const [assessmentFormData, setAssessmentFormData] = useState<FormData | null>(
    null
  );
  const [selectedAssessmentData, setSelectedAssessmentData] =
    useState<Assessment | null>(null);
  const [rescheduleRequestWithMetaData, setRescheduleRequestWithMetaData] =
    useState<RescheduleRequestData[] | null>(null);
  const [
    rescheduleRequestWithoutMetaData,
    setRescheduleRequestWithoutMetaData,
  ] = useState<RescheduleRequestData[] | null>(null);
  const [fetchedRescheduleRequestData, setFetchedRescheduleRequestData] =
    useState<RescheduleRequestData[] | null>(null);
  const [selectedRescheduleRequestData, setSelectedRescheduleRequestData] =
    useState<RescheduleRequestData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [channelName, setChannelName] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const statusBgColor: Record<LegalSignedStatus, string> = {
    Pending: theme.inProgress.background.primary,
    Accepted: theme.accepted.background.primary,
    Declined: theme.declined.background.primary,
  };

  const statusTitleColor: Record<LegalSignedStatus, string> = {
    Pending: theme.inProgress.main,
    Accepted: theme.accepted.main,
    Declined: theme.declined.main,
  };

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      duration: null,
      time: null,
      pushDate: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setAssessmentFormData(data);
    setSendModalOpen(true);
  };

  const sendModalClose = () => {
    setSendModalOpen(false);
  };

  const fetchRescheduleRequest = async (userId: string) => {
    try {
      const response = (await fetchFollowUpCall({
        userId: userId,
      })) as RescheduleRequestResponse;
      if (response?.data?.success) {
        setFetchedRescheduleRequestData(response?.data?.data);
        const itemsWithMetadata = response?.data?.data?.filter(
          (item) => item.metadata
        );
        setRescheduleRequestWithMetaData(itemsWithMetadata);
        const itemsWithOutMetadata = response?.data?.data?.filter(
          (item) => !item.metadata
        );
        setRescheduleRequestWithoutMetaData(itemsWithOutMetadata);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchRescheduleRequest(params?.id);
    const storedData = localStorage.getItem("AssessmentUserData");
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setUserData(parsedData);
      } catch (error) {
        console.error("Invalid JSON:", error);
      }
    }

    const selectedAssessmentData = localStorage.getItem("SelectedAssessment");
    if (selectedAssessmentData) {
      try {
        const parsedData = JSON.parse(selectedAssessmentData);
        setSelectedAssessmentData(parsedData);
      } catch (error) {
        console.error("Invalid JSON:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (userData) {
      const fullName = `${userData.firstName ?? ""} ${
        userData.lastName ?? ""
      }`.trim();
      setValue("name", fullName);
      setValue("email", userData.email);
    }
  }, [userData]);

  const handleSelectRescheduleRequestWithMetadata = (
    item: RescheduleRequestData
  ) => {
    setSelectedRescheduleRequestData(item);
    setValue("name", item.name);
    const duration = Number(item.duration);
    setValue("duration", duration);
    const utcDate = moment
      .utc(item.metadata.rescheduleDate)
      .format("YYYY-MM-DD");
    const utcTime = item.metadata.rescheduleTime;
    if (utcDate && utcTime) {
      const localMoment = moment.utc(`${utcDate}T${utcTime}`).local();
      const localDate = localMoment.format("YYYY-MM-DD");
      const localTime = localMoment.format("HH:mm");
      setValue("pushDate", localDate);
      setValue("time", localTime);
    } else {
      setValue("pushDate", null);
      setValue("time", null);
    }
  };

  const handleSelectRescheduleRequest = (item: RescheduleRequestData) => {
    setSelectedRescheduleRequestData(item);
    setValue("name", item.name);
    const duration = Number(item.duration);
    setValue("duration", duration);
    const utcDate = moment.utc(item.date).format("YYYY-MM-DD");
    const utcTime = item.startTime;
    if (utcDate && utcTime) {
      const localMoment = moment.utc(`${utcDate}T${utcTime}`).local();
      const localDate = localMoment.format("YYYY-MM-DD");
      const localTime = localMoment.format("HH:mm");
      setValue("pushDate", localDate);
      setValue("time", localTime);
    } else {
      setValue("pushDate", null);
      setValue("time", null);
    }
  };

  const userParticipant = selectedRescheduleRequestData?.participants?.find(
    (p) => p.role === "User"
  );
  const statusNumber = userParticipant?.status as UserMeetingStatus;
  const statusString = UserMeetingStatus[
    statusNumber as UserMeetingStatus
  ] as LegalSignedStatus;

  const onClickStartCall = async () => {
    setIsLoading(true);
    const participants = selectedRescheduleRequestData?.participants || [];
    const userParticipant = participants.find((p) => p.role === "User");
    const adminParticipant = participants.find((p) => p.role === "Admin");
    const userName = userParticipant?.user || "";
    const adminName = adminParticipant?.user || "";
    const channelName = `${adminName}_${userName}`;
    const callId: string = selectedRescheduleRequestData?._id || "";
    try {
      const response = (await getRtcToken(channelName)) as RtcTokenResponse;
      if (response?.data?.success) {
        localStorage.setItem("rtcToken", response?.data?.data?.token);
        localStorage.setItem("uid", String(response?.data?.data?.uid));
        try {
          const startCallResponse = (await startCall(
            callId
          )) as StartCallResponse;
          if (startCallResponse?.data?.success) {
            setChannelName(response?.data?.data?.channelName);
            setIsModalOpen(true);
          }
        } catch (e) {
          console.log(e);
        }
      }
    } catch (error) {
      console.error("Error starting call:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const RequestACall = async (payload: RequestACallPayload) => {
    try {
      const response = (await FollowUpCall(payload)) as FollowUpCallResponse;
      if (response?.data?.success) {
        toast.success(response?.data?.message);
        setSendModalOpen(false);
        fetchRescheduleRequest(params?.id);
        setValue("duration", null);
        setValue("pushDate", "");
        setValue("time", null);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const UpdateACall = async (Id: string, payload: UpdateACallPayload) => {
    try {
      const response = (await upadateFollowUpCall(
        Id,
        payload
      )) as FollowUpCallResponse;
      if (response?.data?.success) {
        toast.success(response?.data?.message);
        setSendModalOpen(false);
        fetchRescheduleRequest(params?.id);
        setValue("duration", null);
        setValue("pushDate", "");
        setValue("time", null);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const onSend = () => {
    if (
      rescheduleRequestWithMetaData &&
      rescheduleRequestWithMetaData?.length > 0 &&
      rescheduleRequestWithoutMetaData &&
      rescheduleRequestWithoutMetaData?.length > 0 &&
      !selectedRescheduleRequestData
    ) {
      toast.error("Please select a request block to reschedule the call.");
      setSendModalOpen(false);
      setValue("duration", null);
      setValue("pushDate", "");
      setValue("time", null);
      return;
    }

    const hasUserWithStatusTwo = fetchedRescheduleRequestData?.some((item) =>
      item.participants.some(
        (participant) => participant.role === "User" && participant.status === 2
      )
    );

    if (
      (hasUserWithStatusTwo && selectedRescheduleRequestData) ||
      selectedRescheduleRequestData?.metadata
    ) {
      const localDateTimeStr = `${moment(assessmentFormData?.pushDate).format(
        "YYYY-MM-DD"
      )}T${assessmentFormData?.time}:00`;
      const localDate = new Date(localDateTimeStr);
      const utcDateTimeStr = localDate.toISOString();
      const [utcDate, utcTimeFull] = utcDateTimeStr.split("T");
      const utcTime = utcTimeFull.slice(0, 5);

      const payload = {
        name: assessmentFormData?.name ?? null,
        startTime: utcTime ? utcTime : null,
        date: utcDate ? moment(utcDate).format("YYYY-MM-DD") : null,
        duration:
          assessmentFormData?.duration != null
            ? String(assessmentFormData.duration)
            : null,
      };
      UpdateACall(selectedRescheduleRequestData?._id, payload);
    } else {
      const localDateTimeStr = `${moment(assessmentFormData?.pushDate).format(
        "YYYY-MM-DD"
      )}T${assessmentFormData?.time}:00`;
      const localDate = new Date(localDateTimeStr);
      const utcDateTimeStr = localDate.toISOString();
      const [utcDate, utcTimeFull] = utcDateTimeStr.split("T");
      const utcTime = utcTimeFull.slice(0, 5);

      const payload = {
        name: assessmentFormData?.name ?? null,
        email: assessmentFormData?.email ?? null,
        startTime: utcTime ? utcTime : null,
        date: utcDate ? moment(utcDate).format("YYYY-MM-DD") : null,
        duration:
          assessmentFormData?.duration != null
            ? String(assessmentFormData.duration)
            : null,
        assessMentId: selectedAssessmentData?._id ?? null,
      };
      RequestACall(payload);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <CommonCard>
        <Stack
          direction={isMobile ? "column" : "row"}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Stack gap={2} maxWidth={"500px"}>
            <Typography variant="h6" fontWeight={500}>
              Request Follow-Up Call
            </Typography>
            <Typography variant="body1">
              Initiate a discussion with the applicant to review assessment gaps
              and clarify responsesRequest Follow-Up Call
            </Typography>
          </Stack>
          {selectedRescheduleRequestData ? (
            <Stack
              direction={"row"}
              alignItems={"center"}
              justifyContent={"end"}
              width={"100%"}
              spacing={2}
            >
              <Box>
                <StyledChip
                  width={"max-content"}
                  isBgColor={statusBgColor[statusString]}
                  isBorderColor={statusTitleColor[statusString]}
                >
                  <Typography
                    variant="body1"
                    fontWeight={500}
                    color={statusTitleColor[statusString]}
                  >
                    {statusString}
                  </Typography>
                </StyledChip>
              </Box>
              <Box>
                <CommonButton
                  buttonText="Start Call"
                  disabled={
                    userParticipant?.status === 1 ||
                    userParticipant?.status === 3
                      ? true
                      : false
                  }
                  buttonTextStyle={{ fontWeight: "400", fontSize: "16px" }}
                  onClick={onClickStartCall}
                  loading={isLoading}
                />
              </Box>
            </Stack>
          ) : null}
        </Stack>
      </CommonCard>
      {rescheduleRequestWithoutMetaData &&
        rescheduleRequestWithoutMetaData.length > 0 && (
          <Box mt={3}>
            <CommonCard>
              <Typography variant="h6" fontWeight={500}>
                Schedule request
              </Typography>
              <Stack flexDirection={"row"} columnGap={2} mt={2}>
                {rescheduleRequestWithoutMetaData
                  ?.sort((a, b) => moment(b.date).diff(moment(a.date)))
                  .map((item, index) =>
                    item ? (
                      <Box
                        key={index}
                        gap={1}
                        sx={{
                          backgroundColor:
                            item._id === selectedRescheduleRequestData?._id
                              ? theme.inProgress.background.primary
                              : theme.inProgress.background.secondaryborder,
                          border:
                            item._id === selectedRescheduleRequestData?._id
                              ? `1px solid ${theme.inProgress.main}`
                              : `1px solid ${theme.pending.secondary}`,
                          width: "250px",
                          padding: "15px 13px",
                          borderRadius: "10px",
                          cursor: "pointer",
                        }}
                        onClick={() => handleSelectRescheduleRequest(item)}
                      >
                        <Typography variant="body1" fontSize={"15px"}>
                          {item.date && item.startTime
                            ? moment
                                .utc(
                                  `${moment(item.date).format("YYYY-MM-DD")}T${
                                    item.startTime
                                  }`
                                )
                                .local()
                                .format("dddd DD, MMM")
                            : "N/A"}
                        </Typography>

                        <Typography variant="body1" fontSize={"12px"}>
                          {item.date && item.startTime
                            ? moment
                                .utc(
                                  `${moment(item.date).format("YYYY-MM-DD")}T${
                                    item.startTime
                                  }`
                                )
                                .local()
                                .format("hh:mm A")
                            : "N/A"}
                        </Typography>
                      </Box>
                    ) : null
                  )}
              </Stack>
            </CommonCard>
          </Box>
        )}
      {rescheduleRequestWithMetaData &&
        rescheduleRequestWithMetaData.length > 0 && (
          <Box mt={3}>
            <CommonCard>
              <Typography variant="h6" fontWeight={500}>
                Reschedule request
              </Typography>
              <Stack flexDirection={"row"} columnGap={2} mt={2}>
                {rescheduleRequestWithMetaData
                  ?.sort((a, b) => moment(b.date).diff(moment(a.date)))
                  .map((item, index) =>
                    item ? (
                      <Box
                        key={index}
                        gap={1}
                        sx={{
                          backgroundColor:
                            item._id === selectedRescheduleRequestData?._id
                              ? theme.inProgress.background.primary
                              : theme.inProgress.background.secondaryborder,
                          border:
                            item._id === selectedRescheduleRequestData?._id
                              ? `1px solid ${theme.inProgress.main}`
                              : `1px solid ${theme.pending.secondary}`,
                          width: "250px",
                          padding: "15px 13px",
                          borderRadius: "10px",
                          cursor: "pointer",
                        }}
                        onClick={() =>
                          handleSelectRescheduleRequestWithMetadata(item)
                        }
                      >
                        <Typography variant="body1" fontSize={"15px"}>
                          {item.date && item.startTime
                            ? moment
                                .utc(
                                  `${moment(item.date).format("YYYY-MM-DD")}T${
                                    item.startTime
                                  }`
                                )
                                .local()
                                .format("dddd DD, MMM")
                            : "N/A"}
                        </Typography>

                        <Typography variant="body1" fontSize={"12px"}>
                          {item.date && item.startTime
                            ? moment
                                .utc(
                                  `${moment(item.date).format("YYYY-MM-DD")}T${
                                    item.startTime
                                  }`
                                )
                                .local()
                                .format("hh:mm A")
                            : "N/A"}
                        </Typography>
                      </Box>
                    ) : null
                  )}
              </Stack>
            </CommonCard>
          </Box>
        )}
      <Box mt={3}>
        <CommonCard>
          <Typography variant="h6" fontWeight={500}>
            Details
          </Typography>
          <Grid2 container spacing={2} mt={2}>
            <Grid2 size={{ md: 6, lg: 6, xl: 6, sm: 12, xs: 12 }}>
              <Box mt={3}>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <CommonInput
                      label="Name"
                      error={!!errors.name}
                      isLabelBold={true}
                      helperText={errors.name?.message}
                      {...field}
                      sx={{
                        "&.MuiOutlinedInput-root": {
                          border: `1px solid ${theme.pending.secondary}`,
                          "& .MuiOutlinedInput-notchedOutline": {
                            border: "none",
                          },
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            border: `1px solid ${theme.accepted.background.fourth}`,
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            border: `1px solid ${theme.palette.common.black}`,
                          },

                          "&.Mui-error": {
                            border: `1px solid ${theme.declined.secondary}`,
                          },
                        },
                      }}
                    />
                  )}
                />
              </Box>
            </Grid2>
            <Grid2 size={{ md: 6, lg: 6, xl: 6, sm: 12, xs: 12 }}>
              <Box mt={3}>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <CommonInput
                      label="Email"
                      disabled={true}
                      isLabelBold={true}
                      error={!!errors.email}
                      helperText={errors.email?.message}
                      {...field}
                      sx={{
                        "&.MuiOutlinedInput-root": {
                          border: `1px solid ${theme.pending.secondary}`,
                          "& .MuiOutlinedInput-notchedOutline": {
                            border: "none",
                          },
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            border: `1px solid ${theme.accepted.background.fourth}`,
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            border: `1px solid ${theme.palette.common.black}`,
                          },

                          "&.Mui-error": {
                            border: `1px solid ${theme.declined.secondary}`,
                          },
                        },
                      }}
                    />
                  )}
                />
              </Box>
            </Grid2>
            <Grid2 size={{ md: 6, lg: 6, xl: 6, sm: 12, xs: 12 }}>
              <Box mt={3}>
                <Controller
                  name="pushDate"
                  control={control}
                  render={({ field }) => (
                    <CommonDatePicker
                      label="Date"
                      isLabelBold={true}
                      value={field.value ? new Date(field.value) : null}
                      onChange={(date) =>
                        field.onChange(
                          date
                            ? date.toLocaleDateString("en-CA") + "T00:00:00"
                            : null
                        )
                      }
                      placeholder="Set Date"
                      isBoldLabel
                      error={!!errors.pushDate}
                      helperText={errors.pushDate?.message}
                      minDate={dayjs(new Date())}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          marginTop: "0px",
                          borderColor: theme.pending.secondary,
                          border: `1px solid ${theme.pending.secondary} !important`,
                          "& .MuiOutlinedInput-notchedOutline": {
                            border: "none",
                          },
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            border: `1px solid ${theme.accepted.background.fourth}`,
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            border: `1px solid ${theme.palette.common.black} !important`,
                          },

                          "&.Mui-error": {
                            border: `1px solid ${theme.declined.secondary}`,
                          },
                        },
                      }}
                    />
                  )}
                />
              </Box>
            </Grid2>
            <Grid2 size={{ md: 6, lg: 6, xl: 6, sm: 12, xs: 12 }}>
              <Box mt={3}>
                <Controller
                  name="time"
                  control={control}
                  render={({ field }) => (
                    <CommonSelect
                      label="Time"
                      placeholder="Set Time.."
                      value={field.value}
                      onChange={field.onChange}
                      options={timeOptions}
                      helperText={errors.time?.message}
                      error={!!errors.time}
                      sx={{
                        width: "100%",
                        height: "50px",
                        fontSize: "16px",
                        backgroundColor: theme.palette.common.white,
                        border: `1px solid ${theme.pending.secondary}`,
                      }}
                    />
                  )}
                />
              </Box>
            </Grid2>
            <Grid2 size={{ md: 6, lg: 6, xl: 6, sm: 12, xs: 12 }}>
              <Box mt={3}>
                <Controller
                  name="duration"
                  control={control}
                  render={({ field }) => (
                    <CommonSelect
                      label="Duration"
                      placeholder="Set Time.."
                      value={field.value}
                      onChange={field.onChange}
                      options={durationOptions}
                      helperText={errors.duration?.message}
                      error={!!errors.duration}
                      sx={{
                        width: "100%",
                        height: "50px",
                        fontSize: "16px",
                        backgroundColor: theme.palette.common.white,
                        border: `1px solid ${theme.pending.secondary}`,
                      }}
                    />
                  )}
                />
              </Box>
            </Grid2>
          </Grid2>
        </CommonCard>
      </Box>
      <Stack mt={4} mr={2} flexDirection={"row"} justifyContent={"end"}>
        <Box width={"max-content"}>
          <CommonButton buttonText="Send" type="submit" />
        </Box>
      </Stack>

      <SelectCancelModal
        title="Are you sure?"
        question={`Are you sure you want to send the call request to ${userData?.email}`}
        buttonText="Send"
        isOpen={sendModalOpen}
        onClose={sendModalClose}
        onRemove={onSend}
      />

      <CallModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        channelName={channelName}
      />
    </Box>
  );
};

export default RequestCall;
