"use client";
import React, { useEffect, useMemo, useState } from "react";
import moment from "moment";
import { toast } from "react-toastify";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useRouterLoading } from "@/hooks/useRouterLoading";
import { useMediaQuery, Menu, MenuItem, CircularProgress } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Grid2 from "@mui/material/Grid2";
import IconButton from "@mui/material/IconButton";
import MoreVertSharpIcon from "@mui/icons-material/MoreVertSharp";
import ChevronRightSharpIcon from "@mui/icons-material/ChevronRightSharp";
//relative path imports
import CommonCard from "@/components/Cards/Common";
import ProfileCard from "@/components/Cards/Profile";
import KeyValueDetails from "@/components/Cards/KeyValueDetails";
// import RequestCard from "@/components/Cards/Request";
// import VerificationStatus from "@/components/carers/profile/VerificationStatus";
import CardTypeOffered from "@/components/carers/profile/CardTypeOffered";
import ProfileInformation from "@/components/carers/profile/Informations";
// import BankDetails from "@/components/carers/profile/BankDetails";
// import Documentations from "@/components/carers/profile/Documentation";
// import CompletedJobs from "@/components/carers/profile/CompletedJobs";
// import ActiveJobs from "@/components/carers/profile/ActiveJobs";
// import ClientList from "@/components/carers/profile/ClientList";
import PersonalBio from "@/components/carers/profile/PersonalBio";
import Specalisations from "@/components/carers/profile/Specalisations";
// import Qualifications from "@/components/carers/profile/Qualifications";
import {
  getCarerInfo,
  removeCarer,
  updateCarer,
} from "@/services/api/carerApi";
import { CarerProfileData } from "@/types/carerProfileType";
import CommonButton from "@/components/CommonButton";
import InsuranceSection from "@/components/carers/profile/InsuranceSection";
import AssessmentVerificationStatus from "@/components/AssessmentVerificationStatus";
import RecruitmentPassportSection from "@/components/RecruitmentPassportSection";
import AvailabilityForProfile from "@/components/carers/profile/AvailabilityForProfile";
import ReasonForDeclineModal from "@/components/carers/profile/ReasonForDeclineModal";
import { UserStatus } from "@/constants/assessmentData";
// import { IdCardType } from "@/constants/carersData";
// import {
//   RelationshipDuration,
//   RelationshipType,
// } from "@/constants/clinicalData";

interface ActiveStatusProps {
  isActive?: boolean;
}

interface PauseCarerResponse {
  data: {
    success: boolean;
    message: string;
  };
}

interface RemoveCarerResponse {
  data: {
    success: boolean;
    message: string;
  };
}

const ActiveStatus = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isActive",
})<ActiveStatusProps>(({ isActive, theme }) => ({
  padding: "8px 16px",
  border: isActive
    ? `1px solid ${theme.accepted.main}`
    : `1px solid ${theme.declined.main}`,
  backgroundColor: isActive
    ? theme.accepted.background.secondary
    : theme.declined.background.primary,
  borderRadius: "8px",
}));

interface AccordionItem {
  title: string;
  type: "text" | "chip";
  content: string | string[];
}

interface ParamsProps {
  id: string;
}

