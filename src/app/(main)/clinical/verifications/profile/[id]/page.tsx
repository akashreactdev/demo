"use client";
import React, { useEffect, useMemo, useState } from "react";
import moment from "moment";
import { toast } from "react-toastify";
import { useParams } from "next/navigation";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid2 from "@mui/material/Grid2";
import Stack from "@mui/material/Stack";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
//relative path imports
import CommonCard from "@/components/Cards/Common";
import Image from "next/image";
import ApproveButton from "@/components/carers/profile/ApproveButton";
import KeyValueDetails from "@/components/Cards/KeyValueDetails";
import ProfileInformation from "@/components/carers/profile/Informations";
// import Documentations from "@/components/carers/profile/Documentation";
import BankDetails from "@/components/carers/profile/BankDetails";
import {
  ApprovalClinicalProfileDetails,
  getSingleClinicalInfo,
  masterApprovalClinicalProfileDetails,
} from "@/services/api/clinicalApi";
import { ClinicalProfileResponse } from "@/types/clinicalProfileTypes";
import AssessmentVerificationStatus from "@/components/AssessmentVerificationStatus";
import InsuranceSection from "@/components/carers/profile/InsuranceSection";
import { useRouterLoading } from "@/hooks/useRouterLoading";
import CommonButton from "@/components/CommonButton";
import ReasonForDeclineModal from "@/components/carers/profile/ReasonForDeclineModal";
// import { IdCardType } from "@/constants/carersData";
import CommonChip from "@/components/CommonChip";

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
  const params = useParams() as unknown as ParamsProps;
  const [imageSrc, setImageSrc] = useState("");
  const [userInfo, setUserInfo] = useState<
    ClinicalProfileResponse["data"]["data"] | null
  >(null);
  const [isreasonModalOpen, setIsReasonModalOpen] = useState<boolean>(false);

  const onCloseReasonModal = () => {
    setIsReasonModalOpen(false);
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

      const response = (await masterApprovalClinicalProfileDetails(
        id,
        payload
      )) as masterApprovalProfileResponse;
      if (response?.data?.success) {
        setIsReasonModalOpen(false);
        toast.success(response?.data?.message);
        fetchClinicalProfile(params?.id);
      }
    } catch (e) {
      console.log(e);
    }
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
        setImageSrc(
          response?.data?.data?.profile !== "Clinicial/profile" &&
            response?.data?.data?.profile != null
            ? `${process.env.NEXT_PUBLIC_ASSETS_URL}/${response?.data?.data?.profile}`
            : ""
        );
      }
    } catch (e) {
      console.log(e);
    }
  };

  const account_informations = useMemo(() => {
    if (!userInfo) return [];

    return [
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

  const bank_details = useMemo(() => {
    return [
      {
        label: "Name on Account",
        value: userInfo?.accountName || "N/A",
      },
      {
        label: "Account Number",
        value: userInfo?.accountNumber
          ? `********${userInfo.accountNumber.slice(-4)}`
          : "N/A",
      },
      {
        label: "Sort Code",
        value: userInfo?.sortCode || "N/A",
      },
    ];
  }, [userInfo]);

  const profileData: AccordionItem[] = useMemo(() => {
    if (!userInfo) return [];
    return [
      {
        title: "Date of birth",
        type: "text",
        content:
          moment(userInfo?.dob, "DD-MM-YYYY").format("Do MMMM YYYY") || "N/A",
      },
      {
        title: "Nationality",
        type: "text",
        content: userInfo?.nationality?.name || "N/A",
      },
      {
        title: "Country of residence",
        type: "text",
        content: userInfo?.countryOfResidence || "N/A",
      },
      // {
      //   title: "National insurance number",
      //   type: "text",
      //   content: userInfo?.nationInsuranceNo || "N/A",
      // },
      // {
      //   title: "Right to work in UK",
      //   type: "chip",
      //   content: userInfo?.workInUK ? ["Yes"] : ["No"],
      // },
      // {
      //   title: "Interests & hobbies",
      //   type: "chip",
      //   content: Array.isArray(userInfo?.interestsHobbit)
      //     ? userInfo.interestsHobbit.map((lan) => lan.name)
      //     : [],
      // },
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
      // {
      //   title: "Languages",
      //   type: "chip",
      //   content: Array.isArray(userInfo?.language)
      //     ? userInfo.language.map((lan) => lan.name)
      //     : [],
      // },
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
  //         isApproved: doc.isApproved,
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
  //         isApproved: doc.isApproved,
  //       };
  //     }) || []
  //   );
  // }, [userInfo]);

  // const identificationDocs = useMemo(() => {
  //   const docs = [
  //     {
  //       key: "identificationFront",
  //       url: userInfo?.identificationFrontCard,
  //       header: "Front of card",
  //       isApproved: userInfo?.isIdFrontApproved,
  //     },
  //     {
  //       key: "identificationBack",
  //       url: userInfo?.identificationBack,
  //       header: "Back of card",
  //       isApproved: userInfo?.isIdBackApproved,
  //     },
  //     {
  //       key: "identificationImage",
  //       url: userInfo?.photo,
  //       header: "Photo",
  //       isApproved: userInfo?.isIdImageApproved,
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
  //         isApproved: doc.isApproved,
  //         key: doc.key,
  //       };
  //     });
  // }, [userInfo]);

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
      const response = (await ApprovalClinicalProfileDetails(
        id,
        payload
      )) as ApprovalProfileResponse;
      if (response?.data?.success) {
        toast.success(response?.data?.message);
        fetchClinicalProfile(params?.id);
      }
    } catch (e) {
      console.log(e);
    }
  };
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
              This clinical profile needs a review
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
            {userInfo?.status === 6 ? (
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
            {userInfo?.status === 3 ? (
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
                    {userInfo?.isProfileImageApproved === null && (
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
                    {userInfo?.isProfileImageApproved === false ||
                    userInfo?.isProfileImageApproved === null ? (
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
                    {userInfo?.isProfileImageApproved === true ||
                    userInfo?.isProfileImageApproved === null ? (
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
                identificationDocuments={identificationDocs}
                isShowButton={true}
                documentType={
                  userInfo?.documentType
                    ? IdCardType[userInfo?.documentType]
                    : "N/A"
                }
                additionalDocuments={additionalDocuments}
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
                rightToWorkInUK={userInfo?.workInUK}
                selfEmployeedPosition={userInfo?.selfEmployed}
                taxReferenceNo={userInfo?.taxReferenceNo}
                taxNo={userInfo?.taxNo}
                smoker={userInfo?.smoker}
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
                accordionData={profileData}
                // conditionalExperience={true}
                // DBSorPVG={userInfo?.DBSorPVG}
                // DBSorPVGDocument={userInfo?.DBSorPVGDocument}
                // DBSfor={userInfo?.DBSfor}
                // DBSIssueDate={userInfo?.DBS_issueDate}
                // DBSNo={userInfo?.DBSNo}
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
                        userInfo?.isIdCompleted === true
                          ? "Approved"
                          : userInfo?.isIdCompleted === false
                          ? "Declined"
                          : "Pending"
                      }
                      style={{
                        backgroundColor:
                          userInfo?.isIdCompleted === true
                            ? theme.accepted.background.primary
                            : userInfo?.isIdCompleted === false
                            ? theme.declined.background.primary
                            : theme.pending.background.primary,
                        borderColor:
                          userInfo?.isIdCompleted === true
                            ? theme.accepted.main
                            : userInfo?.isIdCompleted === false
                            ? theme.declined.main
                            : theme.pending.main,
                        borderRadius: "3px",
                      }}
                      textStyle={{
                        color:
                          userInfo?.isIdCompleted === true
                            ? theme.accepted.main
                            : userInfo?.isIdCompleted === false
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
                      {userInfo?.ZorbeePayVerificationDate
                        ? moment(userInfo?.ZorbeePayVerificationDate).format(
                            "Do MMMM YYYY | HH:mmA"
                          )
                        : "N/A"}
                    </Typography>
                  </Box>
                </Stack>
              </CommonCard>
            </Box>

            <Box mt={4}>
              <BankDetails
                bank_details={bank_details}
                // vatNumber={userInfo?.vatNumber}
                // registerBusinessAddress={userInfo?.registerBusinessAddress}
                isShowButton={false}
                isApproved={userInfo?.isAccountDetailsApproved}
                // isPaidAlert={userInfo?.isPaidAlert}
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
                title="Ai assessment"
                description=" "
                status={userInfo?.assessment?.isApproved}
                date={userInfo?.assessment?.updatedAt}
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
        title={"Reason for decline"}
        description={"Reason why this account was declined"}
        placeholder="State reason..."
      />
    </Box>
  );
};

export default Profile;
