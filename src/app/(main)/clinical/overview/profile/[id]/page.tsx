"use client";
import React, { useEffect, useMemo, useState } from "react";
import moment from "moment";
import { toast } from "react-toastify";
import { useParams } from "next/navigation";
import { useMediaQuery, Menu, MenuItem } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import Image from "next/image";
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
import CardTypeOffered from "@/components/carers/profile/CardTypeOffered";
import ProfileInformation from "@/components/carers/profile/Informations";
// import Documentations from "@/components/carers/profile/Documentation";
import PersonalBio from "@/components/carers/profile/PersonalBio";
import Specalisations from "@/components/carers/profile/Specalisations";
import {
  getSingleClinicalInfo,
  removeClinical,
  updateClinical,
} from "@/services/api/clinicalApi";
import { ClinicalProfileResponse } from "@/types/clinicalProfileTypes";
import { useRouterLoading } from "@/hooks/useRouterLoading";
import InsuranceSection from "@/components/carers/profile/InsuranceSection";
import AvailabilityForProfile from "@/components/carers/profile/AvailabilityForProfile";
import AssessmentVerificationStatus from "@/components/AssessmentVerificationStatus";
import ReasonForDeclineModal from "@/components/carers/profile/ReasonForDeclineModal";
// import { IdCardType } from "@/constants/carersData";
import CommonButton from "@/components/CommonButton";

interface ActiveStatusProps {
  isActive?: boolean;
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
    : theme.declined.background.secondary,
  borderRadius: "8px",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
}));

interface AccordionItem {
  title: string;
  type: "text" | "chip";
  content: string | string[];
}

interface ParamsProps {
  id: string;
}

interface RemoveClinicalResponse {
  data: {
    success: boolean;
    message: string;
  };
}

