"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import moment from "moment";
import Image from "next/image";
import { toast } from "react-toastify";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Grid2 from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import { CircularProgress, useMediaQuery } from "@mui/material";
import CommonCard from "@/components/Cards/Common";
import CommonButton from "@/components/CommonButton";
import KeyValueDetails from "@/components/Cards/KeyValueDetails";
import ApproveButton from "@/components/carers/profile/ApproveButton";
// import Documentations from "@/components/carers/profile/Documentation";
import Availability from "@/components/carers/profile/Availability";
// import IdentityVerificationStatus from "@/components/carers/profile/IdentityVerificationStatus";
import Insurances from "@/components/carers/profile/Insurance";
import {
  RelationshipDuration,
  RelationshipType,
} from "@/constants/clinicalData";
import RecruitmentPassportProfileInformation from "@/components/carers/profile/ProfileInformation";
import RecruitmentPassport from "@/components/carers/profile/RecruitmentPassport";
import ReasonForDeclineModal from "@/components/carers/profile/ReasonForDeclineModal";
import {
  getViewPassportData,
  PassportMasterApproval,
} from "@/services/api/carerApi";
import {
  ApprovalProfileResponse,
  PassportDetails,
  ViewPassportResponse,
} from "@/types/recruitmentPassportType";
import { WorkingStatus } from "@/constants/carersData";

interface ParamsProps {
  id: string;
}

