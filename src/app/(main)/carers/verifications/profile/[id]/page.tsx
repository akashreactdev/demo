"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import moment from "moment";
import { toast } from "react-toastify";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid2 from "@mui/material/Grid2";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
//relative path imports
import CommonCard from "@/components/Cards/Common";
import ApproveButton from "@/components/carers/profile/ApproveButton";
import KeyValueDetails from "@/components/Cards/KeyValueDetails";
import ProfileInformation from "@/components/carers/profile/Informations";
// import Documentations from "@/components/carers/profile/Documentation";
import BankDetails from "@/components/carers/profile/BankDetails";
import {
  ApprovalCarerProfileDetails,
  getCarerInfo,
  masterApprovalCarerProfileDetails,
} from "@/services/api/carerApi";
import { CarerProfileData } from "@/types/carerProfileType";
import AssessmentVerificationStatus from "@/components/AssessmentVerificationStatus";
import InsuranceSection from "@/components/carers/profile/InsuranceSection";
import { useRouterLoading } from "@/hooks/useRouterLoading";
import CommonButton from "@/components/CommonButton";
import ReasonForDeclineModal from "@/components/carers/profile/ReasonForDeclineModal";
import CommonChip from "@/components/CommonChip";
// import { IdCardType } from "@/constants/carersData";

interface AccordionItem {
  title: string;
  type: "text" | "chip";
  content: string | string[];
}

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

