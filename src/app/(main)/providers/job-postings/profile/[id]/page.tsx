"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import Image from "next/image";
import moment from "moment";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import Grid2 from "@mui/material/Grid2";
import Stack from "@mui/material/Stack";
import { styled, useTheme } from "@mui/material/styles";
import CheckIcon from "@mui/icons-material/Check";
import Typography from "@mui/material/Typography";
import { CircularProgress } from "@mui/material";
import CommonCard from "@/components/Cards/Common";
import CommonButton from "@/components/CommonButton";
import {
  getSinglejobProfileInfo,
  masterApprovalJobProfile,
} from "@/services/api/providerApi";
import CommonNoteCard from "@/components/CommonNoteCard";
import {
  BudgetType,
  CarerGender,
  JobFrequency,
  RequiredCertificates,
} from "@/constants/providerData";
import ReasonForDeclineModal from "@/components/carers/profile/ReasonForDeclineModal";

const StyledBox = styled(Box)(({ theme }) => ({
  border: `1px solid ${theme.pending.secondary}`,
  padding: "10px 20px",
  borderRadius: "10px",
  display: "flex",
  alignItems: "center",
  minHeight: "47px",
}));

interface ParamsProps {
  id: string;
}

interface JobWithProposalsResponse {
  data: {
    success: boolean;
    message: string;
    data: JobData;
  };
}

interface masterApprovalProfileResponse {
  data: {
    success: boolean;
    message: string;
  };
}

interface JobData {
  _id: string;
  userId: string;
  jobTitle: string;
  jobDescription: string;
  jobCategory: string;
  location: string;
  startDate: string; // ISO date string
  rateOfPay: number | null;
  frequency: number;
  hours: number;
  duration: {
    name: string;
    value: number;
  };
  requirement: {
    name: string;
    value: number;
  };
  customRequirement: string | null;
  fullName: string;
  email: string;
  phoneNo: string;
  address: string;
  houseNo: string;
  postCode: string;
  latitude: number | null;
  longitude: number | null;
  county: string;
  needs: string;
  medicalConditions: string;
  preferredGender: number;
  preferredAgeRange: number;
  experience: {
    name: string;
    value: number;
  };
  language: {
    name: string;
    value: number;
  };
  certificates: number;
  budgetType: number;
  fixedPrice: string;
  showContact: boolean;
  showAddress: boolean;
  showMedicalInfo: boolean;
  isAdminApprovalRequired: boolean;
  approvedBy: string | null;
  approvedAt: string | null;
  status: number;
  __v: number;
  closingReason: string;
}

