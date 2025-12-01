"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import Image from "next/image";
import moment from "moment";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Typography from "@mui/material/Typography";
import Grid2 from "@mui/material/Grid2";
import { styled, useTheme } from "@mui/material/styles";
//relative path imports
import CommonCard from "@/components/Cards/Common";
import ApproveButton from "@/components/carers/profile/ApproveButton";
import KeyValueDetails from "@/components/Cards/KeyValueDetails";
// import Specalisations from "@/components/carers/profile/Specalisations";
// import CommonNoteCard from "@/components/CommonNoteCard";
// import TeamMemberCard from "@/components/TeamMemberCard";
// import Documentation from "@/components/carers/Documentation";
// import ApprovalListItem from "@/components/carers/profile/ApprovalListItem";
import { ProviderProfileResponse } from "@/types/providerProfileTypes";
import {
  ApprovalProfileDetails,
  // getProviderTeamMemberList,
  getSingleProviderInfo,
  masterApprovalProfileDetails,
} from "@/services/api/providerApi";
import {
  // UserStatus,
  TeamMemberJobStatus,
  // MemberAccessEnum,
  ProviderCateogry,
} from "@/constants/providerData";
import AssessmentVerificationStatus from "@/components/AssessmentVerificationStatus";
import { useRouterLoading } from "@/hooks/useRouterLoading";
import { Divider } from "@mui/material";
import CommonIconText from "@/components/CommonIconText";
import CommonButton from "@/components/CommonButton";
import ReasonForDeclineModal from "@/components/carers/profile/ReasonForDeclineModal";

interface ParamsProps {
  id: string;
}

interface ApprovalProfileResponse {
  data: {
    success: boolean;
    message: string;
  };
}

interface masterApprovalProfileResponse {
  data: {
    success: boolean;
    message: string;
  };
}

// interface TeamMemberListResponse {
//   data: {
//     success: boolean;
//     message: string;
//     data: {
//       businessName: string | null;
//       teamMembers: TeamMembersListData[];
//       meta: {
//         totalDocs: number;
//       };
//     };
//   };
// }

// interface TeamMembersListData {
//   id: number;
//   userId: string | null;
//   memberName: string | null;
//   memberEmail: string | null;
//   jobRole: number | null;
//   access: string | null;
//   isMemberActive: boolean;
// }

const StyledBox = styled(Box)(({ theme }) => ({
  border: `1px solid ${theme.pending.secondary}`,
  padding: "10px 20px",
  borderRadius: "10px",
  display: "flex",
  alignItems: "center",
  minHeight: "47px",
}));