const Profile: React.FC = () => {
  const theme = useTheme();
  const { navigateWithLoading } = useRouterLoading();
  const [imageSrc, setImageSrc] = useState("");
  const params = useParams() as unknown as ParamsProps;
  const [carerProfileInfo, setCarerProfileInfo] =
    useState<CarerProfileData | null>(null);
  const [isreasonModalOpen, setIsReasonModalOpen] = useState<boolean>(false);

  const onCloseReasonModal = () => {
    setIsReasonModalOpen(false);
  };

  useEffect(() => {
    if (params?.id) {
      fetchCarerProfile(params?.id);
    }
  }, [params?.id]);

  const handleApprovalprofileDetails = async (
    id: string,
    key: string,
    documentIndex: number,
    action: string
  ) => {
    try {
      const payload = {
        documentType: key,
        documentIndex: documentIndex,
        action: action,
      };
      const response = (await ApprovalCarerProfileDetails(
        id,
        payload
      )) as ApprovalProfileResponse;
      if (response?.data?.success) {
        toast.success(response?.data?.message);
        fetchCarerProfile(params?.id);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const fetchCarerProfile = async (id: string) => {
    try {
      const response = await getCarerInfo(id);
      if (response?.data?.success) {
        setCarerProfileInfo(response?.data?.data);
        setImageSrc(
          response?.data?.data?.profile !== "carer/profile" &&
            response?.data?.data?.profile != null
            ? `${process.env.NEXT_PUBLIC_ASSETS_URL}/${response?.data?.data?.profile}`
            : ""
        );
      }
    } catch (e) {
      console.log(e);
    }
  };

  const onClickSaveBtnInModal = (value: string) => {
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

      const response = (await masterApprovalCarerProfileDetails(
        id,
        payload
      )) as masterApprovalProfileResponse;
      if (response?.data?.success) {
        setIsReasonModalOpen(false);
        toast.success(response?.data?.message);
        fetchCarerProfile(params?.id);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const account_informations = useMemo(() => {
    return [
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

  const profile_information: AccordionItem[] = useMemo(() => {
    return [
      {
        title: "Date of birth",
        type: "text",
        content:
          moment(carerProfileInfo?.dob, "DD-MM-YYYY").format("Do MMMM YYYY") ||
          "N/A",
      },
      {
        title: "Nationality",
        type: "text",
        content: carerProfileInfo?.nationality?.name || "N/A",
      },
      {
        title: "Country of residence",
        type: "text",
        content: carerProfileInfo?.countryOfResidence || "N/A",
      },
      // {
      //   title: "National insurance number",
      //   type: "text",
      //   content: carerProfileInfo?.nationInsuranceNo || "N/A",
      // },
    ];
  }, [carerProfileInfo]);

  const bank_details = useMemo(() => {
    return [
      {
        label: "Name on Account",
        value: carerProfileInfo?.accountName || "N/A",
      },
      {
        label: "Account Number",
        value: carerProfileInfo?.accountNumber
          ? `********${carerProfileInfo.accountNumber.slice(-4)}`
          : "N/A",
      },
      {
        label: "Sort Code",
        value: carerProfileInfo?.sortCode || "N/A",
      },
    ];
  }, [carerProfileInfo]);

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
  //         isApproved: doc.isApproved,
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
  //         isApproved: doc.isApproved,
  //       };
  //     }) || []
  //   );
  // }, [carerProfileInfo]);

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

  // const identificationDocs = useMemo(() => {
  //   const docs = [
  //     {
  //       key: "identificationFront",
  //       url: carerProfileInfo?.identificationFrontCard || "N/A",
  //       header: "Front of card",
  //       isApproved: carerProfileInfo?.isIdFrontApproved,
  //     },
  //     {
  //       key: "identificationBack",
  //       url: carerProfileInfo?.identificationBack || "N/A",
  //       header: "Back of card",
  //       isApproved: carerProfileInfo?.isIdBackApproved,
  //     },
  //     {
  //       key: "identificationImage",
  //       url: carerProfileInfo?.photo || "N/A",
  //       header: "Photo",
  //       isApproved: carerProfileInfo?.isIdImageApproved,
  //     },
  //   ];

  //   return docs.map((doc) => {
  //     if (!doc.url) return { title: `N/A`, url: "N/A" };

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
  //       isApproved: doc.isApproved,
  //       key: doc.key,
  //     };
  //   });
  // }, [carerProfileInfo]);

  return (
    <Box>
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
              This carer profile needs a review
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
            {carerProfileInfo?.status === 6 ? (
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
            {carerProfileInfo?.status === 3 ? (
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
          <Grid2 size={{ md: 6, lg: 6, xl: 6, sm: 12, xs: 12 }}>
            <Box mt={4}>
              <CommonCard>
                <Typography variant="h6" fontWeight={500}>
                  Account Information
                </Typography>

                <Box mt={2}>
                  <Image
                    src={imageSrc || "/assets/images/user_profile.jpg"}
                    alt="profile-pic"
                    height={182}
                    width={182}
                  />
                  <Box mt={4}>
                    <KeyValueDetails items={account_informations} />
                  </Box>
                  <Box mt={2} sx={{ display: "flex", gap: 2 }}>
                    {carerProfileInfo?.isProfileImageApproved === null && (
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
                    {!carerProfileInfo?.isProfileImageApproved ||
                    carerProfileInfo?.isProfileImageApproved === null ? (
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
                          borderColor: theme.accepted.main,
                        }}
                        buttonTextStyleSx={{ color: theme.accepted.main }}
                      />
                    )}
                    {carerProfileInfo?.isProfileImageApproved === true ||
                    carerProfileInfo?.isProfileImageApproved === null ? (
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
                          borderColor: theme.declined.main,
                        }}
                        buttonTextStyleSx={{ color: theme.declined.main }}
                      />
                    )}
                  </Box>
                </Box>
              </CommonCard>
            </Box>

            {/* <Box mt={4}>
              <Documentations
                documents={dbsDocuments}
                additionalDocuments={additionalDocuments}
                identificationDocuments={identificationDocs}
                isShowButton={true}
                documentType={
                  carerProfileInfo?.documentType
                    ? IdCardType[carerProfileInfo?.documentType]
                    : "N/A"
                }
                onApprovalClick={(documentType, index) => {
                  handleApprovalprofileDetails(
                    params?.id,
                    documentType,
                    index,
                    "approve"
                  );
                }}
                onRejectClick={(documentType, index) => {
                  handleApprovalprofileDetails(
                    params?.id,
                    documentType,
                    index,
                    "reject"
                  );
                }}
              />
            </Box> */}

            <Box mt={4}>
              <InsuranceSection
                documents={insuranceDocuments}
                rightToWorkInUK={carerProfileInfo?.workInUK}
                selfEmployeedPosition={carerProfileInfo?.selfEmployed}
                taxReferenceNo={carerProfileInfo?.taxReferenceNo}
                taxNo={carerProfileInfo?.taxNo}
                smoker={carerProfileInfo?.smoker}
                isShowButton={true}
                onApprovalClick={(documentType, index) => {
                  handleApprovalprofileDetails(
                    params?.id,
                    documentType,
                    index,
                    "approve"
                  );
                }}
                onRejectClick={(documentType, index) => {
                  handleApprovalprofileDetails(
                    params?.id,
                    documentType,
                    index,
                    "reject"
                  );
                }}
              />
            </Box>
          </Grid2>
          <Grid2 size={{ md: 6, lg: 6, xl: 6, sm: 12, xs: 12 }}>
            <Box mt={4}>
              <ProfileInformation
                heading="ID Information"
                accordionData={profile_information}
                conditionalExperience={false}
                // DBSorPVG={carerProfileInfo?.DBSorPVG}
                // DBSorPVGDocument={carerProfileInfo?.DBSorPVGDocument}
                // DBSfor={carerProfileInfo?.DBSfor}
                // DBSIssueDate={carerProfileInfo?.DBS_issueDate}
                // DBSNo={carerProfileInfo?.DBSNo}
              />
            </Box>

            <Box mt={4}>
              <CommonCard>
                <Typography variant="h6" fontWeight={500}>
                  Document verification
                </Typography>
                <Stack
                  mt={2}
                  flexDirection={"row"}
                  gap={2}
                  alignItems={"center"}
                >
                  <Box>
                    <CommonChip
                      title={
                        carerProfileInfo?.isIdCompleted === true
                          ? "Approved"
                          : carerProfileInfo?.isIdCompleted === false
                          ? "Declined"
                          : "Pending"
                      }
                      style={{
                        backgroundColor:
                          carerProfileInfo?.isIdCompleted === true
                            ? theme.accepted.background.primary
                            : carerProfileInfo?.isIdCompleted === false
                            ? theme.declined.background.primary
                            : theme.pending.background.primary,
                        borderColor:
                          carerProfileInfo?.isIdCompleted === true
                            ? theme.accepted.main
                            : carerProfileInfo?.isIdCompleted === false
                            ? theme.declined.main
                            : theme.pending.main,
                        borderRadius: "3px",
                      }}
                      textStyle={{
                        color:
                          carerProfileInfo?.isIdCompleted === true
                            ? theme.accepted.main
                            : carerProfileInfo?.isIdCompleted === false
                            ? theme.declined.main
                            : theme.pending.main,
                      }}
                    />
                  </Box>
                  <Box>
                    <Typography variant="body2" fontSize={"12px"}>
                      Date
                    </Typography>
                    <Typography variant="body2" fontSize={"12px"}>
                      {carerProfileInfo?.ZorbeePayVerificationDate
                        ? moment(
                            carerProfileInfo?.ZorbeePayVerificationDate
                          ).format("Do MMMM YYYY | HH:mmA")
                        : "N/A"}
                    </Typography>
                  </Box>
                </Stack>
              </CommonCard>
            </Box>

            <Box mt={4}>
              <BankDetails
                bank_details={bank_details}
                // vatNumber={carerProfileInfo?.vatNumber}
                // registerBusinessAddress={
                //   carerProfileInfo?.registerBusinessAddress
                // }
                isShowButton={false}
                isApproved={carerProfileInfo?.isAccountDetailsApproved}
                // isPaidAlert={carerProfileInfo?.isPaidAlert}
                onApprovalClick={(index) => {
                  handleApprovalprofileDetails(
                    params?.id,
                    "accountDetails",
                    index,
                    "approve"
                  );
                }}
                onRejectClick={(index) => {
                  handleApprovalprofileDetails(
                    params?.id,
                    "accountDetails",
                    index,
                    "reject"
                  );
                }}
              />
            </Box>

            <Box mt={4}>
              <AssessmentVerificationStatus
                title="AI assessment"
                description=" "
                status={carerProfileInfo?.assessment?.isApproved}
                date={carerProfileInfo?.assessment?.updatedAt}
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
