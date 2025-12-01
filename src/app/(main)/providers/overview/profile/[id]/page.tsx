"use client";
import React, { useEffect, useMemo, useState } from "react";
import moment from "moment";
import Image from "next/image";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid2 from "@mui/material/Grid2";
import {
  // Button,
  IconButton,
  Stack,
  useMediaQuery,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import MoreVertSharpIcon from "@mui/icons-material/MoreVertSharp";
import ChevronRightSharpIcon from "@mui/icons-material/ChevronRightSharp";
//relative path imports
import CommonCard from "@/components/Cards/Common";
import KeyValueDetails from "@/components/Cards/KeyValueDetails";
import Specalisations from "@/components/carers/profile/Specalisations";
import ProfileCard from "@/components/Cards/Profile";
import CommonNoteCard from "@/components/CommonNoteCard";
// import TeamMemberCard from "@/components/TeamMemberCard";
// import Documentation from "@/components/carers/Documentation";
// import CommonChip from "@/components/CommonChip";
import {
  // getProviderTeamMemberList,
  getSingleProviderInfo,
  removeProvider,
  updateProvider,
} from "@/services/api/providerApi";
import { ProviderProfileResponse } from "@/types/providerProfileTypes";
import {
  // MemberAccessEnum,
  ProviderCateogry,
  ProviderType,
  TeamMemberJobStatus,
} from "@/constants/providerData";
import { useRouterLoading } from "@/hooks/useRouterLoading";
import ReasonForDeclineModal from "@/components/carers/profile/ReasonForDeclineModal";
import CommonIconText from "@/components/CommonIconText";
import AssessmentVerificationStatus from "@/components/AssessmentVerificationStatus";
import CommonButton from "@/components/CommonButton";
// import BankDetails from "@/components/carers/profile/BankDetails";

interface ActiveStatusProps {
  isActive?: boolean;
}

const ActiveStatus = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isActive",
})<ActiveStatusProps>(({ isActive }) => ({
  padding: "8px 16px",
  border: isActive ? "1px solid #6A9F69" : "1px solid #9C3C3C",
  backgroundColor: isActive ? "#E5F0E5" : "#F4A6A6",
  borderRadius: "8px",
}));

interface ParamsProps {
  id: string;
}

interface ProviderAccountResponse {
  data: {
    success: boolean;
    message: string;
  };
}

interface RemoveProviderAccountResponse {
  data: {
    success: boolean;
    message: string;
  };
}

const StyledBox = styled(Box)(({ theme }) => ({
  border: `1px solid ${theme.pending.secondary}`,
  padding: "10px 20px",
  borderRadius: "10px",
  display: "flex",
  alignItems: "center",
  minHeight: "47px",
}));

