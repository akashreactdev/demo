"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useMediaQuery, Menu, MenuItem } from "@mui/material";
import { useTheme, styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Grid2 from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import MoreVertSharpIcon from "@mui/icons-material/MoreVertSharp";
import CommonButton from "@/components/CommonButton";
import CommonCard from "@/components/Cards/Common";
import CommonNoteCard from "@/components/CommonNoteCard";
import SelectCancelModal from "@/components/CommonModal";
import {
  ApproveReject,
  getSingleAssessmentInfo,
  getSingleCarerForRoute,
  getSingleClinicalForRoute,
  getSingleProviderForRoute,
} from "@/services/api/assessmentApi";
import { getUserRedirectPath } from "@/constants/assessmentData";
import { ProviderProfileResponse } from "@/types/providerProfileTypes";
import { ClinicalProfileResponse } from "@/types/clinicalProfileTypes";
import { useRouterLoading } from "@/hooks/useRouterLoading";

interface TabProps {
  isSelected?: boolean;
}

interface ParamsProps {
  id: string;
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

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  role: number;
  status: number;
  createdAt: string;
}

interface AssessmentData {
  assessment: Assessment[];
  userData: UserData;
}

interface SingleAssessmentResponse {
  data: {
    success: boolean;
    message: string;
    data: AssessmentData;
  };
}

interface ApproveRejectAssessmentResponse {
  data: {
    success: boolean;
    message: string;
    data: AssessmentData;
  };
}

const StyledTab = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isSelected",
})<TabProps>(({ isSelected, theme }) => ({
  backgroundColor: isSelected
    ? theme.palette.common.white
    : theme.pending.secondary,
  cursor: "pointer",
  padding: "32px",
  marginBlock: "33px 23px",
  width: "max-content",
  borderRadius: "16px",
  border: isSelected
    ? `1px solid ${theme.inProgress.background.border}`
    : "null",

  [theme.breakpoints.up("sm")]: {
    padding: "20px",
  },
  [theme.breakpoints.up("md")]: {
    padding: "20px",
  },
  [theme.breakpoints.up("xs")]: {
    padding: "20px",
  },
}));