const JobPostingProfile: React.FC = () => {
  const theme = useTheme();
  const params = useParams() as unknown as ParamsProps;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [jobProfileInfo, setJobProfileInfo] = useState<JobData | null>(null);
  const [isreasonModalOpen, setIsReasonModalOpen] = useState<boolean>(false);

  const onCloseReasonModal = () => {
    setIsReasonModalOpen(false);
  };

  useEffect(() => {
    if (params?.id) {
      fetchSingleProfile(params?.id);
    }
  }, [params?.id]);

  const fetchSingleProfile = async (id: string) => {
    setIsLoading(true);
    try {
      const response = (await getSinglejobProfileInfo(
        id
      )) as JobWithProposalsResponse;
      if (response?.data?.success) {
        setIsLoading(false);
        setJobProfileInfo(response?.data?.data);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const masterApprovalProfileData = async (
    id: string,
    index: number,
    notes?: string
  ) => {
    try {
      const payload = {
        status: index === 0 ? 1 : 4,
        ...(notes && { closingReason: notes }),
      };

      const response = (await masterApprovalJobProfile(
        id,
        payload
      )) as masterApprovalProfileResponse;
      if (response?.data?.success) {
        setIsReasonModalOpen(false);
        toast.success(response?.data?.message);
        toast.success(response?.data?.message);
        fetchSingleProfile(params?.id);
      }
    } catch (e) {
      console.log(e);
    }
    setIsReasonModalOpen(false);
  };

  const onClickSaveBtnInModal = (value: string) => {
    masterApprovalProfileData(params?.id, 1, value);
  };

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
          flexDirection={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Box>
            <Typography variant="body1" fontWeight={500}>
              Review job listing
            </Typography>
            <Typography variant="caption">
              Please review all information carefully as keywords have been
              flagged
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
            {jobProfileInfo?.status === 4 ? (
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
            {jobProfileInfo?.status === 1 ? (
              <CommonButton
                buttonText="Approved"
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
                buttonText="Approve"
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

      <Box mt={4}>
        <Grid2 container spacing={3}>
          <Grid2 size={{ lg: 6, xl: 6, md: 6, sm: 6, xs: 12 }}>
            <Box>
              <CommonCard>
                <Typography variant="h6" fontWeight={500}>
                  Basic information
                </Typography>
                <Divider sx={{ mt: 1 }} />
                <Box mt={3}>
                  <Typography variant="body1" fontWeight={400}>
                    Job title
                  </Typography>
                  <StyledBox mt={2}>
                    {jobProfileInfo?.jobTitle || "N/A"}
                  </StyledBox>
                </Box>
                <Box mt={3}>
                  <Typography variant="body1" fontWeight={400}>
                    Location
                  </Typography>
                  <StyledBox mt={2}>
                    {jobProfileInfo?.location || "N/A"}
                  </StyledBox>
                </Box>
                <Box mt={3}>
                  <Typography variant="body1" fontWeight={400}>
                    Job description
                  </Typography>
                  <CommonNoteCard
                    value={jobProfileInfo?.jobDescription || "N/A"}
                  />
                </Box>
                <Box mt={3}>
                  <Typography variant="body1" fontWeight={400}>
                    Job category
                  </Typography>
                  <StyledBox
                    mt={2}
                    sx={{ display: "flex", flexDirection: "row", gap: 2 }}
                  >
                    <Image
                      src={
                        "/assets/svg/provider/overview/medical_support_icon.svg"
                      }
                      alt="profile-pic"
                      height={48}
                      width={48}
                    />
                    {jobProfileInfo?.jobCategory || "N/A"}
                  </StyledBox>
                </Box>
              </CommonCard>
            </Box>
            <Box mt={4}>
              <CommonCard>
                <Typography variant="h6" fontWeight={500}>
                  About you
                </Typography>
                <Divider sx={{ mt: 1 }} />
                <Box mt={3}>
                  <Typography variant="body1" fontWeight={400}>
                    Full name
                  </Typography>
                  <StyledBox mt={2}>
                    {jobProfileInfo?.fullName || "N/A"}
                  </StyledBox>
                </Box>
                <Box mt={3}>
                  <Typography variant="body1" fontWeight={400}>
                    Email
                  </Typography>
                  <StyledBox mt={2}>{jobProfileInfo?.email || "N/A"}</StyledBox>
                </Box>
                <Box mt={3}>
                  <Typography variant="body1" fontWeight={400}>
                    Phone number
                  </Typography>
                  <StyledBox mt={2}>
                    {jobProfileInfo?.phoneNo || "N/A"}
                  </StyledBox>
                </Box>
                <Box mt={3}>
                  <Typography variant="body1" fontWeight={400}>
                    Address line 1
                  </Typography>
                  <StyledBox mt={2}>
                    {jobProfileInfo?.address || "N/A"}
                  </StyledBox>
                </Box>
                <Box mt={3}>
                  <Typography variant="body1" fontWeight={400}>
                    House name/no
                  </Typography>
                  <StyledBox mt={2}>
                    {jobProfileInfo?.houseNo || "N/A"}
                  </StyledBox>
                </Box>
                <Box mt={3}>
                  <Typography variant="body1" fontWeight={400}>
                    Post code
                  </Typography>
                  <StyledBox mt={2}>
                    {jobProfileInfo?.postCode || "N/A"}
                  </StyledBox>
                </Box>
                <Box mt={3}>
                  <Typography variant="body1" fontWeight={400}>
                    Country
                  </Typography>
                  <StyledBox mt={2}>
                    {jobProfileInfo?.county || "N/A"}
                  </StyledBox>
                </Box>
                <Box mt={3}>
                  <Typography variant="body1" fontWeight={400}>
                    Special needs or requirements
                  </Typography>
                  <CommonNoteCard value={jobProfileInfo?.needs || "N/A"} />
                </Box>
                <Box mt={3}>
                  <Typography variant="body1" fontWeight={400}>
                    Relevant medical conditons
                  </Typography>
                  <CommonNoteCard
                    value={jobProfileInfo?.medicalConditions || "N/A"}
                  />
                </Box>
              </CommonCard>
            </Box>
          </Grid2>
          <Grid2 size={{ lg: 6, xl: 6, md: 6, sm: 6, xs: 12 }}>
            <Box>
              <CommonCard>
                <Typography variant="h6" fontWeight={500}>
                  Schedule
                </Typography>
                <Divider sx={{ mt: 1 }} />
                <Box mt={3}>
                  <Typography variant="body1" fontWeight={400}>
                    Start date
                  </Typography>
                  <StyledBox
                    mt={2}
                    sx={{ display: "flex", flexDirection: "row", gap: 2 }}
                  >
                    <Image
                      src={"/assets/svg/provider/overview/date_calender.svg"}
                      alt="profile-pic"
                      height={20}
                      width={20}
                    />
                    {jobProfileInfo?.startDate
                      ? moment(jobProfileInfo?.startDate).format("DD/MM/YYYY")
                      : "N/A"}
                  </StyledBox>
                </Box>
                <Box mt={3}>
                  <Typography variant="body1" fontWeight={400}>
                    Duration
                  </Typography>
                  <StyledBox mt={2}>
                    {jobProfileInfo?.duration?.name || "N/A"}
                  </StyledBox>
                </Box>
                <Box mt={3}>
                  <Typography variant="body1" fontWeight={400}>
                    Frequency
                  </Typography>
                  <StyledBox mt={2}>
                    {JobFrequency[Number(jobProfileInfo?.frequency)] || "N/A"}
                  </StyledBox>
                </Box>
              </CommonCard>
            </Box>
            <Box mt={4}>
              <CommonCard>
                <Typography variant="h6" fontWeight={500}>
                  Carer preferences
                </Typography>
                <Divider sx={{ mt: 1 }} />
                <Box mt={3}>
                  <Typography variant="body1" fontWeight={400}>
                    Preferred gender
                  </Typography>
                  <StyledBox mt={2}>
                    {CarerGender[Number(jobProfileInfo?.preferredGender)] ||
                      "N/A"}
                  </StyledBox>
                </Box>
                <Box mt={3}>
                  <Typography variant="body1" fontWeight={400}>
                    Maximum years of experience
                  </Typography>
                  <StyledBox mt={2}>
                    {jobProfileInfo?.experience
                      ? jobProfileInfo?.experience?.name
                      : "N/A"}
                  </StyledBox>
                </Box>
                <Box mt={3}>
                  <Typography variant="body1" fontWeight={400}>
                    Required language
                  </Typography>
                  <StyledBox mt={2}>
                    {jobProfileInfo?.language?.name || "N/A"}
                  </StyledBox>
                </Box>
                <Box mt={3}>
                  <Typography variant="body1" fontWeight={400}>
                    Required certificates
                  </Typography>
                  <StyledBox mt={2}>
                    {RequiredCertificates[
                      Number(jobProfileInfo?.certificates)
                    ] || "N/A"}
                  </StyledBox>
                </Box>
              </CommonCard>
            </Box>
            <Box mt={4}>
              <CommonCard>
                <Typography variant="h6" fontWeight={500}>
                  Budget
                </Typography>
                <Divider sx={{ mt: 1 }} />
                <Box mt={3}>
                  <StyledBox
                    mt={2}
                    sx={{ display: "flex", flexDirection: "row", gap: 2 }}
                  >
                    <Image
                      src={
                        "/assets/svg/provider/overview/budget_price_icon.svg"
                      }
                      alt="profile-pic"
                      height={48}
                      width={48}
                    />
                    {BudgetType[Number(jobProfileInfo?.budgetType)] || "N/A"}
                  </StyledBox>
                </Box>
                <Box mt={3}>
                  <Typography variant="body1" fontWeight={400}>
                    Fixed price (£)
                  </Typography>
                  <StyledBox mt={2}>
                    {jobProfileInfo?.fixedPrice || "N/A"}
                  </StyledBox>
                </Box>
              </CommonCard>
            </Box>
            <Box mt={4}>
              <CommonCard>
                <Typography variant="h6" fontWeight={500}>
                  Privacy settings
                </Typography>
                <Divider sx={{ mt: 1 }} />
                <Box mt={3}>
                  <Typography variant="body1" fontWeight={400}>
                    Show contact information?
                  </Typography>
                  <StyledBox
                    mt={2}
                    sx={{ display: "flex", flexDirection: "row", gap: 2 }}
                  >
                    {!jobProfileInfo?.showContact ? (
                      <Box
                        sx={{
                          height: "30px",
                          width: "30px",
                          border: "1px solid black",
                          borderRadius: "5px",
                          flexShrink: 0,
                        }}
                      />
                    ) : (
                      <Box
                        sx={{
                          height: "30px",
                          width: "30px",
                          border: `1px solid ${theme.inProgress.main}`,
                          background: theme.pending.secondary,
                          borderRadius: "5px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <CheckIcon
                          sx={{ color: theme.inProgress.main, fontSize: 24 }}
                        />
                      </Box>
                    )}
                    <Typography
                      variant="body1"
                      fontWeight={400}
                      fontSize={"15px"}
                    >
                      Your email and phone number will be visible to potential
                      carers.
                    </Typography>
                  </StyledBox>
                </Box>
                <Box mt={3}>
                  <Typography variant="body1" fontWeight={400}>
                    Show full address?
                  </Typography>
                  <StyledBox
                    mt={2}
                    sx={{ display: "flex", flexDirection: "row", gap: 2 }}
                  >
                    {!jobProfileInfo?.showAddress ? (
                      <Box
                        sx={{
                          height: "30px",
                          width: "30px",
                          border: "1px solid black",
                          borderRadius: "5px",
                          flexShrink: 0,
                        }}
                      />
                    ) : (
                      <Box
                        sx={{
                          height: "30px",
                          width: "30px",
                          border: `1px solid ${theme.inProgress.main}`,
                          background: theme.pending.secondary,
                          borderRadius: "5px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <CheckIcon
                          sx={{ color: theme.inProgress.main, fontSize: 24 }}
                        />
                      </Box>
                    )}
                    <Typography
                      variant="body1"
                      fontWeight={400}
                      fontSize={"15px"}
                    >
                      Your complete address will be visible (only city is shown
                      by default).
                    </Typography>
                  </StyledBox>
                </Box>
                <Box mt={3}>
                  <Typography variant="body1" fontWeight={400}>
                    Show medical information?
                  </Typography>
                  <StyledBox
                    mt={2}
                    sx={{ display: "flex", flexDirection: "row", gap: 2 }}
                  >
                    {!jobProfileInfo?.showMedicalInfo ? (
                      <Box
                        sx={{
                          height: "30px",
                          width: "30px",
                          border: "1px solid black",
                          borderRadius: "5px",
                          flexShrink: 0,
                        }}
                      />
                    ) : (
                      <Box
                        sx={{
                          height: "30px",
                          width: "30px",
                          border: `1px solid ${theme.inProgress.main}`,
                          background: theme.pending.secondary,
                          borderRadius: "5px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <CheckIcon
                          sx={{ color: theme.inProgress.main, fontSize: 24 }}
                        />
                      </Box>
                    )}
                    <Typography
                      variant="body1"
                      fontWeight={400}
                      fontSize={"15px"}
                    >
                      Your medical conditions and special needs will be visible.
                    </Typography>
                  </StyledBox>
                </Box>
              </CommonCard>
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
export default JobPostingProfile;