const ViewPassport: React.FC = () => {
  const theme = useTheme();
  const params = useParams() as unknown as ParamsProps;
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [loading, setLoading] = useState<boolean>(false);
  const [passportData, setPassportData] = useState<PassportDetails | null>(
    null
  );
  const [isreasonModalOpen, setIsReasonModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (params?.id) {
      getSinglePassportData(params?.id);
    }
  }, [params?.id]);

  const getSinglePassportData = async (passportId: string) => {
    try {
      setLoading(true);
      const response = (await getViewPassportData({
        userId: passportId,
      })) as ViewPassportResponse;
      if (response?.data?.success) {
        // console.log(response?.data?.data, "response?.data?.dat a ===>");
        setPassportData(response?.data?.data);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const account_informations = useMemo(() => {
    const addressParts = [
      passportData?.houseNo,
      passportData?.address,
      passportData?.country,
      passportData?.postCode,
    ].filter((part) => part && part.trim() !== "");

    const address = addressParts.length > 0 ? addressParts.join(", ") : "N/A";

    return [
      {
        label: "Name",
        value:
          passportData?.userInfo?.firstName +
            " " +
            passportData?.userInfo?.lastName || "N/A",
      },
      {
        label: "Date of birth",
        value:
          moment(passportData?.dob, "DD-MM-YYYY").format("Do MMMM YYYY") ||
          "N/A",
      },
      {
        label: "Gender",
        value:
          passportData?.userInfo?.gender?.[0] === 1
            ? "Male"
            : passportData?.userInfo?.gender?.[0] === 2
            ? "Female"
            : "N/A",
      },
      {
        label: "Email Address",
        value: passportData?.userInfo?.email || "N/A",
      },
      {
        label: "Contact Number",
        value: passportData?.userInfo?.mobileNumber || "N/A",
      },
      {
        label: "Home Address",
        value: address || "N/A",
      },
    ];
  }, [passportData]);

  // const dbsDocuments = useMemo(() => {
  //   return (
  //     passportData?.DBScertificate?.map((doc) => {
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
  //         expiryDate: doc?.expiryDate
  //           ? moment(doc?.expiryDate).format("DD.MM.YYYY")
  //           : "N/A",
  //         isApproved: doc.isApproved,
  //       };
  //     }) || []
  //   );
  // }, [passportData]);

  const insurances = useMemo(() => {
    if (!passportData?.insuranceDocument) return [];
    return (
      passportData?.insuranceDocument?.map((doc) => {
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
          expiryDate: doc?.expiryDate
            ? moment(doc.expiryDate).format("DD.MM.YYYY")
            : "N/A",
          isApproved: doc.isApproved,
        };
      }) || []
    );
  }, [passportData]);

  const additionalDocuments = useMemo(() => {
    return (
      passportData?.additionalDocument?.map((doc) => {
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
  }, [passportData]);

  const onClickSave = () => {
    if (passportData?.passportInfo?._id) {
      passportMasterApprovalDetails(passportData?.passportInfo?._id, 3);
    }
  };

  const passportMasterApprovalDetails = async (
    passportId: string,
    status: number,
    reason?: string
  ) => {
    try {
      const payload = {
        status: status,
        ...(reason ? { rejectionReason: reason } : {}),
      };
      const response = (await PassportMasterApproval(
        passportId,
        payload
      )) as ApprovalProfileResponse;
      if (response?.data?.success) {
        toast.success(response?.data?.message);
        getSinglePassportData(params?.id);
      }
    } catch (e) {
      console.log(e);
    }
  };

  // const handleApprovalprofileDetails = async (
  //   id: string,
  //   key: string,
  //   documentIndex: number,
  //   action: string
  // ) => {
  //   console.log(id, key, documentIndex, action, "handleApproveProfileDetails");
  //   //   try {
  //   //     const payload = {
  //   //       documentType: key,
  //   //       documentIndex: documentIndex,
  //   //       action: action,
  //   //     };
  //   //     const response = (await ApprovalCarerProfileDetails(
  //   //       id,
  //   //       payload
  //   //     )) as ApprovalProfileResponse;
  //   //     if (response?.data?.success) {
  //   //       toast.success(response?.data?.message);
  //   //       fetchCarerProfile(params?.id);
  //   //     }
  //   //   } catch (e) {
  //   //     console.log(e);
  //   //   }
  // };

  const onCloseReasonModal = () => {
    setIsReasonModalOpen(false);
  };

  const onClickSaveBtnInModal = (value: string) => {
    if (passportData?.passportInfo?._id) {
      passportMasterApprovalDetails(passportData?.passportInfo?._id, 4, value);
    }
    setIsReasonModalOpen(false);
  };

  const isApproveDisabled = useMemo(() => {
    if (!passportData) return true;

    // const hasUnapprovedDBS =
    //   passportData.DBScertificate?.some((doc) => !doc.isApproved) ?? true;

    const hasUnapprovedAdditional =
      passportData.additionalDocument?.some((doc) => !doc.isApproved) ?? true;

    const hasUnapprovedInsurance =
      passportData.insuranceDocument?.some((doc) => !doc.isApproved) ?? true;

    const hasUnapprovedReferences =
      passportData.references?.some((ref) => ref.isRequestAccepted !== true) ??
      true;

    // const idNotApproved =
    //   !passportData.isIdBackApproved || !passportData.isIdFrontApproved;

    return (
      hasUnapprovedInsurance ||
      hasUnapprovedAdditional ||
      hasUnapprovedReferences
      // || idNotApproved
    );
  }, [passportData]);

  return loading ? (
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
          direction={isMobile ? "column" : "row"}
          alignItems={isMobile ? "flex-start" : "center"}
          justifyContent={"space-between"}
          spacing={isMobile ? 2 : 0}
        >
          <Box>
            <Typography variant="h6" fontWeight={500}>
              Recruitment application
            </Typography>
            <Typography variant="caption" fontWeight={400}>
              Review and manage candidate submissions
            </Typography>
          </Box>
          <Stack
            direction={isMobile ? "column" : "row"}
            alignItems={isMobile ? "flex-start" : "center"}
            spacing={2}
          >
            {passportData?.passportInfo?.status === 4 ? (
              <CommonButton
                buttonText="Declined"
                sx={{
                  maxWidth: isMobile ? "100%" : "max-content",
                  backgroundColor: theme?.declined?.background?.primary,
                  border: `1px solid ${theme?.declined?.main}`,
                  height: "45px",
                  cursor: "auto",
                }}
                buttonTextStyle={{
                  fontSize: "14px !important",
                  color: theme?.declined?.main,
                }}
                // onClick={onClickSave}
              />
            ) : passportData?.passportInfo?.status === 3 ? (
              ""
            ) : (
              <CommonButton
                buttonText="Decline"
                sx={{
                  backgroundColor: "#E2E6EB",
                  maxWidth: isMobile ? "100%" : "max-content",
                  height: "45px",
                }}
                buttonTextStyle={{ fontSize: "14px" }}
                onClick={() => setIsReasonModalOpen(true)}
              />
            )}
            {passportData?.passportInfo?.status === 3 ? (
              <CommonButton
                buttonText="Approved"
                sx={{
                  maxWidth: isMobile ? "100%" : "max-content",
                  backgroundColor: theme?.accepted?.background?.primary,
                  border: `1px solid ${theme?.accepted?.main}`,
                  height: "45px",
                  cursor: "auto",
                }}
                buttonTextStyle={{
                  fontSize: "14px !important",
                  color: theme?.accepted?.main,
                }}
                // onClick={onClickSave}
              />
            ) : passportData?.passportInfo?.status === 4 ? (
              ""
            ) : (
              <CommonButton
                buttonText="Approve passport"
                disabled={isApproveDisabled}
                sx={{
                  maxWidth: isMobile ? "100%" : "max-content",
                  height: "45px",
                }}
                buttonTextStyle={{ fontSize: "14px !important" }}
                onClick={onClickSave}
              />
            )}
          </Stack>
        </Stack>
      </CommonCard>
      <Box>
        <Grid2 container spacing={2}>
          <Grid2 size={{ md: 12, lg: 6, xl: 6, sm: 12, xs: 12 }}>
            <Box mt={4}>
              <CommonCard>
                <Typography variant="h6" fontWeight={500}>
                  Account Information
                </Typography>

                <Box mt={2}>
                  <Image
                    src={
                      passportData?.profile
                        ? `${process.env.NEXT_PUBLIC_ASSETS_URL}/${passportData?.profile}`
                        : "/assets/images/user_profile.jpg"
                    }
                    alt="profile-pic"
                    height={182}
                    width={182}
                  />
                  <Box mt={4}>
                    <KeyValueDetails items={account_informations} />
                  </Box>
                  {/* <Box mt={2} sx={{ display: "flex", gap: 2 }}>
                    {!passportData?.isProfileImageApproved ||
                    passportData?.isProfileImageApproved === null ? (
                      <ApproveButton
                        sx={{ backgroundColor: "#F9D835", border: "none" }}
                        onClick={() =>
                          handleApprovalprofileDetails(
                            params?.id,
                            "profileImage",
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
                          backgroundColor: theme.accepted.background.primary,
                        }}
                        buttonTextStyleSx={{ color: theme.accepted.main }}
                      />
                    )}
                    {passportData?.isProfileImageApproved === true ||
                    passportData?.isProfileImageApproved === null ? (
                      <ApproveButton
                        title="Decline"
                        onClick={() =>
                          handleApprovalprofileDetails(
                            params?.id,
                            "profileImage",
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
                          backgroundColor: theme.declined.background.primary,
                        }}
                        buttonTextStyleSx={{ color: theme.declined.main }}
                      />
                    )}
                  </Box> */}
                </Box>
              </CommonCard>
            </Box>

            {/* <Box mt={4}>
              <IdentityVerificationStatus
                firstDocument={passportData?.identificationFrontCard}
                secondDocument={passportData?.identificationBack}
                showButton={false}
                isVerification={true}
                isIdFrontApproved={passportData?.isIdFrontApproved}
                isIdBackApproved={passportData?.isIdBackApproved}
                documentType={
                  passportData?.documentType
                    ? IdCardType[passportData?.documentType]
                    : "N/A"
                }
                // onApprovalClick={(index) =>
                //   handleApprovalprofileDetails(
                //     index,
                //     "profileImage",
                //     0,
                //     "approve"
                //   )
                // }
                // onRejectClick={(index) => {
                //   handleApprovalprofileDetails(
                //     index,
                //     "profileImage",
                //     0,
                //     "reject"
                //   );
                // }}
              />
            </Box> */}

            <Box mt={4}>
              <Availability
                data={{
                  urgentCareSchedule: passportData?.urgentCareSchedule,
                  hourlyCareSchedule: passportData?.hourlyCareSchedule,
                  overnightCareSchedule: passportData?.overNightCareSchedule,
                  liveInCareSchedule: passportData?.liveInCareSchedule,
                }}
                showButton={false}
                // onApprovalClick={(index) =>
                //   handleApprovalprofileDetails(
                //     index,
                //     "profileImage",
                //     0,
                //     "approve"
                //   )
                // }
                // onRejectClick={(index) => {
                //   handleApprovalprofileDetails(
                //     index,
                //     "profileImage",
                //     0,
                //     "reject"
                //   );
                // }}
              />
            </Box>

            <Box mt={4}>
              <CommonCard>
                <Typography fontWeight={500} variant="h6">
                  Emergency contact
                </Typography>
                <Box mt={3}>
                  <Box>
                    {passportData?.emergencyContacts?.map((ele, index) => {
                      const items = [
                        { label: "Full Name", value: ele.contactName },
                        {
                          label: "Relationship",
                          value:
                            ele.relationship != null
                              ? RelationshipType[Number(ele.relationship)]
                              : "N/A",
                        },
                        { label: "Phone Number", value: ele.contactNumber },
                        { label: "Email Address", value: ele.email },
                      ];

                      return (
                        <Box key={index} mb={3}>
                          <Typography fontWeight={500} variant="h6">
                            Emergency contact {index + 1}
                          </Typography>
                          <Box mt={2}>
                            <KeyValueDetails items={items} />
                          </Box>
                          {/* <Box mt={2} sx={{ display: "flex", gap: 2 }}>
                            {ele.isRequestAccepted === false ||
                            ele.isRequestAccepted === null ? (
                              <ApproveButton
                                sx={{
                                  backgroundColor: "#F9D835",
                                  border: "none",
                                }}
                                onClick={() =>
                                  handleApprovalprofileDetails(
                                    params?.id,
                                    "reference",
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
                                }}
                                buttonTextStyleSx={{
                                  color: theme.accepted.main,
                                }}
                              />
                            )}
                            {ele.isRequestAccepted === true ||
                            ele.isRequestAccepted === null ? (
                              <ApproveButton
                                title="Decline"
                                onClick={() =>
                                  handleApprovalprofileDetails(
                                    params?.id,
                                    "reference",
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
                                }}
                                buttonTextStyleSx={{
                                  color: theme.declined.main,
                                }}
                              />
                            )}
                          </Box> */}
                        </Box>
                      );
                    })}
                  </Box>
                </Box>
              </CommonCard>
            </Box>
          </Grid2>
          <Grid2 size={{ md: 12, lg: 6, xl: 6, sm: 12, xs: 12 }}>
            <Box mt={4}>
              <RecruitmentPassportProfileInformation
                heading="Profile Information"
                workingStatus={
                  passportData?.workingStatus
                    ? WorkingStatus[passportData?.workingStatus]
                    : "N/A"
                }
                workInUK={passportData?.workInUK}
                taxReferenceNo={passportData?.taxReferenceNo}
                status={null}
                showButton={false}

                // onApprovalClick={(index) =>
                //   handleApprovalprofileDetails(
                //     index,
                //     "profileImage",
                //     0,
                //     "approve"
                //   )
                // }
                // onRejectClick={(index) => {
                //   handleApprovalprofileDetails(
                //     index,
                //     "profileImage",
                //     0,
                //     "reject"
                //   );
                // }}
              />
            </Box>
            {/* <Box mt={4}>
              <Documentations
                documents={dbsDocuments}
                additionalDocuments={additionalDocuments}
                isShowButton={false}
                isDocumentVerification={true}
                // onApprovalClick={(documentType, index) => {
                //   handleApprovalprofileDetails(
                //     params?.id,
                //     documentType,
                //     index,
                //     "approve"
                //   );
                // }}
                // onRejectClick={(documentType, index) => {
                //   handleApprovalprofileDetails(
                //     params?.id,
                //     documentType,
                //     index,
                //     "reject"
                //   );
                // }}
              />
            </Box> */}
            <Box mt={4}>
              <Insurances
                documents={insurances || []}
                additionalDocuments={additionalDocuments}
                isShowButton={false}
                isVerificationButton={true}
                // onApprovalClick={(documentType, index) => {
                //   handleApprovalprofileDetails(
                //     params?.id,
                //     documentType,
                //     index,
                //     "approve"
                //   );
                // }}
                // onRejectClick={(documentType, index) => {
                //   handleApprovalprofileDetails(
                //     params?.id,
                //     documentType,
                //     index,
                //     "reject"
                //   );
                // }}
              />
            </Box>
            <Box mt={4}>
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
                    {passportData?.references?.map((ele, index) => {
                      const items = [
                        { label: "Full Name", value: ele.fullName },
                        { label: "Job title", value: ele.jobTitle },
                        { label: "Company", value: ele.company },
                        { label: "Email Address", value: ele.email },
                        { label: "Phone Number", value: ele.contactNumber },
                        {
                          label: "How do you know this person?",
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
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "row",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            <Typography fontWeight={500} variant="h6">
                              Reference {index + 1}
                            </Typography>
                            <ApproveButton
                              title={
                                ele.isRequestAccepted === null ||
                                ele.isRequestAccepted === undefined
                                  ? "Pending"
                                  : ele.isRequestAccepted === true
                                  ? "Reference verified"
                                  : "Pending"
                              }
                              sx={{
                                cursor: "default",
                                ...(ele.isRequestAccepted === true && {
                                  backgroundColor:
                                    theme.accepted.background.primary,
                                  border: "none",
                                }),
                                ...(ele.isRequestAccepted === false && {
                                  backgroundColor: "#F1F3F5",
                                  border: "none",
                                }),
                              }}
                              buttonTextStyleSx={{
                                ...(ele.isRequestAccepted === true && {
                                  color: theme.accepted.main,
                                  fontWeight: 500,
                                }),
                                ...(ele.isRequestAccepted === false && {
                                  color: theme.palette.common.black,
                                  fontWeight: 500,
                                }),
                              }}
                            />
                          </Box>
                          <Box mt={2}>
                            <KeyValueDetails items={items} />
                          </Box>
                          {/* <Box mt={2} sx={{ display: "flex", gap: 2 }}>
                            {ele.isRequestAccepted === false ||
                            ele.isRequestAccepted === null ? (
                              <ApproveButton
                                sx={{
                                  backgroundColor: "#F9D835",
                                  border: "none",
                                }}
                                onClick={() =>
                                  handleApprovalprofileDetails(
                                    params?.id,
                                    "reference",
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
                                }}
                                buttonTextStyleSx={{
                                  color: theme.accepted.main,
                                }}
                              />
                            )}
                            {ele.isRequestAccepted === true ||
                            ele.isRequestAccepted === null ? (
                              <ApproveButton
                                title="Decline"
                                onClick={() =>
                                  handleApprovalprofileDetails(
                                    params?.id,
                                    "reference",
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
                                }}
                                buttonTextStyleSx={{
                                  color: theme.declined.main,
                                }}
                              />
                            )}
                          </Box> */}
                        </Box>
                      );
                    })}
                  </Box>
                </Box>
              </CommonCard>
            </Box>
            <Box mt={4}>
              <RecruitmentPassport
                status={
                  passportData?.passportInfo?.status === 3
                    ? true
                    : passportData?.passportInfo?.status === 2
                    ? null
                    : false
                }
                date={passportData?.passportInfo?.approvedAt}
                value={passportData?.passportInfo?.rejectionReason}
              />
            </Box>
          </Grid2>
        </Grid2>
      </Box>

      <ReasonForDeclineModal
        isOpen={isreasonModalOpen}
        placeholder="State reason..."
        onClick={onClickSaveBtnInModal}
        onClose={onCloseReasonModal}
        value={""}
      />
    </Box>
  );
};

export default ViewPassport;