const Profile: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const params = useParams() as unknown as ParamsProps;
  const { navigateWithLoading } = useRouterLoading();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [providerProfileInfo, setProviderInfo] = useState<
    ProviderProfileResponse["data"]["data"] | null
  >(null);
  const [isreasonModalOpen, setIsReasonModalOpen] = useState<boolean>(false);
  const [deactivateID, setDeactivateID] = useState<string | null>(null);

  const onCloseReasonModal = () => {
    setIsReasonModalOpen(false);
  };

  useEffect(() => {
    if (params?.id) {
      fetchSingleProfile(params?.id);
    }
  }, [params?.id]);

  const fetchSingleProfile = async (id: string) => {
    try {
      const response = (await getSingleProviderInfo(
        id
      )) as ProviderProfileResponse;
      if (response?.data?.success) {
        setProviderInfo(response?.data?.data);
        localStorage.setItem(
          "SelectedProvider",
          JSON.stringify(response?.data?.data)
        );
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleActionClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleActionItemClick = (index: number, id: string) => {
    if (index === 0) {
      setIsReasonModalOpen(true);
      setDeactivateID(id);
    } else if (index === 1) {
      onRemoveProviderAccount(params?.id);
    }
    handleClose();
  };

  const onClickSaveBtnInModal = (value: string) => {
    onPauseProviderAccount(deactivateID, 8, value);
  };

  const onPauseProviderAccount = async (
    id: string | null,
    status?: number,
    notes?: string
  ) => {
    try {
      const payload = {
        status: status,
        notes: notes,
      };
      const response = (await updateProvider(
        id,
        payload
      )) as ProviderAccountResponse;
      if (response?.data?.success) {
        toast.success(response?.data?.message);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const onRemoveProviderAccount = async (id: string) => {
    try {
      const response = (await removeProvider(
        id
      )) as RemoveProviderAccountResponse;
      if (response?.data?.success) {
        fetchSingleProfile(params?.id);
        toast.success(response?.data?.message);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const data = useMemo(() => {
    return [
      {
        icon: "/assets/svg/dashboard/users.svg",
        title: "Engagement rate",
        description: "+12% vs last 30 days",
        count: `${providerProfileInfo?.engagementRate}%`,
      },
      {
        icon: "/assets/svg/dashboard/hospital.svg",
        title: "Response Rate",
        description: "+12% vs last 30 days",
        count: `${providerProfileInfo?.responseRate}%`,
      },
      {
        icon: "/assets/svg/provider/profile/Calendar-1--Streamline-Ultimate.svg",
        title: "Pricing",
        description: "",
        count: providerProfileInfo?.pricing
          ? `${providerProfileInfo?.pricing}/week`
          : "N/A",
      },
      {
        icon: "/assets/svg/dashboard/currency.svg",
        title: "Availability status",
        description: "",
        count: providerProfileInfo?.currentlyAvailable === true ? "Yes" : "No",
      },
    ];
  }, [providerProfileInfo]);

  const account_information = useMemo(() => {
    return [
      {
        label: "Name",
        value: providerProfileInfo?.fullName || "N/A",
      },
      {
        label: "Date of birth",
        value: providerProfileInfo?.dob
          ? moment(providerProfileInfo?.dob).format("DD.MM.YYYY")
          : "N/A",
      },
      {
        label: "Mobile no.",
        value: providerProfileInfo?.contactNo || "N/A",
      },
      {
        label: "Gender",
        value:
          providerProfileInfo?.gender?.[0] === 1
            ? "Male"
            : providerProfileInfo?.gender?.[0] === 2
            ? "Female"
            : "Others",
      },
      {
        label: "Job role",
        value:
          typeof providerProfileInfo?.jobRole === "number"
            ? TeamMemberJobStatus[
                providerProfileInfo?.jobRole as TeamMemberJobStatus
              ]
            : "N/A",
      },
    ];
  }, [providerProfileInfo]);

  const business_information = useMemo(() => {
    return [
      {
        label: "Business name",
        value: providerProfileInfo?.businessName || "N/A",
      },
      {
        label: "Contact Number",
        value: providerProfileInfo?.businessContactNo || "N/A",
      },
      {
        label: "Email address",
        value: providerProfileInfo?.businessEmail || "N/A",
      },
      {
        label: "Provider category",
        value:
          providerProfileInfo?.typeOfProvider &&
          providerProfileInfo?.typeOfProvider.length > 0
            ? providerProfileInfo?.typeOfProvider
                .map((p) => ProviderCateogry[p.value])
                .join(", ")
            : "N/A",
      },
      {
        label: "Address line 1",
        value: providerProfileInfo?.houseNo || "N/A",
      },
      {
        label: "Address line 2",
        value: providerProfileInfo?.address || "N/A",
      },
      {
        label: "Post code",
        value: providerProfileInfo?.postCode || "N/A",
      },
      {
        label: "Country",
        value: providerProfileInfo?.country || "N/A",
      },

      {
        label: "Service area",
        value: providerProfileInfo?.serviceArea || "N/A",
      },
    ];
  }, [providerProfileInfo]);

  const cqc_documents = useMemo(() => {
    return (
      providerProfileInfo?.cqcDocument?.map((doc) => {
        if (!doc.documentUrl) return { title: "N/A", url: "N/A" };
        const fullPath = doc.documentUrl;
        const lastSegment = fullPath.split("/document/").pop() || "";
        const match = lastSegment.match(/^(.+?\.[a-zA-Z0-9]{2,5})/);
        const cleanFilename = match ? match[1] : lastSegment;

        return {
          title:
            cleanFilename.length > 30
              ? cleanFilename.slice(0, 30) + "..."
              : cleanFilename,
          url: doc.documentUrl,
          isApproved: doc.isApproved,
          isRejected: doc.isRejected,
        };
      }) || []
    );
  }, [providerProfileInfo]);

  const handleDocumentClick = (url?: string | null) => {
    if (url) {
      const documentUrl = `${process.env.NEXT_PUBLIC_ASSETS_URL}/${url}`;
      window.open(documentUrl, "_blank");
    }
  };

  return (
    <Box>
      <CommonCard>
        <Stack
          direction={"row"}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Stack direction={"row"} alignItems={"center"} spacing={2}>
            <Image
              src={
                providerProfileInfo?.businessLogo != "carer/profile" &&
                providerProfileInfo?.businessLogo != null
                  ? `${process.env.NEXT_PUBLIC_ASSETS_URL}/${providerProfileInfo?.businessLogo}`
                  : `/assets/images/profile.jpg`
              }
              alt="user-profile-pic"
              height={60}
              width={60}
              style={{ borderRadius: "50px" }}
            />
            <Typography variant="h6" fontWeight={500}>
              {providerProfileInfo?.businessName || "N/A"} |{" "}
              {providerProfileInfo?.userSubType
                ? ProviderType[providerProfileInfo?.userSubType]
                : "N/A"}
            </Typography>
          </Stack>
          <Stack direction={"row"} alignItems={"center"} spacing={2}>
            {!isMobile && (
              <>
                <Box textAlign={"right"}>
                  <Typography variant="caption" fontWeight={400}>
                    Last active
                  </Typography>
                  <Typography
                    component={"p"}
                    variant="caption"
                    fontWeight={500}
                  >
                    {providerProfileInfo?.lastLogin != null
                      ? moment(providerProfileInfo?.lastLogin)
                          .local()
                          .format("Do MMMM YYYY [at] hh:mm A")
                      : "Not logged-in since a while!"}
                  </Typography>
                </Box>
                <ActiveStatus isActive={providerProfileInfo?.status === 3}>
                  <Typography
                    variant="caption"
                    fontWeight={500}
                    color={
                      providerProfileInfo?.status === 3
                        ? theme.accepted.main
                        : theme.declined.main
                    }
                  >
                    {providerProfileInfo?.status === 3 ? "Active" : "Inactive"}
                  </Typography>
                </ActiveStatus>
              </>
            )}
            <IconButton onClick={(event) => handleActionClick(event)}>
              <MoreVertSharpIcon style={{ color: "#000000" }} />
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
              {(providerProfileInfo?.status === 8 ||
              providerProfileInfo?.status === 1
                ? ["Activate account"]
                : ["Deactive account"]
              ).map((action, index) => (
                <MenuItem
                  key={index}
                  sx={{
                    color:
                      providerProfileInfo?.status === 8 ||
                      providerProfileInfo?.status === 1
                        ? theme?.palette.common.black
                        : theme.declined.main,
                  }}
                  onClick={() =>
                    providerProfileInfo?.status === 8 ||
                    providerProfileInfo?.status === 1
                      ? onPauseProviderAccount(params?.id, 3)
                      : handleActionItemClick(index, params?.id)
                  }
                >
                  {action}
                </MenuItem>
              ))}
            </Menu>
          </Stack>
        </Stack>

        {isMobile && (
          <Stack
            mt={2}
            direction={"row"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Box>
              <Typography variant="caption" fontWeight={400}>
                Last active
              </Typography>
              <Typography component={"p"} variant="caption" fontWeight={500}>
                {providerProfileInfo?.lastLogin != null
                  ? moment(providerProfileInfo?.lastLogin)
                      .local()
                      .format("Do MMMM YYYY [at] hh:mm A")
                  : "Not logged-in since a while!"}
              </Typography>
            </Box>
            <ActiveStatus isActive={providerProfileInfo?.status === 3}>
              <Typography
                variant="caption"
                fontWeight={500}
                color={
                  providerProfileInfo?.status === 3
                    ? theme.accepted.main
                    : theme.declined.main
                }
              >
                {providerProfileInfo?.status === 3 ? "Active" : "InActive"}
              </Typography>
            </ActiveStatus>
          </Stack>
        )}

        <Box mt={4} width={"100%"} height={"100%"}>
          <Grid2 container spacing={2}>
            {data.map((ele, index) => {
              return (
                <Grid2
                  key={index}
                  size={{ lg: 3, xl: 3, md: 6, sm: 6, xs: 12 }}
                >
                  <ProfileCard
                    path={ele.icon}
                    alt={ele.icon}
                    title={ele.title}
                    count={ele.count}
                    description={ele.description}
                  />
                </Grid2>
              );
            })}
          </Grid2>
        </Box>
      </CommonCard>

      <Box>
        <Grid2 container spacing={2}>
          <Grid2 size={{ md: 6, sm: 12, xs: 12, lg: 6, xl: 6 }}>
            <Box mt={4}>
              <CommonCard>
                <Typography variant="h6" fontWeight={500}>
                  Provider information
                </Typography>

                <Box mt={4}>
                  <Image
                    src={
                      providerProfileInfo?.businessLogo != "provider/logo" &&
                      providerProfileInfo?.businessLogo != null
                        ? `${process.env.NEXT_PUBLIC_ASSETS_URL}/${providerProfileInfo?.businessLogo}`
                        : "/assets/images/Rectangle.jpg"
                    }
                    alt="profile-pic"
                    height={182}
                    width={182}
                  />

                  <Box mt={4}>
                    <KeyValueDetails items={account_information} />
                  </Box>

                  <Box mt={4}>
                    <KeyValueDetails items={business_information} />
                  </Box>
                </Box>
              </CommonCard>
            </Box>

            <Box mt={4}>
              <CommonCard>
                <Typography variant="h6" fontWeight={500}>
                  About
                </Typography>
                <CommonNoteCard value={providerProfileInfo?.about || ""} />
              </CommonCard>
            </Box>
            <Box mt={4}>
              <Specalisations
                title="Services"
                specialisations={
                  providerProfileInfo &&
                  (providerProfileInfo.services?.length ||
                    providerProfileInfo.customServices?.length) > 0
                    ? ([
                        ...(providerProfileInfo.services || []),
                        ...(providerProfileInfo.customServices || []),
                      ].map((item, index) => ({
                        name: item,
                        value: index + 1,
                      })) as unknown as [{ name: string; value: number }])
                    : undefined
                }
              />
            </Box>
          </Grid2>
          <Grid2 size={{ md: 6, sm: 12, xs: 12, lg: 6, xl: 6 }}>
            <Box>
              <CommonCard sx={{ mt: 4 }}>
                <Typography variant="h6" fontWeight={500}>
                  Profile information
                </Typography>
                <Box mt={3}>
                  <Typography variant="body1" fontWeight={500}>
                    Company number
                  </Typography>
                  <Divider sx={{ mt: 1 }} />
                  <StyledBox mt={2}>1234567890</StyledBox>
                </Box>
                <Box mt={3}>
                  <Typography variant="body1" fontWeight={500}>
                    Years in business
                  </Typography>
                  <Divider sx={{ mt: 1 }} />
                  <StyledBox mt={2}>3 years</StyledBox>
                </Box>
                <Box mt={3}>
                  <Typography variant="body1" fontWeight={500}>
                    Staff headcount
                  </Typography>
                  <Divider sx={{ mt: 1 }} />
                  <StyledBox mt={2}>10-20</StyledBox>
                </Box>
                <Box mt={3}>
                  <Typography variant="body1" fontWeight={500}>
                    Company turnover
                  </Typography>
                  <Divider sx={{ mt: 1 }} />
                  <StyledBox mt={2}>10-20</StyledBox>
                </Box>
                <Box mt={3}>
                  <Typography variant="body1" fontWeight={500}>
                    Documents
                  </Typography>
                  <Divider sx={{ mt: 1 }} />
                  {cqc_documents?.map((doc, index) => (
                    <Box key={index} mt={2}>
                      <CommonIconText
                        icon={"/Hyperlink-3--Streamline-Ultimate.svg"}
                        title={doc.title ? doc.title : "CQC_registration.PDF"}
                        endIcon={true}
                        onClick={() => handleDocumentClick(doc.url)}
                      />
                    </Box>
                  ))}
                </Box>
                {/* <Documentation Documentations={cqc_documents} /> */}
              </CommonCard>
            </Box>

            <Box mt={4}>
              <CommonCard>
                <Typography variant="h6" fontWeight={500}>
                  Team members
                </Typography>
                {providerProfileInfo?.teamMember &&
                  providerProfileInfo?.teamMember.length > 0 &&
                  providerProfileInfo?.teamMember.map((team, index) => (
                    <Box mt={3} key={index}>
                      <Stack
                        flexDirection={"row"}
                        justifyContent={"space-between"}
                      >
                        <Typography variant="body1" fontWeight={500}>
                          {team?.memberName || "N/A"}
                        </Typography>
                        <Typography variant="body1" fontWeight={400}>
                          {team?.mobileNumber || "N/A"}
                        </Typography>
                      </Stack>
                      {index < providerProfileInfo.teamMember.length - 1 && (
                        <Divider sx={{ mt: 1 }} />
                      )}
                    </Box>
                  ))}
                {/* <Box mt={3}>
                  <Stack flexDirection={"row"} justifyContent={"space-between"}>
                    <Typography variant="body1" fontWeight={500}>
                      Team members
                    </Typography>
                    <Typography variant="body1" fontWeight={400}>
                      +44 7781 167584
                    </Typography>
                  </Stack>
                  <Divider sx={{ mt: 1 }} />
                </Box>
                <Box mt={3}>
                  <Stack flexDirection={"row"} justifyContent={"space-between"}>
                    <Typography variant="body1" fontWeight={500}>
                      Team members
                    </Typography>
                    <Typography variant="body1" fontWeight={400}>
                      +44 7781 167584
                    </Typography>
                  </Stack>
                </Box> */}
              </CommonCard>
            </Box>

            <Box mt={4}>
              <CommonCard>
                <Typography variant="h6" fontWeight={500}>
                  Job listings
                </Typography>
                <Typography variant="caption">
                  View all the job listings that has been entered by the
                  provider
                </Typography>
                <CommonButton
                  buttonText="View all"
                  variant="contained"
                  onClick={() =>
                    navigateWithLoading(
                      `/providers/overview/profile/${params?.id}/job-listings`
                    )
                  }
                  endIcon={<ChevronRightSharpIcon />}
                  sx={{
                    mt: 3,
                    height: "40px",
                    width: isMobile ? "140px" : "130px",
                    backgroundColor: theme?.ShadowAndBorder?.shadow2,
                    border: `1px solid ${theme?.ShadowAndBorder?.border2}`,
                  }}
                  buttonTextStyle={{
                    fontSize: "12px  !important",
                    fontWeight: 400,
                  }}
                />
              </CommonCard>
            </Box>

            <Box mt={4}>
              <AssessmentVerificationStatus
                dateLabel="Date"
                title="Ai assessment"
                description=" "
                status={providerProfileInfo?.assessment?.isApproved}
                date={providerProfileInfo?.assessment?.createdAt}
                value={
                  providerProfileInfo?.assessment?.feedBackMessage
                    ? providerProfileInfo?.assessment?.feedBackMessage
                    : ""
                }
                onClickBtn={() =>
                  navigateWithLoading(
                    `/assessment/${providerProfileInfo?.userId}/view-assessment`
                  )
                }
              />
            </Box>
          </Grid2>
        </Grid2>
      </Box>

      <ReasonForDeclineModal
        isOpen={isreasonModalOpen}
        onClick={onClickSaveBtnInModal}
        onClose={onCloseReasonModal}
        value={""}
        title={"Reason for suspension"}
        description={
          "Please outline your reasons for suspending this <br />account"
        }
        placeholder="Please provide details..."
      />
    </Box>
  );
};

export default Profile;