const Profile: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const params = useParams() as unknown as ParamsProps;
  const { navigateWithLoading } = useRouterLoading();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [carerProfileInfo, setCarerProfileInfo] =
    useState<CarerProfileData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isreasonModalOpen, setIsReasonModalOpen] = useState<boolean>(false);
  const [deactivateID, setDeactivateID] = useState<string | null>(null);

  const onCloseReasonModal = () => {
    setIsReasonModalOpen(false);
  };

  useEffect(() => {
    if (params?.id) {
      fetchCarerProfile(params?.id);
    }
  }, [params?.id]);

  const fetchCarerProfile = async (id: string) => {
    setIsLoading(true);
    try {
      const response = await getCarerInfo(id);
      if (response?.data?.success) {
        setIsLoading(false);
        setCarerProfileInfo(response?.data?.data);
        localStorage.setItem(
          "SelectedCarer",
          JSON.stringify(response?.data?.data)
        );
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
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
      onRemoveCarerAccount(params?.id);
    }
    handleClose();
  };

  const onClickSaveBtnInModal = (value: string) => {
    onPauseCarerAccount(deactivateID, 8, value);
  };

  const onPauseCarerAccount = async (
    id: string | null,
    status?: number,
    notes?: string
  ) => {
    try {
      const payload = {
        status: status,
        notes: notes,
      };
      const response = (await updateCarer(id, payload)) as PauseCarerResponse;
      if (response?.data?.success) {
        setDeactivateID(null);
        setIsReasonModalOpen(false);
        toast.success(response?.data?.message);
        fetchCarerProfile(params?.id);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const onRemoveCarerAccount = async (id: string) => {
    try {
      const response = (await removeCarer(id)) as RemoveCarerResponse;
      if (response?.data?.success) {
        fetchCarerProfile(params?.id);
        toast.success(response?.data?.message);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const account_informations = useMemo(() => {
    // const addressParts = [
    //   carerProfileInfo?.houseNo,
    //   carerProfileInfo?.address,
    //   carerProfileInfo?.country,
    //   carerProfileInfo?.postCode,
    // ].filter((part) => part && part.trim() !== "");

    // const address = addressParts.length > 0 ? addressParts.join(", ") : "N/A";
    return [
      // {
      //   label: "Title",
      //   value:
      //     carerProfileInfo?.gender?.[0] === 1
      //       ? "Mr"
      //       : carerProfileInfo?.gender?.[0] === 2
      //       ? "Ms / Mrs"
      //       : "N/A",
      // },
      {
        label: "Name",
        value: carerProfileInfo?.fullName || "N/A",
      },
      {
        label: "Date of birth",
        value:
          moment(carerProfileInfo?.dob, "DD-MM-YYYY").format("Do MMMM YYYY") ||
          "N/A",
      },
      {
        label: "Mobile Number",
        value: carerProfileInfo?.mobileNumber || "N/A",
      },
      {
        label: "Gender",
        value:
          carerProfileInfo?.gender?.[0] === 1
            ? "Male"
            : carerProfileInfo?.gender?.[0] === 2
            ? "Female"
            : "Others",
      },
      {
        label: "Address line 1",
        value: carerProfileInfo?.address || "N/A",
      },
      {
        label: "House name/no",
        value: carerProfileInfo?.houseNo || "N/A",
      },
      {
        label: "Post code",
        value: carerProfileInfo?.postCode || "N/A",
      },
      {
        label: "Country",
        value: carerProfileInfo?.country || "N/A",
      },
    ];
  }, [carerProfileInfo]);

  const data = useMemo(() => {
    return [
      {
        icon: "/assets/svg/dashboard/users.svg",
        title: "Rating",
        description: "+12% vs last 30 days",
        count:
          carerProfileInfo?.rating !== null
            ? carerProfileInfo?.rating === 0
              ? "0"
              : carerProfileInfo?.rating
            : "N/A",
      },
      {
        icon: "/assets/svg/dashboard/hospital.svg",
        title: "Active jobs",
        description: "+12% vs last 30 days",
        count:
          carerProfileInfo?.activeJobs !== null
            ? carerProfileInfo?.activeJobs?.activeCount === 0
              ? "0"
              : carerProfileInfo?.activeJobs?.activeCount
            : "N/A",
      },
      {
        icon: "/assets/svg/dashboard/hospital.svg",
        title: "Completed jobs",
        description: "+12% vs last 30 days",
        count:
          carerProfileInfo?.completedJobs !== null
            ? carerProfileInfo?.completedJobs === 0
              ? "0"
              : carerProfileInfo?.completedJobs
            : "N/A",
      },
      {
        icon: "/assets/svg/dashboard/currency.svg",
        title: "Response rate",
        description: "+12% vs last 30 days",
        count:
          carerProfileInfo?.responseRate !== null
            ? carerProfileInfo?.responseRate === 0
              ? "0"
              : carerProfileInfo?.responseRate
            : "N/A",
      },
    ];
  }, [carerProfileInfo]);

  const insuranceDocuments = useMemo(() => {
    return (
      carerProfileInfo?.insuranceDocument?.map((doc) => {
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
          url: doc.documentUrl || "N/A",
          isApproved: doc.isApproved,
        };
      }) || []
    );
  }, [carerProfileInfo]);

  const profile_information: AccordionItem[] = useMemo(() => {
    return [
      {
        title: "Experience",
        type: "text",
        content:
          carerProfileInfo?.experience != null
            ? `${carerProfileInfo.experience} years`
            : "N/A",
      },
      {
        title: "Right to work in UK",
        type: "chip",
        content: carerProfileInfo?.workInUK ? ["Yes"] : ["No"],
      },
      {
        title: "Interests & hobbies",
        type: "chip",
        content: Array.isArray(carerProfileInfo?.interestsHobbit)
          ? carerProfileInfo.interestsHobbit.map((lan) => lan.name)
          : [],
      },
      {
        title: "Household duties",
        type: "chip",
        content: Array.isArray(carerProfileInfo?.householdDuties)
          ? carerProfileInfo.householdDuties.map((lan) => lan.name)
          : [],
      },
      {
        title: "Personal care duties",
        type: "chip",
        content: Array.isArray(carerProfileInfo?.personalDuties)
          ? carerProfileInfo.personalDuties.map((lan) => lan.name)
          : [],
      },
      {
        title: "Languages",
        type: "chip",
        content: Array.isArray(carerProfileInfo?.language)
          ? carerProfileInfo.language.map((lan) => lan.name)
          : [],
      },
      // {
      //   title: "Condition experience",
      //   type: "chip",
      //   content: Array.isArray(carerProfileInfo?.conditionExperience)
      //     ? carerProfileInfo.conditionExperience.map((lan) =>
      //         lan.name ? lan.name : lan
      //       )
      //     : [],
      // },
    ];
  }, [carerProfileInfo]);

  // const bank_details = useMemo(() => {
  //   return [
  //     {
  //       label: "Account Number",
  //       value: carerProfileInfo?.accountNumber || "N/A",
  //     },
  //     {
  //       label: "Sort Code",
  //       value: carerProfileInfo?.sortCode || "N/A",
  //     },
  //     {
  //       label: "Name on Account",
  //       value: carerProfileInfo?.accountName || "N/A",
  //     },
  //   ];
  // }, [carerProfileInfo]);

  // const dbsDocuments = useMemo(() => {
  //   return (
  //     carerProfileInfo?.DBScertificate?.map((doc) => {
  //       if (!doc.documentUrl) return { title: "N/A", url: "N/A" };
  //       const fullPath = doc.documentUrl;
  //       const lastSegment = fullPath.split("/document/").pop() || "";
  //       const match = lastSegment.match(/^(.+?\.[a-zA-Z0-9]{2,5})/);
  //       const cleanFilename = match ? match[1] : lastSegment;
  //       return {
  //         title:
  //           cleanFilename.length > 30
  //             ? cleanFilename.slice(0, 30) + "..."
  //             : cleanFilename,
  //         url: doc.documentUrl || "N/A",
  //       };
  //     }) || []
  //   );
  // }, [carerProfileInfo]);

  // const additionalDocuments = useMemo(() => {
  //   return (
  //     carerProfileInfo?.additionalDocument?.map((doc) => {
  //       if (!doc.documentUrl) return { title: "N/A", url: "N/A" };
  //       const fullPath = doc.documentUrl;
  //       const lastSegment = fullPath.split("/document/").pop() || "";
  //       const match = lastSegment.match(/^(.+?\.[a-zA-Z0-9]{2,5})/);
  //       const cleanFilename = match ? match[1] : lastSegment;
  //       return {
  //         title:
  //           cleanFilename.length > 30
  //             ? cleanFilename.slice(0, 30) + "..."
  //             : cleanFilename,
  //         url: doc.documentUrl || "N/A",
  //       };
  //     }) || []
  //   );
  // }, [carerProfileInfo]);

  // const identificationDocs = useMemo(() => {
  //   const docs = [
  //     {
  //       key: "identificationFrontCard",
  //       url: carerProfileInfo?.identificationFrontCard,
  //       header: "Front of card",
  //     },
  //     {
  //       key: "identificationBack",
  //       url: carerProfileInfo?.identificationBack,
  //       header: "Back of card",
  //     },
  //     {
  //       key: "photo",
  //       url: carerProfileInfo?.photo,
  //       header: "Photo",
  //     },
  //   ];

  //   return docs.map((doc) => {
  //     if (!doc.url) return { title: `${doc.key}: N/A`, url: "N/A" };

  //     const fullPath = doc.url;
  //     const lastSegment = fullPath.split("/identification/").pop() || "";
  //     const match = lastSegment.match(/^(.+?\.[a-zA-Z0-9]{2,5})/);
  //     const cleanFilename = match ? match[1] : lastSegment;

  //     return {
  //       title:
  //         cleanFilename.length > 30
  //           ? `${cleanFilename.slice(0, 30)}...`
  //           : `${cleanFilename}`,
  //       url: doc.url,
  //       header: doc.header,
  //     };
  //   });
  // }, [carerProfileInfo]);

  return isLoading ? (
    <Box
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
      height={"calc(100vh - 300px)"}
    >
      <CircularProgress size={30} />
    </Box>
  ) : (
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
                carerProfileInfo?.profile != "carer/profile" &&
                carerProfileInfo?.profile != null
                  ? `${process.env.NEXT_PUBLIC_ASSETS_URL}/${carerProfileInfo?.profile}`
                  : `/assets/images/profile.jpg`
              }
              alt="user-profile-pic"
              height={60}
              width={60}
              style={{ borderRadius: "50px" }}
            />
            <Typography variant="h6" fontWeight={500}>
              {carerProfileInfo?.fullName}
            </Typography>
          </Stack>
          {isMobile ? (
            <IconButton onClick={(event) => handleActionClick(event)}>
              <MoreVertSharpIcon
                style={{ color: theme.palette.common.black }}
              />
            </IconButton>
          ) : (
            <Stack direction={"row"} alignItems={"center"} spacing={2}>
              <Box>
                <Typography variant="caption" fontWeight={400}>
                  Last Active
                </Typography>
                <Typography component={"p"} variant="caption" fontWeight={500}>
                  {carerProfileInfo?.lastLogin != null
                    ? moment(carerProfileInfo?.lastLogin)
                        .local()
                        .format("Do MMMM YYYY [at] hh:mm A")
                    : "Not logged-in since a while!"}
                </Typography>
              </Box>
              <ActiveStatus isActive={carerProfileInfo?.status === 3}>
                <Typography
                  variant="caption"
                  fontWeight={500}
                  color={
                    carerProfileInfo?.status === 3
                      ? theme.accepted.main
                      : theme.declined.main
                  }
                >
                  {carerProfileInfo?.status === 3 ? "Active" : "InActive"}
                </Typography>
              </ActiveStatus>
              <IconButton onClick={(event) => handleActionClick(event)}>
                <MoreVertSharpIcon
                  style={{ color: theme.palette.common.black }}
                />
              </IconButton>
            </Stack>
          )}
        </Stack>

        {isMobile && (
          <Stack
            direction={"row"}
            alignItems={"center"}
            justifyContent={"space-between"}
            spacing={2}
            mt={2}
          >
            <Box>
              <Typography variant="caption" fontWeight={400}>
                Last Active
              </Typography>
              <Typography component={"p"} variant="caption" fontWeight={500}>
                {carerProfileInfo?.lastLogin != null
                  ? moment(carerProfileInfo?.lastLogin)
                      .local()
                      .format("Do MMMM YYYY [at] hh:mm A")
                  : "Not logged-in since a while!"}
              </Typography>
            </Box>
            <ActiveStatus isActive={carerProfileInfo?.status === 3}>
              <Typography
                variant="caption"
                fontWeight={500}
                color={
                  carerProfileInfo?.status === 3
                    ? theme.accepted.main
                    : theme.declined.main
                }
              >
                {carerProfileInfo?.status === 3 ? "Active" : "InActive"}
              </Typography>
            </ActiveStatus>
          </Stack>
        )}

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
          {(carerProfileInfo?.status === 8 || carerProfileInfo?.status === 1
            ? ["Activate account"]
            : ["Deactive account"]
          ).map((action, index) => (
            <MenuItem
              key={index}
              onClick={() =>
                carerProfileInfo?.status === 8 || carerProfileInfo?.status === 1
                  ? onPauseCarerAccount(params?.id, 3)
                  : handleActionItemClick(index, params?.id)
              }
              sx={{
                color:
                  carerProfileInfo?.status === 8 ||
                  carerProfileInfo?.status === 1
                    ? theme?.palette.common.black
                    : theme.declined.main,
              }}
            >
              {action}
            </MenuItem>
          ))}
        </Menu>

        <Box mt={4} width={"100%"}>
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

      <Box mt={2}>
        <Grid2 container spacing={2}>
          <Grid2 size={{ md: 6 }}>
            <CommonCard>
              <Typography variant="h6" fontWeight={500}>
                Account information
              </Typography>
              <Box mt={2}>
                <Image
                  src={
                    carerProfileInfo?.profile != "carer/profile" &&
                    carerProfileInfo?.profile != null
                      ? `${process.env.NEXT_PUBLIC_ASSETS_URL}/${carerProfileInfo?.profile}`
                      : `/assets/images/profile.jpg`
                  }
                  alt="user-profile-pic"
                  height={182}
                  width={182}
                  style={{ borderRadius: "18px" }}
                />
              </Box>
              <Box mt={2}>
                <KeyValueDetails items={account_informations} />
              </Box>
            </CommonCard>
            <Box mt={3}>
              <PersonalBio
                title="Personal statement"
                description={" "}
                value={
                  carerProfileInfo?.personalStatement != null
                    ? carerProfileInfo?.personalStatement
                    : ""
                }
              />
            </Box>

            {/* <Box mt={2}>
              <VerificationStatus
                status={carerProfileInfo?.isZorbeePayVerified}
                date={carerProfileInfo?.ZorbeePayVerificationDate}
                firstDocument={carerProfileInfo?.identificationFrontCard}
                secondDocument={carerProfileInfo?.identificationBack}
              />
            </Box> */}

            <Box mt={3}>
              <Specalisations
                title="Specalisations"
                specialisations={carerProfileInfo?.medicalSpecialties}
              />
            </Box>
            <Box mt={3}>
              <CardTypeOffered
                careTypeData={carerProfileInfo?.careType}
                rateNegotiable={
                  carerProfileInfo?.rateNegotiable === "true"
                    ? "Yes"
                    : carerProfileInfo?.rateNegotiable === "false"
                    ? "No"
                    : ""
                }
              />
            </Box>

            {/* <Box mt={2}>
              <CommonCard>
                <Typography fontWeight={500} variant="h6">
                  References
                </Typography>
                <Typography variant="caption" fontWeight={400}>
                  These are the carer profiles pending verification. You can
                  check the verification status, as another admin may have
                  already initiated the process.
                </Typography>
                <Box mt={3}>
                  <Box>
                    {carerProfileInfo?.reference?.map((ele, index) => {
                      const items = [
                        { label: "First Name", value: ele.firstName || "N/A" },
                        { label: "Last Name", value: ele.lastName || "N/A" },
                        { label: "Email", value: ele.email || "N/A" },
                        { label: "Contact No", value: ele.contactNo || "N/A" },
                        {
                          label: "Relation",
                          value:
                            ele.referenceRelation != null
                              ? RelationshipType[Number(ele.referenceRelation)]
                              : "N/A",
                        },
                        {
                          label: "Relation Duration",
                          value:
                            ele.referenceRelationDuration != null
                              ? RelationshipDuration[
                                  Number(ele.referenceRelationDuration)
                                ]
                              : "N/A",
                        },
                      ];

                      return (
                        <Box key={index} mb={3}>
                          <Typography fontWeight={500} variant="h6">
                            Reference {index + 1}
                          </Typography>
                          <Box mt={2}>
                            <KeyValueDetails items={items} />
                          </Box>
                        </Box>
                      );
                    })}
                  </Box>
                </Box>
              </CommonCard>
            </Box> */}

            <Box mt={3}>
              <CommonCard>
                <Typography variant="h6" fontWeight={500}>
                  Client and job listings
                </Typography>
                <Typography variant="caption">
                  View a full list of clients, active and completed jobs
                  including details of their current care assignments.
                </Typography>
                <CommonButton
                  buttonText="View all"
                  variant="contained"
                  onClick={() =>
                    navigateWithLoading(
                      `/carers/overview/profile/${params?.id}/client-and-job-listings`
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
              <RecruitmentPassportSection
                dateLabel="Date"
                title="Recruitment passport"
                description="Here is the current status of this Zorbee recruitment passport"
                value={carerProfileInfo?.passport?.rejectionReason || "N/A"}
                status={
                  UserStatus[Number(carerProfileInfo?.passport?.status)] ||
                  "N/A"
                }
                date={
                  carerProfileInfo?.passport?.approvedAt
                    ? carerProfileInfo?.passport?.approvedAt
                    : carerProfileInfo?.passport?.createdAt
                    ? carerProfileInfo?.passport?.createdAt
                    : "N/A"
                }
                onClickBtn={() =>
                  navigateWithLoading(
                    `/carers/recruitment-passport/${carerProfileInfo?.passport?.userId}/view-passport`
                  )
                }
              />
            </Box>

            {/* <Box mt={2}>
              <ActiveJobs
                count={
                  carerProfileInfo?.activeJobs !== null
                    ? carerProfileInfo?.activeJobs?.activeCount === 0
                      ? "0"
                      : carerProfileInfo?.activeJobs?.activeCount
                    : "N/A"
                }
                handleViewAll={() =>
                  navigateWithLoading(
                    `/carers/overview/profile/${params?.id}/active-jobs`
                  )
                }
              />
            </Box>

            <Box mt={2}>
              <CompletedJobs
                count={
                  carerProfileInfo?.completedJobs !== null
                    ? carerProfileInfo?.completedJobs === 0
                      ? "0"
                      : carerProfileInfo?.completedJobs
                    : "N/A"
                }
                handleViewAll={() =>
                  navigateWithLoading(
                    `/carers/overview/profile/${params?.id}/completed-jobs`
                  )
                }
              />
            </Box>

            <Box mt={2}>
              <ClientList
                count={"N/A"}
                onClickViewAllButton={() =>
                  navigateWithLoading(
                    `/carers/overview/profile/${params?.id}/client-list`
                  )
                }
              />
            </Box> */}
          </Grid2>

          <Grid2 size={{ md: 6 }}>
            <ProfileInformation
              heading="Profile Information"
              accordionData={profile_information}
              conditionExperienceGrouped={
                carerProfileInfo?.conditionExperienceGrouped
              }
            />
            {/* <Box mt={3}>
              <Qualifications
                qualifications={carerProfileInfo?.qualifications}
              />
            </Box> */}

            {/* <Box mt={3}>
              <Documentations
                documents={dbsDocuments}
                additionalDocuments={additionalDocuments}
                identificationDocuments={identificationDocs}
                documentType={
                  carerProfileInfo?.documentType
                    ? IdCardType[carerProfileInfo?.documentType]
                    : "N/A"
                }
              />
            </Box> */}
            <Box mt={3}>
              <AvailabilityForProfile
                data={carerProfileInfo?.urgentCareSchedule}
              />
            </Box>

            <Box mt={3}>
              <InsuranceSection
                documents={insuranceDocuments}
                rightToWorkInUK={carerProfileInfo?.workInUK}
                selfEmployeedPosition={carerProfileInfo?.selfEmployed}
                taxReferenceNo={carerProfileInfo?.taxReferenceNo}
                taxNo={carerProfileInfo?.taxNo}
                smoker={carerProfileInfo?.smoker}
                isShowButton={false}
              />
            </Box>

            <Box mt={4}>
              <AssessmentVerificationStatus
                dateLabel="Date"
                title="Ai assessment"
                description=" "
                status={carerProfileInfo?.assessment?.isApproved}
                date={carerProfileInfo?.assessment?.createdAt}
                value={
                  carerProfileInfo?.assessment?.feedBackMessage
                    ? carerProfileInfo?.assessment?.feedBackMessage
                    : ""
                }
                onClickBtn={() =>
                  navigateWithLoading(
                    `/assessment/${carerProfileInfo?.userId}/view-assessment`
                  )
                }
              />
            </Box>

            {/* <Box mt={2}>
              <CommonCard>
                <Typography variant="h6" fontWeight={500}>
                  Payment requests
                </Typography>
                <Box mt={3}>
                  <RequestCard
                    path="/assets/svg/carers/profile/payment_request.svg"
                    title="Agreement#02"
                    subtitle="Client:Reuben Hale"
                    subtitle2="Requested: 15 Jan 2025"
                  />
                </Box>
              </CommonCard>
            </Box> */}

            {/* <Box mt={2}>
              <BankDetails
                descriptions="These details are locked. Unlock them to make changes."
                bank_details={bank_details}
              />
            </Box> */}
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