const ViewAssessment: React.FC = () => {
  const theme = useTheme();
  const { navigateWithLoading } = useRouterLoading();
  const params = useParams() as unknown as ParamsProps;
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [internalSelectedTab, setInternalSelectedTab] = useState<string | null>(
    null
  );
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [approveModalOpen, setApproveModalOpen] = useState<boolean>(false);
  const [failedModalOpen, setFailedModalOpen] = useState<boolean>(false);
  const [isApprove, setIsApprove] = useState<boolean | null>(false);
  const [assessmentInfo, setAssessmentInfo] = useState<AssessmentData | null>(
    null
  );
  const [selectedAssessment, setSelectedAssessment] =
    useState<Assessment | null>(null);

  useEffect(() => {
    if (params?.id) {
      fetchSingleAssement(params?.id);
    }
  }, [params?.id]);

  useEffect(() => {
    if (assessmentInfo?.assessment?.length) {
      setInternalSelectedTab(assessmentInfo.assessment[0]._id);
      setSelectedAssessment(assessmentInfo.assessment[0]);
      localStorage.setItem(
        "SelectedAssessment",
        JSON.stringify(assessmentInfo.assessment[0])
      );

      const isApproved = assessmentInfo?.assessment?.[0]?.isApproved;

      if (isApproved === true) {
        setIsApprove(true);
      } else if (isApproved === false) {
        setIsApprove(false);
      } else if (
        assessmentInfo?.assessment?.[0]?.score &&
        assessmentInfo?.assessment?.[0]?.score > 75
      ) {
        setIsApprove(true);
      } else {
        setIsApprove(null);
      }
    }
  }, [assessmentInfo]);

  const fetchSingleAssement = async (id: string) => {
    try {
      const response = (await getSingleAssessmentInfo(
        id
      )) as SingleAssessmentResponse;
      if (response?.data?.success) {
        setAssessmentInfo(response?.data?.data);

        const assessmentUserData = response?.data?.data?.userData;
        localStorage.setItem(
          "AssessmentUserData",
          JSON.stringify(assessmentUserData)
        );
      }
    } catch (e) {
      console.log(e);
    }
  };

  const fetchSingleProvider = async (
    id: string,
    userType: number,
    status: number
  ) => {
    try {
      const response = (await getSingleProviderForRoute(
        id
      )) as ProviderProfileResponse;
      if (response?.data?.success) {
        const path = getUserRedirectPath(userType, status);
        if (path) {
          navigateWithLoading(`/${path}/profile/${response?.data?.data?._id}`);
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  const fetchSingleClinical = async (
    id: string,
    userType: number,
    status: number
  ) => {
    try {
      const response = (await getSingleClinicalForRoute(
        id
      )) as ClinicalProfileResponse;
      if (response?.data?.success) {
        const path = getUserRedirectPath(userType, status);
        if (path) {
          navigateWithLoading(`/${path}/profile/${response?.data?.data?._id}`);
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  const fetchSingleCarer = async (
    id: string,
    userType: number,
    status: number
  ) => {
    try {
      const response = await getSingleCarerForRoute(id);
      if (response?.data?.success) {
        const path = getUserRedirectPath(userType, status);
        if (path) {
          navigateWithLoading(`/${path}/profile/${response?.data?.data?._id}`);
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleActionClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = (index: number) => {
    const userType = assessmentInfo?.userData?.role;
    const status = assessmentInfo?.userData?.status;
    if (index === 0 && userType && status) {
      if (userType === 3) {
        fetchSingleCarer(
          selectedAssessment?.userId ? selectedAssessment?.userId : "",
          userType,
          status
        );
      } else if (userType === 4) {
        fetchSingleClinical(
          selectedAssessment?.userId ? selectedAssessment?.userId : "",
          userType,
          status
        );
      } else if (userType === 5) {
        fetchSingleProvider(
          selectedAssessment?.userId ? selectedAssessment?.userId : "",
          userType,
          status
        );
      }
    }
    if (index === 1) {
      setFailedModalOpen(true);
    }
    handleClose();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onApproveModalClose = () => {
    setApproveModalOpen(false);
  };
  const onApprove = () => {
    const ApproveRejectAssessment = async () => {
      const payload = {
        isApproved: true,
      };
      try {
        const response = (await ApproveReject(
          payload,
          selectedAssessment?._id ?? null
        )) as ApproveRejectAssessmentResponse;
        if (response?.data?.success) {
          setIsApprove(true);
          onApproveModalClose();
          fetchSingleAssement(params?.id);
        }
      } catch (e) {
        console.log(e);
      }
    };
    ApproveRejectAssessment();
  };

  const onFailedModalClose = () => {
    setFailedModalOpen(false);
  };

  const onFailed = () => {
    const ApproveRejectAssessment = async () => {
      const payload = {
        isApproved: false,
      };
      try {
        const response = (await ApproveReject(
          payload,
          selectedAssessment?._id ?? null
        )) as ApproveRejectAssessmentResponse;
        if (response?.data?.success) {
          setIsApprove(false);
          onFailedModalClose();
          navigateWithLoading(
            `/assessment/${params?.id}/view-assessment/failed-assessment`
          );
        }
      } catch (e) {
        console.log(e);
      }
    };
    ApproveRejectAssessment();
  };

  return (
    <Box>
      <CommonCard>
        <Stack
          direction={isMobile ? "column" : "row"}
          alignItems={isMobile ? "flex-start" : "center"}
          justifyContent={"space-between"}
          spacing={isMobile ? 2 : 0}
        >
          <Box>
            <Typography variant="h6" fontWeight={500}>
              Assessment status
            </Typography>
            <Typography variant="body1">
              Here is the current status of the ai interview taken
            </Typography>
          </Box>
          <Stack direction={"row"} spacing={2}>
            {isApprove === null && (
              <CommonButton
                buttonText="Request a Call"
                sx={{
                  maxWidth: isMobile ? "100%" : "max-content",
                  border: `1px solid ${theme.inProgress.main}`,
                  backgroundColor: theme.inProgress.background.primary,
                }}
                buttonTextStyle={{ fontSize: "14px !important" }}
                startIcon={
                  <Image
                    src={"/assets/svg/assessment/camera_meeting.svg"}
                    alt={"smile_type_conversation"}
                    height={28}
                    width={28}
                  />
                }
                onClick={() =>
                  navigateWithLoading(
                    `/assessment/${params?.id}/view-assessment/request-a-call`
                  )
                }
              />
            )}
            {isApprove === null ? (
              <CommonButton
                buttonText="Approve"
                sx={{ maxWidth: isMobile ? "100%" : "max-content" }}
                buttonTextStyle={{ fontSize: "14px !important" }}
                startIcon={
                  <Image
                    src={"/assets/svg/assessment/check_circle.svg"}
                    alt={"smile_type_conversation"}
                    height={24}
                    width={24}
                  />
                }
                onClick={() => setApproveModalOpen(true)}
              />
            ) : isApprove === true ? (
              <CommonButton
                buttonText="Approved"
                sx={{
                  maxWidth: isMobile ? "100%" : "max-content",
                  backgroundColor: `${theme.accepted.background.third} !important`,
                  border: `1px solid ${theme.accepted.main}`,
                }}
                buttonTextStyle={{
                  fontSize: "14px !important",
                  color: theme.accepted.main,
                }}
                startIcon={
                  <Image
                    src={"/assets/svg/assessment/check_circle_selected.svg"}
                    alt={"smile_type_conversation"}
                    height={24}
                    width={24}
                  />
                }
                disabled={isApprove}
              />
            ) : (
              <CommonButton
                buttonText="Failed"
                sx={{
                  maxWidth: isMobile ? "100%" : "max-content",
                  backgroundColor: theme.declined.background.secondary,
                  border: `1px solid ${theme.declined.main}`,
                }}
                buttonTextStyle={{
                  fontSize: "14px !important",
                  color: theme.declined.main,
                }}
                startIcon={
                  <Image
                    src={"/assets/svg/assessment/remove_circle.svg"}
                    alt={"smile_type_conversation"}
                    height={24}
                    width={24}
                  />
                }
                disabled={isApprove === false ? true : false}
                onClick={() => setIsApprove(false)}
              />
            )}
            <IconButton
              onClick={(event) => handleActionClick?.(event)}
              disabled={
                selectedAssessment?.isApproved != null ||
                (selectedAssessment?.score && selectedAssessment?.score > 75)
                  ? true
                  : false
              }
            >
              <MoreVertSharpIcon
                style={{ color: theme.palette.common.black }}
              />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              PaperProps={{
                sx: {
                  border: "1px solid #E2E6EB",
                  borderRadius: "10px",
                },
              }}
            >
              {["View profile", "Fail  Assessment"].map((action, index) => (
                <MenuItem
                  key={index}
                  onClick={() => handleMenuItemClick?.(index)}
                  sx={{
                    color: index === 1 ? theme.declined.main : "inherit",
                  }}
                >
                  {action}
                </MenuItem>
              ))}
            </Menu>
          </Stack>
        </Stack>
      </CommonCard>
      <Grid2 container mt={3} spacing={3}>
        <Grid2 size={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 6 }}>
          <Box
            sx={{
              borderRadius: "15px",
              backgroundColor: theme.pending.main,
              padding: "33px 33px 20px 33px",
              height: "100%",
            }}
          >
            <Typography
              variant="body1"
              fontWeight={500}
              fontSize={"24px"}
              mb={1}
              width={"80%"}
            >
              Assessment Complete!
            </Typography>
            <Typography variant="body1" mb={1} width={"80%"}>
              Here’s your result based on your interview, CV, and
              certifications.
            </Typography>
            <Typography
              variant="body1"
              mt={"29px"}
              lineHeight={1}
              sx={{
                fontSize: {
                  xs: "72px",
                  sm: "92px",
                  md: "120px",
                  lg: "180px",
                },
              }}
              width={"80%"}
            >
              {selectedAssessment?.score
                ? `${selectedAssessment?.score}%`
                : "0%"}
            </Typography>
          </Box>
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 6 }}>
          <Box
            sx={{
              borderRadius: "15px",
              backgroundColor: theme.palette.common.white,
              padding: "33px 33px 20px 33px",
              height: "100%",
            }}
          >
            <Typography mb={"33px"} variant="body1">
              You’re on the right path! To better prepare for caregiver roles,
              we recommend reviewing our training materials before{" "}
              <b>retaking the assessment.</b>
            </Typography>
            <hr />
            <Grid2 container spacing={2} mt={"33px"}>
              <Grid2 size={{ xs: 12, sm: 12, md: 12, lg: 6, xl: 6 }}>
                <Typography variant="body1" fontWeight={500} mb={1}>
                  Strengths
                </Typography>
                <Stack
                  direction={"row"}
                  spacing={2}
                  mb={"5px"}
                  marginBottom={"15px"}
                >
                  <Image
                    src={"/assets/svg/assessment/smile_type_conversation.svg"}
                    alt={"smile_type_conversation"}
                    height={24}
                    width={24}
                  />
                  <Typography variant="body1">
                    Patient rapport (
                    {selectedAssessment?.patientReport
                      ? `${selectedAssessment?.patientReport}`
                      : 0}
                    /5)
                  </Typography>
                </Stack>
                <Stack direction={"row"} spacing={2}>
                  <Image
                    src={"/assets/svg/assessment/safety_warning.svg"}
                    alt={"smile_type_conversation"}
                    height={24}
                    width={24}
                  />
                  <Typography variant="body1">
                    Infection control (
                    {selectedAssessment?.infectionControl
                      ? `${selectedAssessment?.infectionControl}`
                      : 0}
                    /5)
                  </Typography>
                </Stack>
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 12, md: 12, lg: 6, xl: 6 }}>
                <Typography variant="body1" fontWeight={500}>
                  Imporve
                </Typography>
                <Stack direction={"row"} spacing={2}>
                  <Image
                    src={"/assets/svg/assessment/check_circle.svg"}
                    alt={"smile_type_conversation"}
                    height={24}
                    width={24}
                  />
                  <Typography variant="body1">
                    Punctuality & task completion (
                    {selectedAssessment?.taskCompletion
                      ? `${selectedAssessment?.taskCompletion}`
                      : 0}
                    /5)
                  </Typography>
                </Stack>
              </Grid2>
            </Grid2>
          </Box>
        </Grid2>
      </Grid2>

      <Stack flexDirection={"row"} columnGap={2}>
        {assessmentInfo?.assessment?.map((assessment, index) => (
          <StyledTab
            key={index}
            isSelected={internalSelectedTab === assessment._id}
            onClick={() => {
              setInternalSelectedTab(assessment._id);
              setSelectedAssessment(assessment);
              localStorage.setItem(
                "SelectedAssessment",
                JSON.stringify(assessment)
              );
              const isApproved = assessment?.isApproved;

              if (isApproved === true) {
                setIsApprove(true);
              } else if (isApproved === false) {
                setIsApprove(false);
              } else if (assessment?.score && assessment?.score > 75) {
                setIsApprove(true);
              } else {
                setIsApprove(null);
              }
            }}
          >
            <Typography variant="body1" fontWeight={500}>
              Assessment # {`${index + 1}`}
            </Typography>
          </StyledTab>
        ))}
      </Stack>
      <Grid2 container spacing={2}>
        {assessmentInfo?.assessment
          ?.find((a) => a._id === internalSelectedTab)
          ?.answers?.map((q, index) => (
            <Grid2 key={index} size={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 6 }}>
              <Box
                sx={{
                  padding: "32px",
                  backgroundColor: theme.palette.common.white,
                  borderRadius: "16px",
                }}
              >
                <CommonNoteCard
                  title={`${index + 1}. ${q.question}`}
                  value={q.answer}
                />
              </Box>
            </Grid2>
          ))}
      </Grid2>

      <SelectCancelModal
        title="Approve account assessement"
        question={`Are you sure you want to approve ${
          assessmentInfo?.userData?.firstName +
          " " +
          assessmentInfo?.userData?.lastName
        }'s account assessment?`}
        buttonText="Approve"
        isOpen={approveModalOpen}
        onClose={onApproveModalClose}
        onRemove={onApprove}
      />
      <SelectCancelModal
        title="Fail account assessment"
        question={`Are you sure you want to fail ${
          assessmentInfo?.userData?.firstName +
          " " +
          assessmentInfo?.userData?.lastName
        }'s account assessment?`}
        buttonText="Fail"
        isOpen={failedModalOpen}
        onClose={onFailedModalClose}
        onRemove={onFailed}
        buttonsx={{ backgroundColor: theme.declined.main }}
        buttonTextStyle={{ color: theme.palette.common.white }}
      />
    </Box>
  );
};

export default ViewAssessment;