const Profile: React.FC = () => {
  const { navigateWithLoading } = useRouterLoading();
  const theme = useTheme();
  const params = useParams() as unknown as ParamsProps;
  const [imageSrc, setImageSrc] = useState("");
  const [providerProfileInfo, setProviderInfo] = useState<
    ProviderProfileResponse["data"]["data"] | null
  >(null);
  // const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  // const [teamMembersData, setTeamMembersData] = useState<TeamMembersListData[]>(
  //   []
  // );
  const [isreasonModalOpen, setIsReasonModalOpen] = useState<boolean>(false);

  const onCloseReasonModal = () => {
    setIsReasonModalOpen(false);
  };
  // console.log(teamMembersData, "teamMembersData ==>");

  // const handleActionClick = (event: React.MouseEvent<HTMLButtonElement>) => {
  //   setAnchorEl(event.currentTarget);
  // };

  // const handleMenuItemClick = (index: number) => {
  //   masterApprovalProfileData(params?.id, index);
  // };

  const onClickSaveBtnInModal = (value: string) => {
    // console.log(value, "value");
    masterApprovalProfileData(params?.id, 1, value);
  };

  const masterApprovalProfileData = async (
    id: string,
    index: number,
    notes?: string
  ) => {
    try {
      const payload = {
        accountStatus: index === 0 ? 3 : 6,
        ...(notes && { notes: notes }),
      };

      const response = (await masterApprovalProfileDetails(
        id,
        payload
      )) as masterApprovalProfileResponse;
      if (response?.data?.success) {
        setIsReasonModalOpen(false);
        toast.success(response?.data?.message);
        toast.success(response?.data?.message);
        fetchSingleProfile(params?.id);
        // fetchTeamMemberList(params?.id);
      }
    } catch (e) {
      console.log(e);
    }
    setIsReasonModalOpen(false);
  };

  // const handleClose = () => {
  //   setAnchorEl(null);
  // };

  useEffect(() => {
    if (params?.id) {
      fetchSingleProfile(params?.id);
      // fetchTeamMemberList(params?.id);
    }
  }, [params?.id]);

  const fetchSingleProfile = async (id: string) => {
    try {
      const response = (await getSingleProviderInfo(
        id
      )) as ProviderProfileResponse;
      if (response?.data?.success) {
        setProviderInfo(response?.data?.data);
        setImageSrc(
          response?.data?.data?.businessLogo !== "provider2/logo" &&
            response?.data?.data?.businessLogo != null
            ? `${process.env.NEXT_PUBLIC_ASSETS_URL}/${response?.data?.data?.businessLogo}`
            : ""
        );
      }
    } catch (e) {
      console.log(e);
    }
  };

  // const fetchTeamMemberList = async (id: string) => {
  //   try {
  //     const response = (await getProviderTeamMemberList(
  //       id
  //     )) as TeamMemberListResponse;
  //     if (response?.data?.success) {
  //       setTeamMembersData(response?.data?.data?.teamMembers);
  //     }
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  const handleApprovalprofileDetails = async (
    id: string,
    key: string,
    documentIndex: number,
    action?: string
  ) => {
    try {
      const payload = {
        documentType: key,
        documentIndex: documentIndex,
        action: action,
      };
      const response = (await ApprovalProfileDetails(
        id,
        payload
      )) as ApprovalProfileResponse;
      if (response?.data?.success) {
        toast.success(response?.data?.message);
        fetchSingleProfile(params?.id);
      }
    } catch (e) {
      console.log(e);
    }
  };

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
      {/* <CommonCard>
        <ApprovalListItem
          profilePic={imageSrc || "/assets/images/Rectangle.jpg"}
          profileName={
            providerProfileInfo?.fullName
              ? providerProfileInfo?.fullName
              : "N/A"
          }
          dateTitle={"Date joined"}
          date={moment(providerProfileInfo?.createdAt).format("Do MMMM YYYY")}
          approvalTitle={
            typeof providerProfileInfo?.status === "number"
              ? UserStatus[providerProfileInfo.status as UserStatus]
              : "N/A"
          }
          approvalVariant={"default"}
          isApproval={true}
          handleMenuItemClick={(index) => handleMenuItemClick(index)}
          handleActionClick={handleActionClick}
          handleClose={handleClose}
          anchorEl={anchorEl}
        />
      </CommonCard> */}

      <CommonCard>
        <Stack
          flexDirection={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Box>
            <Typography variant="body1" fontWeight={500}>
              Verification
            </Typography>
            <Typography variant="caption">
              This prvoider profile needs a review
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              gap: 2,
            }}
          >
            {providerProfileInfo?.status === 6 ? (
              <CommonButton
                buttonText="Declined"
                sx={{
                  height: "45px",
                  backgroundColor: theme.declined.background.primary,
                  fontSize: 500,
                  cursor: "auto",
                }}
                buttonTextStyle={{
                  fontSize: "14px",
                  whiteSpace: "nowrap",
                  paddingInline: "10px",
                  color: theme.declined.main,
                }}
              />
            ) : (
              <CommonButton
                buttonText="Decline"
                sx={{ height: "45px", backgroundColor: "#F1F3F5" }}
                buttonTextStyle={{ fontSize: "14px" }}
                onClick={() => setIsReasonModalOpen(true)}
              />
            )}
            {providerProfileInfo?.status === 3 ? (
              <CommonButton
                buttonText="Verified"
                sx={{
                  height: "45px",
                  backgroundColor: theme.accepted.background.primary,
                  fontSize: 500,
                  cursor: "auto",
                }}
                buttonTextStyle={{
                  fontSize: "14px",
                  whiteSpace: "nowrap",
                  paddingInline: "10px",
                  color: theme.accepted.main,
                }}
              />
            ) : (
              <CommonButton
                buttonText="Mark as verified"
                sx={{ height: "45px" }}
                buttonTextStyle={{
                  fontSize: "14px",
                  whiteSpace: "nowrap",
                  paddingInline: "10px",
                }}
                onClick={() => masterApprovalProfileData(params?.id, 0)}
              />
            )}
          </Box>
        </Stack>
      </CommonCard>

      <Box>
        <Grid2 container spacing={2}>
          <Grid2 size={{ md: 6, sm: 12, xs: 12, lg: 6, xl: 6 }}>
            <Box mt={4}>
              <CommonCard>
                <Typography variant="h6" fontWeight={500}>
                  Provider information
                </Typography>

                <Box mt={3}>
                  <Image
                    src={imageSrc || "/assets/images/Rectangle.jpg"}
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
                {/* <Box mt={2} sx={{ display: "flex", gap: 2 }}>
                  {providerProfileInfo?.isProfileInfoApproved === null && (
                    <CommonButton
                      buttonText="Pending verification"
                      sx={{
                        cursor: "default",
                        width: "max-content",
                        height: "30px",
                        backgroundColor: theme.declined.background.primary,
                      }}
                      buttonTextStyle={{
                        color: theme.declined.main,
                        fontSize: "12px",
                      }}
                      startIcon={
                        <InfoOutlinedIcon
                          fontSize="small"
                          sx={{ color: theme.declined.main }}
                        />
                      }
                    />
                  )}
                  {providerProfileInfo?.isProfileInfoApproved === false ||
                  providerProfileInfo?.isProfileInfoApproved === null ? (
                    <ApproveButton
                      sx={{
                        backgroundColor: theme.pending.main,
                        border: "none",
                      }}
                      onClick={() =>
                        handleApprovalprofileDetails(
                          params?.id,
                          "profileInfo",
                          0,
                          "approve"
                        )
                      }
                    />
                  ) : (
                    <ApproveButton
                      title="Approved"
                      sx={{
                        cursor: "default",
                        backgroundColor: "#C8E4C0",
                      }}
                      buttonTextStyleSx={{ color: "#6A9F69" }}
                    />
                  )}
                  {providerProfileInfo?.isProfileInfoApproved === true ||
                  providerProfileInfo?.isProfileInfoApproved === null ? (
                    <ApproveButton
                      title="Decline"
                      onClick={() =>
                        handleApprovalprofileDetails(
                          params?.id,
                          "profileInfo",
                          0,
                          "reject"
                        )
                      }
                    />
                  ) : (
                    <ApproveButton
                      title="Declined"
                      sx={{
                        cursor: "default",
                        backgroundColor: "#F4A6A6",
                      }}
                      buttonTextStyleSx={{ color: "#9C3C3C" }}
                    />
                  )}
                </Box> */}
              </CommonCard>
            </Box>

            {/* <Box mt={4}>
              <Specalisations
                title="Services"
                specialisations={providerProfileInfo?.services}
                isApproveButton={
                  providerProfileInfo?.isServicesApproved === true
                    ? true
                    : false
                }
                showButtons={true}
                onApprovalClick={() =>
                  handleApprovalprofileDetails(
                    params?.id,
                    "service",
                    0,
                    "approve"
                  )
                }
                isRejectButton={
                  providerProfileInfo?.isServicesApproved === false
                    ? true
                    : false
                }
                onRejectClick={() =>
                  handleApprovalprofileDetails(
                    params?.id,
                    "service",
                    0,
                    "reject"
                  )
                }
              />
            </Box> */}

            {/* <Box mt={4}>
              <CommonCard>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="h6" fontWeight={500}>
                    Team members
                  </Typography>
                  {teamMembersData.length > 0 && (
                    <Button
                      variant="text"
                      onClick={() =>
                        navigateWithLoading(
                          `/providers/verifications/profile/${params?.id}/team-members`
                        )
                      }
                      sx={{ color: "black" }}
                    >
                      View all
                    </Button>
                  )}
                </Box>
                {teamMembersData.slice(0, 2).map((team, index) => {
                  return (
                    <Box key={index}>
                      <TeamMemberCard
                        name={team?.memberName ? team?.memberName : "n/A"}
                        jobRole={
                          typeof team?.jobRole === "number"
                            ? TeamMemberJobStatus[
                                team?.jobRole as TeamMemberJobStatus
                              ]
                            : "N/A"
                        }
                        email={team?.memberEmail ? team?.memberEmail : "n/A"}
                        status={team?.isMemberActive ? "Active" : "Inactive"}
                        permission={
                          typeof team?.access === "number"
                            ? MemberAccessEnum[team?.access as MemberAccessEnum]
                            : "N/A"
                        }
                      />
                    </Box>
                  );
                })}
              </CommonCard>
            </Box> */}
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
                      <Box mt={2} sx={{ display: "flex", gap: 2 }}>
                        {doc?.isApproved === null && (
                          <CommonButton
                            buttonText="Pending verification"
                            sx={{
                              cursor: "default",
                              width: "max-content",
                              height: "30px",
                              backgroundColor:
                                theme.declined.background.primary,
                            }}
                            buttonTextStyle={{
                              color: theme.declined.main,
                              fontSize: "12px",
                            }}
                            startIcon={
                              <InfoOutlinedIcon
                                fontSize="small"
                                sx={{ color: theme.declined.main }}
                              />
                            }
                          />
                        )}
                        {doc?.isApproved === false ||
                        doc?.isApproved === null ? (
                          <ApproveButton
                            sx={{
                              backgroundColor: theme.pending.main,
                              border: "none",
                            }}
                            onClick={() =>
                              handleApprovalprofileDetails(
                                params?.id,
                                "cqcDocument",
                                index,
                                "approve"
                              )
                            }
                          />
                        ) : (
                          <ApproveButton
                            title="Approved"
                            sx={{
                              cursor: "default",
                              backgroundColor:
                                theme.accepted.background.primary,
                              borderColor: theme.accepted.main,
                            }}
                            buttonTextStyleSx={{ color: theme.accepted.main }}
                          />
                        )}
                        {doc?.isApproved === true ||
                        doc?.isApproved === null ? (
                          <ApproveButton
                            title="Decline"
                            onClick={() =>
                              handleApprovalprofileDetails(
                                params?.id,
                                "cqcDocument",
                                index,
                                "reject"
                              )
                            }
                          />
                        ) : (
                          <ApproveButton
                            title="Declined"
                            sx={{
                              cursor: "default",
                              backgroundColor:
                                theme.declined.background.primary,
                              borderColor: theme.declined.main,
                            }}
                            buttonTextStyleSx={{ color: theme.declined.main }}
                          />
                        )}
                      </Box>
                    </Box>
                  ))}
                </Box>
                {/* <Documentation Documentations={cqc_documents} /> */}
              </CommonCard>
            </Box>

            <Box mt={4}>
              <AssessmentVerificationStatus
                status={providerProfileInfo?.assessment?.isApproved}
                date={providerProfileInfo?.assessment?.updatedAt}
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
        title={"Reason for decline"}
        description={"Reason why this account was declined"}
        placeholder="State reason..."
      />
    </Box>
  );
};

export default Profile;