const Profile: React.FC = () => {
  const { navigateWithLoading } = useRouterLoading();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const params = useParams() as unknown as ParamsProps;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [userInfo, setUserInfo] = useState<
    ClinicalProfileResponse["data"]["data"] | null
  >(null);
  const [isreasonModalOpen, setIsReasonModalOpen] = useState<boolean>(false);
  const [deactivateID, setDeactivateID] = useState<string | null>(null);

  const onCloseReasonModal = () => {
    setIsReasonModalOpen(false);
  };

  useEffect(() => {
    if (params?.id) {
      fetchClinicalProfile(params?.id);
    }
  }, [params?.id]);

  const fetchClinicalProfile = async (id: string) => {
    try {
      const response = (await getSingleClinicalInfo(
        id
      )) as ClinicalProfileResponse;
      if (response?.data?.success) {
        setUserInfo(response?.data?.data);
        localStorage.setItem(
          "SelectedClinical",
          JSON.stringify(response?.data?.data)
        );
      }
    } catch (e) {
      console.log(e);
    }
  };
  const onClickSaveBtnInModal = (value: string) => {
    console.log(value, "value ==>");
    onPauseCarerAccount(deactivateID, 8, value);
  };

  const data = useMemo(() => {
    return [
      {
        icon: "/assets/svg/dashboard/users.svg",
        title: "Rating",
        description: "+12% vs last 30 days",
        count:
          userInfo?.rating !== null && userInfo?.rating !== undefined
            ? userInfo.rating === 0
              ? "0"
              : userInfo.rating
            : "N/A",
      },
      {
        icon: "/assets/svg/dashboard/hospital.svg",
        title: "Active jobs",
        description: "+12% vs last 30 days",
        count:
          userInfo?.activeJobs?.activeCount !== null &&
          userInfo?.activeJobs?.activeCount !== undefined
            ? userInfo.activeJobs?.activeCount === 0
              ? "0"
              : userInfo.activeJobs?.activeCount
            : "N/A",
      },
      {
        icon: "/assets/svg/dashboard/hospital.svg",
        title: "Completed jobs",
        description: "+12% vs last 30 days",
        count:
          userInfo?.completedJobs !== null &&
          userInfo?.completedJobs !== undefined
            ? userInfo.completedJobs === 0
              ? "0"
              : userInfo.completedJobs
            : "N/A",
      },
      {
        icon: "/assets/svg/dashboard/currency.svg",
        title: "Response rate",
        description: "+12% vs last 30 days",
        count:
          userInfo?.responseRate !== null &&
          userInfo?.responseRate !== undefined
            ? userInfo.responseRate === 0
              ? "0%"
              : `${userInfo.responseRate}%`
            : "N/A",
      },
    ];
  }, [userInfo]);

  const account_informations = useMemo(() => {
    // const addressParts = [
    //   userInfo?.houseNo,
    //   userInfo?.address,
    //   userInfo?.country,
    //   userInfo?.postCode,
    // ].filter((part) => part && part.trim() !== "");

    // const address = addressParts.length > 0 ? addressParts.join(", ") : "N/A";
    // if (!userInfo) return [];

    return [
      // {
      //   label: "Title",
      //   value:
      //     userInfo?.gender?.[0] === 1
      //       ? "Mr"
      //       : userInfo?.gender?.[0] === 2
      //       ? "Ms / Mrs"
      //       : "N/A",
      // },
      {
        label: "Name",
        value: userInfo?.fullName || "N/A",
      },
      {
        label: "Date of birth",
        value:
          moment(userInfo?.dob, "DD-MM-YYYY").format("Do MMMM YYYY") || "N/A",
      },
      {
        label: "Mobile Number",
        value: userInfo?.mobileNumber || "N/A",
      },
      {
        label: "Gender",
        value:
          userInfo?.gender?.[0] === 1
            ? "Male"
            : userInfo?.gender?.[0] === 2
            ? "Female"
            : "Others",
      },
      {
        label: "Address line 1",
        value: userInfo?.address || "N/A",
      },
      {
        label: "House name/no",
        value: userInfo?.houseNo || "N/A",
      },
      {
        label: "Post code",
        value: userInfo?.postCode || "N/A",
      },
      {
        label: "Country",
        value: userInfo?.country || "N/A",
      },
    ];
  }, [userInfo]);

  // const dbsDocuments = useMemo(() => {
  //   return (
  //     userInfo?.DBScertificate?.map((doc) => {
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
  // }, [userInfo]);

  const insuranceDocuments = useMemo(() => {
    return (
      userInfo?.insuranceDocument?.map((doc) => {
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
  }, [userInfo]);

  // const additionalDocuments = useMemo(() => {
  //   return (
  //     userInfo?.additionalDocument?.map((doc) => {
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
  // }, [userInfo]);

  const profileData: AccordionItem[] = useMemo(() => {
    if (!userInfo) return [];
    return [
      {
        title: "Experience",
        type: "text",
        content: userInfo?.experience
          ? `${userInfo?.experience} years`
          : "0 years",
      },
      {
        title: "Right to work in UK",
        type: "chip",
        content: userInfo?.workInUK ? ["Yes"] : ["No"],
      },
      {
        title: "Interests & hobbies",
        type: "chip",
        content:
          userInfo?.interestsHobbit && Array.isArray(userInfo.interestsHobbit)
            ? userInfo.interestsHobbit.map((duty) => duty.name)
            : [],
      },
      // {
      //   title: "Household duties",
      //   type: "chip",
      //   content: Array.isArray(userInfo?.householdDuties)
      //     ? userInfo.householdDuties.map((lan) => lan.name)
      //     : [],
      // },
      // {
      //   title: "Personal care duties",
      //   type: "chip",
      //   content: Array.isArray(userInfo?.personalDuties)
      //     ? userInfo.personalDuties.map((lan) => lan.name)
      //     : [],
      // },
      {
        title: "Clinical duties",
        type: "chip",
        content: Array.isArray(userInfo?.clinicalDuties)
          ? userInfo.clinicalDuties.map((lan) => lan.name)
          : [],
      },
      {
        title: "Specialities",
        type: "chip",
        content: Array.isArray(userInfo?.medicalSpecialties)
          ? userInfo.medicalSpecialties.map((lan) => lan.name)
          : [],
      },
      {
        title: "Languages",
        type: "chip",
        content: Array.isArray(userInfo?.language)
          ? userInfo.language.map((lan) => lan.name)
          : [],
      },
    ];
  }, [userInfo]);

  // const identificationDocs = useMemo(() => {
  //   const docs = [
  //     {
  //       key: "identificationFrontCard",
  //       url: userInfo?.identificationFrontCard,
  //       header: "Front of card",
  //     },
  //     {
  //       key: "identificationBack",
  //       url: userInfo?.identificationBack,
  //       header: "Back of card",
  //     },
  //     {
  //       key: "photo",
  //       url: userInfo?.photo,
  //       header: "Photo",
  //     },
  //   ];

  //   return docs
  //     .filter((doc) => !!doc.url)
  //     .map((doc) => {
  //       if (!doc.url) return { title: `N/A`, url: "N/A" };

  //       const fullPath = doc.url;
  //       const lastSegment = fullPath.split("/identification/").pop() || "";
  //       const match = lastSegment.match(/^(.+?\.[a-zA-Z0-9]{2,5})/);
  //       const cleanFilename = match ? match[1] : lastSegment;

  //       return {
  //         title:
  //           cleanFilename.length > 30
  //             ? `${cleanFilename.slice(0, 30)}...`
  //             : `${cleanFilename}`,
  //         url: doc.url,
  //         header: doc.header,
  //       };
  //     });
  // }, [userInfo]);

  const handleActionClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
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
      const response = (await updateClinical(
        id,
        payload
      )) as RemoveClinicalResponse;
      if (response?.data?.success) {
        setDeactivateID(null);
        setIsReasonModalOpen(false);
        toast.success(response?.data?.message);
        fetchClinicalProfile(params?.id);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const onRemoveCarerAccount = async (id: string) => {
    try {
      const response = (await removeClinical(id)) as RemoveClinicalResponse;
      if (response?.data?.success) {
        fetchClinicalProfile(params?.id);
        toast.success(response?.data?.message);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
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
                userInfo?.profile != "Clinicial/profile" &&
                userInfo?.profile != null
                  ? `${process.env.NEXT_PUBLIC_ASSETS_URL}/${userInfo?.profile}`
                  : `/assets/images/profile.jpg`
              }
              alt="user-profile-pic"
              height={60}
              width={60}
              style={{ borderRadius: "50px" }}
            />
            <Typography variant="h6" fontWeight={500}>
              {userInfo?.fullName}
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
              <Box textAlign={"right"}>
                <Typography variant="caption" fontWeight={400}>
                  Last active
                </Typography>
                <Typography component={"p"} variant="caption" fontWeight={500}>
                  {userInfo?.lastLogin != null
                    ? moment(userInfo?.lastLogin)
                        .local()
                        .format("Do MMMM YYYY [at] hh:mm A")
                    : "Not logged-in since a while!"}
                </Typography>
              </Box>
              <ActiveStatus isActive={userInfo?.isActive}>
                <Typography
                  variant="caption"
                  fontWeight={500}
                  color={
                    userInfo?.isActive
                      ? theme.accepted.main
                      : theme.declined.main
                  }
                >
                  {userInfo?.isActive ? "Active" : "InActive"}
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
            mt={1}
            direction={"row"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Box>
              <Typography variant="caption" fontWeight={400}>
                Last active
              </Typography>
              <Typography component={"p"} variant="caption" fontWeight={500}>
                {userInfo?.lastLogin != null
                  ? moment(userInfo?.lastLogin)
                      .local()
                      .format("Do MMMM YYYY [at] hh:mm A")
                  : "Not logged-in since a while!"}
              </Typography>
            </Box>
            <ActiveStatus isActive={userInfo?.isActive}>
              <Typography
                variant="caption"
                fontWeight={500}
                color={
                  userInfo?.isActive ? theme.accepted.main : theme.declined.main
                }
              >
                {userInfo?.isActive ? "Active" : "InActive"}
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
          {(userInfo?.status === 8 || userInfo?.status === 1
            ? ["Activate account"]
            : ["Deactive account"]
          ).map((action, index) => (
            <MenuItem
              key={index}
              sx={{
                color:
                  userInfo?.status === 8 || userInfo?.status === 1
                    ? theme?.palette.common.black
                    : theme.declined.main,
              }}
              onClick={() =>
                userInfo?.status === 8 || userInfo?.status === 1
                  ? onPauseCarerAccount(params?.id, 3)
                  : handleActionItemClick(index, params?.id)
              }
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

      <Box>
        <Grid2 container spacing={2}>
          <Grid2 size={{ md: 6, lg: 6, xl: 6, sm: 12, xs: 12 }}>
            <Box mt={4}>
              <CommonCard>
                <Typography variant="h6" fontWeight={500}>
                  Account information
                </Typography>
                <Box mt={2}>
                  <Image
                    src={
                      userInfo?.profile != "carer/profile" &&
                      userInfo?.profile != null
                        ? `${process.env.NEXT_PUBLIC_ASSETS_URL}/${userInfo?.profile}`
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
            </Box>

            <Box mt={4}>
              <PersonalBio
                title={"Personal statement"}
                description={" "}
                value={
                  userInfo?.personalStatement != null
                    ? userInfo?.personalStatement
                    : ""
                }
              />
            </Box>

            <Box mt={4}>
              <Specalisations
                title="Specalisations"
                specialisations={userInfo?.medicalSpecialties}
              />
            </Box>
            <Box mt={4}>
              <CardTypeOffered careTypeData={userInfo?.careType} />
            </Box>

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
                      `/clinical/overview/profile/${params?.id}/client-and-job-listings`
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
          </Grid2>

          <Grid2 size={{ md: 6, lg: 6, xl: 6, sm: 12, xs: 12 }}>
            <Box mt={4}>
              <ProfileInformation
                heading="Profile Information"
                accordionData={profileData}
                // conditionExperienceGrouped={
                //   userInfo?.conditionExperienceGrouped
                // }
              />
            </Box>

            <Box mt={3}>
              <AvailabilityForProfile data={userInfo?.hourlyCareSchedule} />
            </Box>

            <Box mt={3}>
              <InsuranceSection
                documents={insuranceDocuments}
                rightToWorkInUK={userInfo?.workInUK}
                selfEmployeedPosition={userInfo?.selfEmployed}
                taxReferenceNo={userInfo?.taxReferenceNo}
                taxNo={userInfo?.taxNo}
                smoker={userInfo?.smoker}
                isShowButton={false}
              />
            </Box>

            {/* <Box mt={4}>
              <Documentations
                documents={dbsDocuments}
                additionalDocuments={additionalDocuments}
                identificationDocuments={identificationDocs}
                documentType={
                  userInfo?.documentType
                    ? IdCardType[userInfo?.documentType]
                    : "N/A"
                }
              />
            </Box> */}

            <Box mt={4}>
              <AssessmentVerificationStatus
                dateLabel="Date"
                title="Ai assessment"
                description=" "
                status={userInfo?.assessment?.isApproved}
                date={userInfo?.assessment?.createdAt}
                value={
                  userInfo?.assessment?.feedBackMessage
                    ? userInfo?.assessment?.feedBackMessage
                    : ""
                }
                onClickBtn={() =>
                  navigateWithLoading(
                    `/assessment/${userInfo?.userId}/view-assessment`
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
