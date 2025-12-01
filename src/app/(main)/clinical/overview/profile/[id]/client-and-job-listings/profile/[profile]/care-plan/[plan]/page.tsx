"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import moment from "moment";
import {
  Box,
  CircularProgress,
  Divider,
  Grid2,
  Stack,
  Typography,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import CheckIcon from "@mui/icons-material/Check";
//relative path imports
import CommonNoteCard from "@/components/CommonNoteCard";
import CommonCard from "@/components/Cards/Common";
import { getClientCarePlanSignleData } from "@/services/api/usersApi";
import CommonChip from "@/components/CommonChip";

const StyledBox = styled(Box)(({ theme }) => ({
  border: `1px solid ${theme.pending.secondary}`,
  padding: "10px 20px",
  borderRadius: "10px",
  display: "flex",
  alignItems: "center",
}));

interface ParamsProps {
  id: string;
  profile : string;
  plan: string;
}

export interface FamilyMember {
  memberName: string;
  memberPhoneNo: string | null;
  memberEmail: string | null;
  relationship: string | null;
  nextOfKin: string | null;
  contactPriority: string | null;
}

export interface CarePlanData {
  _id: string;
  userId: string;
  name: string;
  phoneNo: string | null;
  familyMembers: FamilyMember[];
  status: number;
  specialCharacteristics: string;
  carePreferences: string;
  caregivervisitInfo: string;
  careCommunicationPreference: string;
  dislikes: string;
  backgroundHistory: string;
  safetyConcerns: string;
  worriesOrTriggers: string;
  balanceIssues: boolean;
  balanceDetails: string | null;
  historyofFalls: boolean;
  fallDetails: string;
  hydrationSupport: string;
  mealLocationPreference: string;
  swallowingDifficulties: boolean;
  swallowingDetails: string;
  swallowingSupport: string;
  prescribedSupplements: string;
  skinCareSupport: boolean;
  skinCareSupportDetails: string;
  skinIntegritySupport: string;
  hasSkinIssues: boolean;
  skinIssueDetails: string;
  communicationSupport: boolean;
  communicationSupportDetails: string;
  needsInterpreter: boolean;
  interpreterDetails: string;
  communicationPreferences: string;
  needCommunicationAids: boolean;
  communicationAidDetails: string;
  communicationAidUsage: string;
  hearingIssues: boolean;
  hearingDetails: string;
  needHearingAid: boolean;
  hearingAidSupport: string;
  hearingAidMaintenance: string;
  visionIssues: boolean;
  visionDetails: string;
  sightDiagnosis: string;
  usesGlasses: boolean;
  glassesSupport: string;
  speechIssues: boolean;
  speechIssueDetails: string;
  speechSupport: string;
  dryMouthOrCoatedTongue: boolean;
  haveMouthUlcers: boolean;
  mouthUlcersDetails: string;
  brokenTeeth: boolean;
  brokenTeethDetails: string;
  oralCarePreferences: string;
  medicationSupport: boolean;
  medicationSupportDetails: string;
  medicationSupportLevel: string;
  medicationAdminBy: string | null;
  blisterPackOrBox: boolean;
  pharmacyInfo: string;
  payForMedicationDelivery: boolean;
  paymentDetails: string;
  nonPrescribedMedication: boolean;
  nonPrescribedMedicationDetails: string;
  medicationReactions: string;
  usesSharps: boolean;
  sharpsDetails: string;
  medicationConcerns: string;
  overdoseHistory: boolean;
  overdoseDetails: string;
  missedMedsDetails: string;
  specialAccess: boolean;
  accessDetails: string;
  signedBy: string;
  signatureDate: string;
  relationShipToClient: string;
  isAgree: boolean;
  signatureImage: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CarePlanResponse {
  data: {
    success: boolean;
    message: string;
    data: CarePlanData;
  };
}

const CarePlan = () => {
  const theme = useTheme();
  const params = useParams() as unknown as ParamsProps;
  const [isCheck, setIsCheck] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [carePlanData, setCarePlanData] = useState<CarePlanData>();

  const fetchSingleUserInfo = async (id: string) => {
    setIsLoading(true);
    try {
      const response = (await getClientCarePlanSignleData(
        id
      )) as CarePlanResponse;
      if (response?.data?.success) {
        setIsLoading(false);
        setCarePlanData(response?.data?.data);
        setIsCheck(response?.data?.data?.isAgree === true ? false : true);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (params?.plan) {
      fetchSingleUserInfo(params?.plan);
    }
  }, [params?.plan]);

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
          flexWrap={"wrap"}
        >
          <Box>
            <Typography variant="h6" fontWeight={500}>
              Care plan
            </Typography>
            <Typography variant="caption" fontWeight={400}>
              You are currently previewing a care plan created by{" "}
              {carePlanData?.name}. Please find the details below.
            </Typography>
          </Box>
        </Stack>
      </CommonCard>

      <Grid2 container spacing={2}>
        <Grid2 size={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 6 }}>
          {/* Special characteristics */}
          <Box mt={4}>
            <CommonCard>
              <Typography variant="body1" fontWeight={500}>
                Special characteristics
              </Typography>
              <Divider sx={{ mt: 1, mb: 2 }} />
              <CommonNoteCard
                title=""
                rows={1}
                value={carePlanData?.specialCharacteristics || ""}
                description=""
                placeholder="Please provide details..."
              />
            </CommonCard>
          </Box>
          {/* Social and emoitonal wellbeing */}
          <Box mt={4}>
            <CommonCard>
              <Typography variant="body1" fontWeight={500}>
                Social and emoitonal wellbeing
              </Typography>
              <Divider sx={{ mt: 1 }} />
              <Box mt={3}>
                <CommonNoteCard
                  title="Important things that caregivers need to be aware of to keep me safe..."
                  rows={1}
                  value={carePlanData?.safetyConcerns || ""}
                />
              </Box>
              <Box mt={3}>
                <CommonNoteCard
                  title="Things that worry me or may upset me..."
                  rows={1}
                  value={carePlanData?.worriesOrTriggers || ""}
                />
              </Box>
              <Box mt={3}>
                <Typography variant="subtitle1" fontWeight={500}>
                  Do you have any balance issues?
                </Typography>
                <Box mt={2}>
                  <CommonChip
                    title={
                      carePlanData?.balanceIssues === true
                        ? "Yes"
                        : carePlanData?.balanceIssues === false
                        ? "No"
                        : "N/A"
                    }
                    variant="primary"
                    style={{
                      backgroundColor: theme?.palette?.common?.white,
                      border: `1px solid ${theme.ShadowAndBorder.border2}`,
                    }}
                    textStyle={{ fontSize: "15px" }}
                  />
                </Box>
                {carePlanData?.balanceIssues === true && (
                  <Box>
                    <Typography variant="body1" mt={4}>
                      If yes, please describe
                    </Typography>
                    <CommonNoteCard
                      rows={1}
                      value={carePlanData?.balanceDetails || ""}
                    />
                  </Box>
                )}
              </Box>
              <Box mt={3}>
                <Typography variant="subtitle1" fontWeight={500}>
                  Do you have a history of falls?
                </Typography>
                <Box mt={2}>
                  <CommonChip
                    title={
                      carePlanData?.historyofFalls === true
                        ? "Yes"
                        : carePlanData?.historyofFalls === false
                        ? "No"
                        : "N/A"
                    }
                    variant="primary"
                    style={{
                      backgroundColor: theme?.palette?.common?.white,
                      border: `1px solid ${theme.ShadowAndBorder.border2}`,
                    }}
                    textStyle={{ fontSize: "15px" }}
                  />
                </Box>
                {carePlanData?.historyofFalls === true && (
                  <Box>
                    <Typography variant="body1" mt={4}>
                      If yes, please describe
                    </Typography>
                    <CommonNoteCard
                      rows={1}
                      value={carePlanData?.fallDetails || ""}
                    />
                  </Box>
                )}
              </Box>
            </CommonCard>
          </Box>
          {/* Skin care & integrity */}
          <Box mt={4}>
            <CommonCard>
              <Typography variant="body1" fontWeight={500}>
                Skin care & integrity
              </Typography>
              <Divider sx={{ mt: 1 }} />
              <Box mt={3}>
                <Typography variant="subtitle1" fontWeight={500}>
                  Do you need support with skin care?
                </Typography>
                <Box mt={2}>
                  <CommonChip
                    title={
                      carePlanData?.skinCareSupport === true
                        ? "Yes"
                        : carePlanData?.skinCareSupport === false
                        ? "No"
                        : "N/A"
                    }
                    variant="primary"
                    style={{
                      backgroundColor: theme?.palette?.common?.white,
                      border: `1px solid ${theme.ShadowAndBorder.border2}`,
                    }}
                    textStyle={{ fontSize: "15px" }}
                  />
                </Box>
                {carePlanData?.skinCareSupport === true && (
                  <Box>
                    <Typography mt={2} variant="body1">
                      If yes, please describe
                    </Typography>
                    <CommonNoteCard
                      rows={1}
                      placeholder="Please provide details..."
                      value={carePlanData?.skinCareSupportDetails || ""}
                    />
                  </Box>
                )}
              </Box>
              <Box mt={3}>
                <CommonNoteCard
                  title="What support is needed to maintain your skin integrity?"
                  placeholder="Please provide details..."
                  rows={1}
                  value={carePlanData?.skinIntegritySupport || ""}
                />
              </Box>
              <Box mt={3}>
                <Typography variant="body1" fontWeight={500}>
                  Do you have any broken skin, pressure sores, or other skin
                  issues?
                </Typography>
                <Box mt={2}>
                  <CommonChip
                    title={
                      carePlanData?.hasSkinIssues === true
                        ? "Yes"
                        : carePlanData?.hasSkinIssues === false
                        ? "No"
                        : "N/A"
                    }
                    variant="primary"
                    style={{
                      backgroundColor: theme?.palette?.common?.white,
                      border: `1px solid ${theme.ShadowAndBorder.border2}`,
                    }}
                    textStyle={{ fontSize: "15px" }}
                  />
                </Box>
                {carePlanData?.hasSkinIssues === true && (
                  <Box>
                    <Typography mt={2} variant="body1">
                      If yes, please describe
                    </Typography>
                    <CommonNoteCard
                      rows={1}
                      placeholder="Please provider details..."
                      value={carePlanData?.skinIssueDetails || ""}
                    />
                  </Box>
                )}
              </Box>
            </CommonCard>
          </Box>
          {/* Communication support */}
          <Box mt={4}>
            <CommonCard>
              <Typography variant="body1" fontWeight={500}>
                Communication support
              </Typography>
              <Divider sx={{ mt: 1 }} />
              <Box mt={3}>
                <Typography variant="subtitle1" fontWeight={500}>
                  Do you require support with communication?
                </Typography>
                <Box mt={2}>
                  <CommonChip
                    title={
                      carePlanData?.communicationSupport === true
                        ? "Yes"
                        : carePlanData?.communicationSupport === false
                        ? "No"
                        : "N/A"
                    }
                    variant="primary"
                    style={{
                      backgroundColor: theme?.palette?.common?.white,
                      border: `1px solid ${theme.ShadowAndBorder.border2}`,
                    }}
                    textStyle={{ fontSize: "15px" }}
                  />
                </Box>
                {carePlanData?.communicationSupport === true && (
                  <Box>
                    <Typography mt={2} variant="body1">
                      If yes, please describe
                    </Typography>
                    <CommonNoteCard
                      rows={1}
                      placeholder="Please provide details..."
                      value={carePlanData?.communicationSupportDetails || ""}
                    />
                  </Box>
                )}
              </Box>

              <Box mt={3}>
                <Typography variant="body1" fontWeight={500}>
                  Do you use any special aids to support communication?
                </Typography>
                <Box mt={2}>
                  <CommonChip
                    title={
                      carePlanData?.needCommunicationAids === true
                        ? "Yes"
                        : carePlanData?.needCommunicationAids === false
                        ? "No"
                        : "N/A"
                    }
                    variant="primary"
                    style={{
                      backgroundColor: theme?.palette?.common?.white,
                      border: `1px solid ${theme.ShadowAndBorder.border2}`,
                    }}
                    textStyle={{ fontSize: "15px" }}
                  />
                </Box>
                {carePlanData?.needCommunicationAids === true && (
                  <Box>
                    <Typography mt={2} variant="body1">
                      If yes, please describe
                    </Typography>
                    <CommonNoteCard
                      rows={1}
                      placeholder="Please provide details..."
                      value={carePlanData?.communicationAidDetails || ""}
                    />
                  </Box>
                )}
              </Box>

              <Box mt={3}>
                <CommonNoteCard
                  title="How do you prefer to communicate, and what’s important to you when caregivers communicate?"
                  placeholder="Please provide details..."
                  rows={1}
                  value={carePlanData?.communicationPreferences || ""}
                />
              </Box>

              <Box mt={3}>
                <Typography variant="subtitle1" fontWeight={500}>
                  Do you need an interpreter?
                </Typography>
                <Box mt={2}>
                  <CommonChip
                    title={
                      carePlanData?.needsInterpreter === true
                        ? "Yes"
                        : carePlanData?.needsInterpreter === false
                        ? "No"
                        : "N/A"
                    }
                    variant="primary"
                    style={{
                      backgroundColor: theme?.palette?.common?.white,
                      border: `1px solid ${theme.ShadowAndBorder.border2}`,
                    }}
                    textStyle={{ fontSize: "15px" }}
                  />
                </Box>
                {carePlanData?.needsInterpreter === true && (
                  <Box>
                    <Typography mt={2} variant="body1">
                      If yes, please describe
                    </Typography>
                    <CommonNoteCard
                      rows={1}
                      placeholder="Please provide details..."
                      value={carePlanData?.interpreterDetails || ""}
                    />
                  </Box>
                )}
              </Box>

              <Box mt={3}>
                <CommonNoteCard
                  title="What aids are required, and how should caregivers use them?"
                  placeholder="Please provide details..."
                  rows={1}
                  value={carePlanData?.communicationAidUsage || ""}
                />
              </Box>
            </CommonCard>
          </Box>
          {/* Medication support */}
          <Box mt={4}>
            <CommonCard>
              <Typography variant="body1" fontWeight={500}>
                Medication support
              </Typography>
              <Divider sx={{ mt: 1 }} />
              <Box mt={3}>
                <Typography variant="body1" fontWeight={500}>
                  Do you need help with medication?
                </Typography>
                <Box mt={2}>
                  <CommonChip
                    title={
                      carePlanData?.medicationSupport === true
                        ? "Yes"
                        : carePlanData?.medicationSupport === false
                        ? "No"
                        : "N/A"
                    }
                    variant="primary"
                    style={{
                      backgroundColor: theme?.palette?.common?.white,
                      border: `1px solid ${theme.ShadowAndBorder.border2}`,
                    }}
                    textStyle={{ fontSize: "15px" }}
                  />
                </Box>
                {carePlanData?.medicationSupport === true && (
                  <Box>
                    <Typography mt={2} variant="body1">
                      If yes, please describe
                    </Typography>
                    <CommonNoteCard
                      rows={1}
                      placeholder="Please provide details..."
                      value={carePlanData?.medicationSupportDetails || ""}
                    />
                  </Box>
                )}
              </Box>
              <Box mt={3}>
                <Typography variant="body1" fontWeight={500}>
                  Who will be responsible for administering your medication?
                </Typography>
                <Stack flexDirection={"row"} gap={2} mt={2}>
                  {["Myself", "Carer", "Loved one", "Other"].map(
                    (arr, index) => (
                      <CommonChip
                        key={index}
                        title={arr}
                        variant="primary"
                        style={{
                          backgroundColor: theme?.palette?.common?.white,
                          border: `1px solid ${theme.ShadowAndBorder.border2}`,
                        }}
                        textStyle={{ fontSize: "15px" }}
                      />
                    )
                  )}
                </Stack>

                <Box>
                  <Typography mt={2} variant="body1">
                    If other, please provide details: 
                  </Typography>
                  <CommonNoteCard
                    rows={1}
                    placeholder="Please provide details..."
                    value="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
                  />
                </Box>
              </Box>
              <Box mt={3}>
                <CommonNoteCard
                  title="What is your named pharmacy, and do you get your medication collected or delivered?"
                  rows={1}
                  placeholder="Please provide details..."
                  value={carePlanData?.pharmacyInfo || ""}
                />
              </Box>
              <Box mt={3}>
                <Typography variant="body1" fontWeight={500}>
                  Do you use any non-prescribed medication?
                </Typography>
                <Box mt={2}>
                  <CommonChip
                    title={
                      carePlanData?.nonPrescribedMedication === true
                        ? "Yes"
                        : carePlanData?.nonPrescribedMedication === false
                        ? "No"
                        : "N/A"
                    }
                    variant="primary"
                    style={{
                      backgroundColor: theme?.palette?.common?.white,
                      border: `1px solid ${theme.ShadowAndBorder.border2}`,
                    }}
                    textStyle={{ fontSize: "15px" }}
                  />
                </Box>
                {carePlanData?.nonPrescribedMedication === true && (
                  <Box>
                    <Typography mt={2} variant="body1">
                      If yes, please describe
                    </Typography>
                    <CommonNoteCard
                      rows={1}
                      placeholder="Please provide details..."
                      value={carePlanData?.nonPrescribedMedicationDetails || ""}
                    />
                  </Box>
                )}
              </Box>
              <Box mt={3}>
                <Typography variant="body1" fontWeight={500}>
                  Do we use any sharps with your care? If yes, is the correct
                  sharps box in place and who arranges the collection?
                </Typography>
                <Box mt={2}>
                  <CommonChip
                    title={
                      carePlanData?.usesSharps === true
                        ? "Yes"
                        : carePlanData?.usesSharps === false
                        ? "No"
                        : "N/A"
                    }
                    variant="primary"
                    style={{
                      backgroundColor: theme?.palette?.common?.white,
                      border: `1px solid ${theme.ShadowAndBorder.border2}`,
                    }}
                    textStyle={{ fontSize: "15px" }}
                  />
                </Box>
                {carePlanData?.usesSharps === true && (
                  <Box>
                    <Typography mt={2} variant="body1">
                      If yes, please describe
                    </Typography>
                    <CommonNoteCard
                      rows={1}
                      placeholder="Please provide details..."
                      value={carePlanData?.sharpsDetails || ""}
                    />
                  </Box>
                )}
              </Box>
              <Box mt={3}>
                <CommonNoteCard
                  title="Do you have any concerns regarding your medication?"
                  rows={1}
                  placeholder="Please provide details..."
                  value={carePlanData?.medicationConcerns || ""}
                />
              </Box>
              <Box mt={3}>
                <CommonNoteCard
                  title="What level of medication support do you need?"
                  rows={1}
                  placeholder="Please provide details..."
                  value={carePlanData?.medicationSupportLevel || ""}
                />
              </Box>
              <Box mt={3}>
                <Typography variant="body1" fontWeight={500}>
                  Is your medication in blister packs or boxes?
                </Typography>
                <Box mt={2}>
                  <CommonChip
                    title={
                      carePlanData?.blisterPackOrBox === true
                        ? "Yes"
                        : carePlanData?.blisterPackOrBox === false
                        ? "No"
                        : "N/A"
                    }
                    variant="primary"
                    style={{
                      backgroundColor: theme?.palette?.common?.white,
                      border: `1px solid ${theme.ShadowAndBorder.border2}`,
                    }}
                    textStyle={{ fontSize: "15px" }}
                  />
                </Box>

                <Box>
                  <Typography mt={2} variant="body1">
                    If yes, please describe
                  </Typography>
                  <CommonNoteCard
                    rows={1}
                    placeholder="Please provide details..."
                    value="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
                  />
                </Box>
              </Box>
              <Box mt={3}>
                <Typography variant="subtitle1" fontWeight={500}>
                  Do you pay for your medication deliveries, and how has this
                  been arranged?
                </Typography>
                <Box mt={2}>
                  <CommonChip
                    title={
                      carePlanData?.payForMedicationDelivery === true
                        ? "Yes"
                        : carePlanData?.payForMedicationDelivery === false
                        ? "No"
                        : "N/A"
                    }
                    variant="primary"
                    style={{
                      backgroundColor: theme?.palette?.common?.white,
                      border: `1px solid ${theme.ShadowAndBorder.border2}`,
                    }}
                    textStyle={{ fontSize: "15px" }}
                  />
                </Box>
                {carePlanData?.payForMedicationDelivery === true && (
                  <Box>
                    <Typography mt={2} variant="body1">
                      If yes, please describe
                    </Typography>
                    <CommonNoteCard
                      rows={1}
                      placeholder="Please provide details..."
                      value={carePlanData?.paymentDetails || ""}
                    />
                  </Box>
                )}
              </Box>
              <Box mt={3}>
                <CommonNoteCard
                  title="Have you ever had a reaction to any medication?"
                  rows={1}
                  placeholder="Please provide details..."
                  value={carePlanData?.medicationReactions || ""}
                />
              </Box>
              <Box mt={3}>
                <Typography variant="body1" fontWeight={500}>
                  Have you ever taken an overdose?
                </Typography>
                <Box mt={2}>
                  <CommonChip
                    title={
                      carePlanData?.overdoseHistory === true
                        ? "Yes"
                        : carePlanData?.overdoseHistory === false
                        ? "No"
                        : "N/A"
                    }
                    variant="primary"
                    style={{
                      backgroundColor: theme?.palette?.common?.white,
                      border: `1px solid ${theme.ShadowAndBorder.border2}`,
                    }}
                    textStyle={{ fontSize: "15px" }}
                  />
                </Box>
                {carePlanData?.overdoseHistory === true && (
                  <Box>
                    <Typography mt={2} variant="body1">
                      If yes, please describe
                    </Typography>
                    <CommonNoteCard
                      rows={1}
                      placeholder="Please provide details..."
                      value={carePlanData?.overdoseDetails || ""}
                    />
                  </Box>
                )}
              </Box>
              <Box mt={3}>
                <CommonNoteCard
                  title="Do you ever miss taking your medication?"
                  rows={1}
                  placeholder="Please provide details..."
                  value={carePlanData?.missedMedsDetails || ""}
                />
              </Box>
            </CommonCard>
          </Box>
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 6 }}>
          {/* Care preferences */}
          <Box mt={4}>
            <CommonCard>
              <Typography variant="body1" fontWeight={500}>
                Care preferences
              </Typography>
              <Divider sx={{ mt: 1 }} />
              <Box mt={3}>
                <CommonNoteCard
                  title="What are my reasons for needing caregiver support?"
                  rows={1}
                  value={carePlanData?.carePreferences || ""}
                  placeholder="Please provide details..."
                />
                <Box mt={3}>
                  <CommonNoteCard
                    title="When caregivers visit, it’s important that they…"
                    rows={1}
                    value={carePlanData?.caregivervisitInfo || ""}
                    placeholder="Please provide details..."
                  />
                </Box>
                <Box mt={3}>
                  <CommonNoteCard
                    title="It is important that staff communicate with me in the following way..."
                    rows={1}
                    value={carePlanData?.careCommunicationPreference || ""}
                    placeholder="Please provide details..."
                  />
                </Box>
                <Box mt={3}>
                  <CommonNoteCard
                    title="Things that I don't like..."
                    rows={1}
                    value={carePlanData?.dislikes || ""}
                    placeholder="Please provide details..."
                  />
                </Box>
              </Box>
            </CommonCard>
          </Box>
          {/* My background */}
          <Box mt={4}>
            <CommonCard>
              <Typography variant="h6" fontWeight={500}>
                My background
              </Typography>
              <Divider sx={{ mt: 1 }} />
              <Box mt={4}>
                <CommonNoteCard
                  title="My history"
                  rows={1}
                  value={carePlanData?.backgroundHistory || ""}
                  placeholder="Please provide details..."
                />
              </Box>
            </CommonCard>
          </Box>
          {/* Hydration & nutrition */}
          <Box mt={4}>
            <CommonCard>
              <Typography variant="body1" fontWeight={500}>
                Hydration & nutrition
              </Typography>
              <Divider sx={{ mt: 1 }} />
              <Box mt={4}>
                <CommonNoteCard
                  title="How can caregivers help you stay hydrated?"
                  placeholder="Please provide details..."
                  rows={1}
                  value={carePlanData?.hydrationSupport || "N/A"}
                />
              </Box>
              <Box mt={4}>
                <CommonNoteCard
                  title="How should caregivers support you with swallowing difficulties?"
                  placeholder="Please provider details..."
                  rows={1}
                  value={carePlanData?.swallowingSupport || ""}
                />
              </Box>
              <Box mt={4}>
                <Typography variant="subtitle1" fontWeight={500}>
                  Do you have any swallowing difficulties or choking hazards?
                </Typography>
                <Box mt={2}>
                  <CommonChip
                    title={
                      carePlanData?.swallowingDifficulties === true
                        ? "Yes"
                        : carePlanData?.swallowingDifficulties === false
                        ? "No"
                        : "N/A"
                    }
                    variant="primary"
                    style={{
                      backgroundColor: theme?.palette?.common?.white,
                      border: `1px solid ${theme.ShadowAndBorder.border2}`,
                    }}
                    textStyle={{ fontSize: "15px" }}
                  />
                </Box>
                {carePlanData?.swallowingDifficulties === true && (
                  <Box>
                    <Typography mt={2} variant="body1">
                      If yes, please describe
                    </Typography>
                    <CommonNoteCard
                      rows={1}
                      placeholder="Please provide details..."
                      value={carePlanData?.swallowingDetails || ""}
                    />
                  </Box>
                )}
              </Box>
              <Box mt={4}>
                <CommonNoteCard
                  title="Where do you prefer to have your meals at home?"
                  placeholder="Please provide details..."
                  rows={1}
                  value={carePlanData?.mealLocationPreference || ""}
                />
              </Box>
              <Box mt={4}>
                <CommonNoteCard
                  title="What prescribed supplements are you taking, and how often should they be given?"
                  placeholder="Please provide details..."
                  rows={1}
                  value={carePlanData?.prescribedSupplements || ""}
                />
              </Box>
            </CommonCard>
          </Box>
          {/* Hearing & Vision */}
          <Box mt={4}>
            <CommonCard>
              <Typography variant="body1" fontWeight={500}>
                Hearing & vision
              </Typography>
              <Divider sx={{ mt: 1 }} />
              <Box mt={3}>
                <Typography variant="subtitle1" fontWeight={500}>
                  Do you have any hearing issues?
                </Typography>
                <Box mt={2}>
                  <CommonChip
                    title={
                      carePlanData?.hearingIssues === true
                        ? "Yes"
                        : carePlanData?.hearingIssues === false
                        ? "No"
                        : "N/A"
                    }
                    variant="primary"
                    style={{
                      backgroundColor: theme?.palette?.common?.white,
                      border: `1px solid ${theme.ShadowAndBorder.border2}`,
                    }}
                    textStyle={{ fontSize: "15px" }}
                  />
                </Box>
                {carePlanData?.hearingIssues === true && (
                  <Box>
                    <Typography mt={2} variant="body1">
                      If yes, please describe
                    </Typography>
                    <CommonNoteCard
                      rows={1}
                      placeholder="Please provide details..."
                      value={carePlanData?.hearingDetails || ""}
                    />
                  </Box>
                )}
              </Box>
              <Box mt={3}>
                <CommonNoteCard
                  title="Are your hearing aids in good working order, and do you have a sufficient supply of batteries?"
                  rows={1}
                  placeholder="Please provide details..."
                  value={carePlanData?.hearingAidMaintenance || ""}
                />
              </Box>
              <Box mt={3}>
                <Typography variant="body1" fontWeight={500}>
                  Do you wear glasses? If so, how should caregivers assist with
                  them?
                </Typography>
                <Box mt={2}>
                  <CommonChip
                    title={
                      carePlanData?.usesGlasses === true
                        ? "Yes"
                        : carePlanData?.usesGlasses === false
                        ? "No"
                        : "N/A"
                    }
                    variant="primary"
                    style={{
                      backgroundColor: theme?.palette?.common?.white,
                      border: `1px solid ${theme.ShadowAndBorder.border2}`,
                    }}
                    textStyle={{ fontSize: "15px" }}
                  />
                </Box>
                {carePlanData?.usesGlasses === true && (
                  <Box>
                    <Typography mt={2} variant="body1">
                      If yes, please describe
                    </Typography>
                    <CommonNoteCard
                      rows={1}
                      placeholder="Please provide details..."
                      value={carePlanData?.glassesSupport || ""}
                    />
                  </Box>
                )}
              </Box>
              <Box mt={3}>
                <Typography variant="body1" fontWeight={500}>
                  Do you use hearing aids? If so, do you need help with them?
                </Typography>
                <Box mt={2}>
                  <CommonChip
                    title={
                      carePlanData?.needHearingAid === true
                        ? "Yes"
                        : carePlanData?.needHearingAid === false
                        ? "No"
                        : "N/A"
                    }
                    variant="primary"
                    style={{
                      backgroundColor: theme?.palette?.common?.white,
                      border: `1px solid ${theme.ShadowAndBorder.border2}`,
                    }}
                    textStyle={{ fontSize: "15px" }}
                  />
                </Box>
                {carePlanData?.needHearingAid === true && (
                  <Box>
                    <Typography mt={2} variant="body1">
                      If yes, please describe
                    </Typography>
                    <CommonNoteCard
                      rows={1}
                      placeholder="Please provide details..."
                      value={carePlanData?.hearingAidSupport || ""}
                    />
                  </Box>
                )}
              </Box>
              <Box mt={3}>
                <CommonCard sx={{ padding: "0px !important" }}>
                  <Typography variant="subtitle1" fontWeight={500}>
                    Do you have any vision issues?
                  </Typography>
                  <Box mt={2}>
                    <CommonChip
                      title={
                        carePlanData?.visionIssues === true
                          ? "Yes"
                          : carePlanData?.visionIssues === false
                          ? "No"
                          : "N/A"
                      }
                      variant="primary"
                      style={{
                        backgroundColor: theme?.palette?.common?.white,
                        border: `1px solid ${theme.ShadowAndBorder.border2}`,
                      }}
                      textStyle={{ fontSize: "15px" }}
                    />
                  </Box>
                  {carePlanData?.visionIssues === true && (
                    <>
                      <Typography
                        sx={{
                          margin: "20px 0px 10px 0px",
                          fontSize: "15px",
                        }}
                      >
                        If yes, please describe
                      </Typography>
                      <Box>
                        <CommonNoteCard
                          rows={1}
                          placeholder="Please provide details..."
                          value={carePlanData?.visionDetails || ""}
                        />
                      </Box>
                    </>
                  )}
                </CommonCard>
              </Box>
              <Box mt={3}>
                <CommonNoteCard
                  title="What is your sight diagnosis?"
                  placeholder="Please provide details..."
                  rows={1}
                  value={carePlanData?.sightDiagnosis || ""}
                />
              </Box>
            </CommonCard>
          </Box>
          {/* Speech & oral care */}
          <Box mt={4}>
            <CommonCard>
              <Typography variant="body1" fontWeight={500}>
                Speech & oral care
              </Typography>
              <Divider sx={{ mt: 1 }} />
              <Box mt={3}>
                <Typography variant="subtitle1" fontWeight={500}>
                  Do you have any speech issues?
                </Typography>
                <Box mt={2}>
                  <CommonChip
                    title={
                      carePlanData?.speechIssues === true
                        ? "Yes"
                        : carePlanData?.speechIssues === false
                        ? "No"
                        : "N/A"
                    }
                    variant="primary"
                    style={{
                      backgroundColor: theme?.palette?.common?.white,
                      border: `1px solid ${theme.ShadowAndBorder.border2}`,
                    }}
                    textStyle={{ fontSize: "15px" }}
                  />
                </Box>
                {carePlanData?.speechIssues === true && (
                  <Box>
                    <Typography mt={2} variant="body1">
                      If yes, please describe
                    </Typography>
                    <CommonNoteCard
                      rows={1}
                      placeholder="Please provide details..."
                      value={carePlanData?.speechIssueDetails || ""}
                    />
                  </Box>
                )}
              </Box>
              <Box mt={3}>
                <Typography variant="subtitle1" fontWeight={500}>
                  Do you have any mouth ulcers or red/white patches?
                </Typography>
                <Box mt={2}>
                  <CommonChip
                    title={
                      carePlanData?.haveMouthUlcers === true
                        ? "Yes"
                        : carePlanData?.haveMouthUlcers === false
                        ? "No"
                        : "N/A"
                    }
                    variant="primary"
                    style={{
                      backgroundColor: theme?.palette?.common?.white,
                      border: `1px solid ${theme.ShadowAndBorder.border2}`,
                    }}
                    textStyle={{ fontSize: "15px" }}
                  />
                </Box>
                {carePlanData?.haveMouthUlcers === true && (
                  <Box>
                    <Typography mt={2} variant="body1">
                      If yes, please describe
                    </Typography>
                    <CommonNoteCard
                      rows={1}
                      placeholder="Please provide details..."
                      value={carePlanData?.mouthUlcersDetails || ""}
                    />
                  </Box>
                )}
              </Box>
              <Box mt={3}>
                <CommonNoteCard
                  title="How should caregivers support you with speech difficulties?"
                  placeholder="Please provide details..."
                  rows={1}
                  value={carePlanData?.speechSupport || ""}
                />
              </Box>
              <Box mt={3}>
                <Typography variant="subtitle1" fontWeight={500}>
                  Is your tongue coated or your mouth dry?
                </Typography>
                <Box mt={2}>
                  <CommonChip
                    title={
                      carePlanData?.dryMouthOrCoatedTongue === true
                        ? "Yes"
                        : carePlanData?.dryMouthOrCoatedTongue === false
                        ? "No"
                        : "N/A"
                    }
                    variant="primary"
                    style={{
                      backgroundColor: theme?.palette?.common?.white,
                      border: `1px solid ${theme.ShadowAndBorder.border2}`,
                    }}
                    textStyle={{ fontSize: "15px" }}
                  />
                </Box>
                {carePlanData?.dryMouthOrCoatedTongue === true && (
                  <Box>
                    <Typography mt={2} variant="body1">
                      If yes, please describe
                    </Typography>
                    <CommonNoteCard
                      rows={1}
                      placeholder="Please provide details..."
                      value="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
                    />
                  </Box>
                )}
              </Box>
              <Box mt={3}>
                <Typography variant="subtitle1" fontWeight={500}>
                  {`Do you have any broken teeth, and what’s been done about them?`}
                </Typography>
                <Box mt={2}>
                  <CommonChip
                    title={
                      carePlanData?.brokenTeeth === true
                        ? "Yes"
                        : carePlanData?.brokenTeeth === false
                        ? "No"
                        : "N/A"
                    }
                    variant="primary"
                    style={{
                      backgroundColor: theme?.palette?.common?.white,
                      border: `1px solid ${theme.ShadowAndBorder.border2}`,
                    }}
                    textStyle={{ fontSize: "15px" }}
                  />
                </Box>
                {carePlanData?.brokenTeeth === true && (
                  <Box>
                    <Typography mt={2} variant="body1">
                      If yes, please describe
                    </Typography>
                    <CommonNoteCard
                      rows={1}
                      placeholder="Please provide details..."
                      value={carePlanData?.brokenTeethDetails || ""}
                    />
                  </Box>
                )}
              </Box>
              <Box mt={3}>
                <CommonNoteCard
                  title="How do you prefer your teeth to be cleaned, and what products should caregivers use?"
                  rows={1}
                  placeholder="Please provide details..."
                  value={carePlanData?.oralCarePreferences || ""}
                />
              </Box>
            </CommonCard>
          </Box>
          {/*  Access & Safety */}
          <Box mt={4}>
            <CommonCard>
              <Typography fontSize={"15px"} fontWeight={500}>
                Access & Safety
              </Typography>
              <Divider sx={{ mt: 1 }} />
              <Typography mt={4} variant="subtitle1" fontWeight={500}>
                Do you have any special arrangements for people to access your
                property?
              </Typography>
              <Box mt={2}>
                <CommonChip
                  title={
                    carePlanData?.specialAccess === true
                      ? "Yes"
                      : carePlanData?.specialAccess === false
                      ? "No"
                      : "N/A"
                  }
                  variant="primary"
                  style={{
                    backgroundColor: theme?.palette?.common?.white,
                    border: `1px solid ${theme.ShadowAndBorder.border2}`,
                  }}
                  textStyle={{ fontSize: "15px" }}
                />
              </Box>
              {carePlanData?.specialAccess === true && (
                <>
                  <Typography
                    sx={{ margin: "20px 0px 10px 0px", fontSize: "15px" }}
                  >
                    If yes, please describe
                  </Typography>

                  <Box>
                    <CommonNoteCard
                      rows={1}
                      placeholder="Please provide details..."
                      value={carePlanData?.accessDetails || ""}
                    />
                  </Box>
                </>
              )}
            </CommonCard>
          </Box>
          {/*  Sign off */}
          <Box mt={4}>
            <CommonCard>
              <Typography variant="h6" fontWeight={500}>
                Sign off
              </Typography>
              <Divider sx={{ mt: 1 }} />

              <Box mt={2}>
                <Typography variant="body1" fontWeight={400}>
                  Type your name
                </Typography>
                <StyledBox mt={1}>
                  <Image
                    src={
                      carePlanData?.signatureImage
                        ? `${process.env.NEXT_PUBLIC_ASSETS_URL}/${carePlanData?.signatureImage}`
                        : "/assets/svg/carers/verifications/signature.svg"
                    }
                    height={30}
                    width={100}
                    alt="signature"
                  />
                </StyledBox>
                <Typography
                  sx={{ margin: "20px 0px 30px 0px !important" }}
                  variant="caption"
                  fontWeight={400}
                >
                  Date of signature:{" "}
                  {moment(carePlanData?.signatureDate).format("Do MMMM YYYY")}
                </Typography>
              </Box>

              <Box mt={2}>
                <Typography variant="body1" fontWeight={400}>
                  Print name:
                </Typography>
                <StyledBox>
                  <Typography variant="body1" fontWeight={400}>
                    {carePlanData?.signedBy}
                  </Typography>
                </StyledBox>
              </Box>
              <Box mt={2}>
                <Typography variant="body1" fontWeight={400}>
                  Relationship to client if client unable to sign
                </Typography>
                <StyledBox>
                  <Typography variant="body1" fontWeight={400}>
                    {carePlanData?.relationShipToClient || "N/A"}
                  </Typography>
                </StyledBox>
              </Box>
              <Box
                sx={{
                  marginTop: "33px",
                  display: "flex",
                }}
              >
                <Box sx={{ cursor: "pointer", display: "inline-block" }}>
                  {isCheck ? (
                    <Box
                      sx={{
                        height: "30px",
                        width: "30px",
                        border: "1px solid black",
                        borderRadius: "5px",
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
                </Box>
                <Typography
                  sx={{
                    marginLeft: "20px",
                    fontSize: "12px",
                    lineHeight: "16px",
                    textAlign: "justify",
                  }}
                >
                  I agree to the above care plan support sheet and agree the
                  tasks listed reflect my care needs with the agreed visit
                </Typography>
              </Box>
            </CommonCard>
          </Box>
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default CarePlan;
