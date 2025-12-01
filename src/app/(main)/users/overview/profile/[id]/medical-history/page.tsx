"use client";
import React, { useEffect, useState } from "react";
import moment from "moment";
import {
  Box,
  Divider,
  Grid2,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import CheckIcon from "@mui/icons-material/Check";
//relative path imports
import CommonCard from "@/components/Cards/Common";
import { getClientMedicalHistory } from "@/services/api/usersApi";
import {
  Dosage,
  ImmunisationStatus,
  Recurrence,
  TreatmentDuration,
} from "@/constants/medicalHistoryData";
import { UserInfoResponse } from "@/types/singleUserInfoType";


interface Medication {
  name: string;
  dosage: number | null;
  dosageCustom: string | null;
  recurrence: number | null;
  recurrenceCustom: string | null;
  treatmentDuration: number | null;
  treatmentDurationCustom: string | null;
  startDate: string;
  isActive: boolean;
  isMedicationRemove: boolean;
  endDate: string | null;
}

interface MedicalConditions {
  name: string;
  customConditionName: string;
  conditionBegin: string;
  treatmentName: string;
  treatmentFrequency: string;
  treatmentDuration: string;
}

interface AcuteConditions {
  name: string;
  customConditionName: string;
  conditionBegin: string;
  treatmentName: string;
  treatmentFrequency: string;
  treatmentDuration: string;
}

interface MobilityIssues {
  name: string;
  customMobilityName: string;
  requiresAssistance: string;
  mobilityAids: string;
  hasSpecialEquipment: string;
  customSpecialEquipment: string;
  requiresOxygenTherapy: string;
  usesHospitalBed: boolean;
  otherSpecialEquipment: string;
}

interface Immunisations {
  name: string;
  dateOfImmunisation: string;
  healthcareProvider: string;
  vaccineBatchNumber: string;
  immunisationStatus: number;
  nextDoseDue: string;
}

interface FamilyHistory {
  hasMajorMedicalHistory: boolean;
  majorMedicalDetails: string;
  hasGeneticHistory: boolean;
  geneticConditionDetails: string;
}

interface SpecialCareNeeds {
  specificNeedsDetails: string;
  needsMobilityAssistance: boolean;
  needsMedicationHelp: boolean;
  specialEquipmentDetails: string;
  needsDailyLivingAssistance: boolean;
}

interface MedicalHistoryData {
  _id: string;
  userId: string;
  userType: string;
  hasAllergies: boolean;
  allergies: string[];
  takesMedication: boolean;
  medications: Medication[];
  hasMedicalConditions: boolean;
  medicalConditions: MedicalConditions;
  acuteConditions: AcuteConditions;
  hasMobilityIssues: boolean;
  mobilityIssues: MobilityIssues;
  smoker: boolean;
  pets: boolean;
  petDetails: string;
  dietaryRestrictions: string;
  immunisations: Immunisations;
  familyHistory: FamilyHistory;
  specialCareNeeds: SpecialCareNeeds;
  consentProvided: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface MedicalHistoryResponse {
  data: {
    success: boolean;
    data: MedicalHistoryData;
  };
}

const StyledBox = styled(Box)(({ theme }) => ({
  border: `1px solid ${theme.pending.secondary}`,
  padding: "10px 20px",
  borderRadius: "10px",
  display: "flex",
  alignItems: "center",
}));

const MedicalHistory = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [medicalHistoryData, setMedicalHistoryData] =
    useState<MedicalHistoryData>();
  const [userInfo, setUserInfo] = useState<
    UserInfoResponse["data"]["data"] | null
  >(null);

  const fetchMedicalHistory = async (id: string) => {
    try {
      const response = (await getClientMedicalHistory(
        id
      )) as MedicalHistoryResponse;
      if (response?.data?.success) {
        setMedicalHistoryData(response?.data?.data);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    const clientData = localStorage.getItem("Selecteduser");
    if (clientData) {
      try {
        const parsedData = JSON.parse(clientData);
        setUserInfo(parsedData);
      } catch (error) {
        console.error("Invalid JSON:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (userInfo?.userId) {
      fetchMedicalHistory(userInfo?.userId);
    }
  }, [userInfo]);


  return (
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
              Medical history
            </Typography>
            <Typography variant="caption" fontWeight={400}>
              Medical history You are currently previewing the medical history
              created by Reuben Hale. Please find the details below.
            </Typography>
          </Box>
          <Box mt={isMobile ? 2 : 0}>
            <Typography variant="caption">Last updated</Typography>
            <Typography component={"p"} variant="caption" fontWeight={500}>
              {moment(medicalHistoryData?.updatedAt).calendar()}
            </Typography>
          </Box>
        </Stack>
      </CommonCard>

      <Grid2 container spacing={2}>
        <Grid2 size={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 6 }}>
          <Box mt={4}>
            <CommonCard>
              <Typography variant="h6" fontWeight={500} fontSize={"18px"}>
                Allergies
              </Typography>
              <Box
                sx={{
                  padding: "23px 19px",
                  border: `1px solid ${theme?.ShadowAndBorder.border2}`,
                  borderRadius: "10px",
                  mt: 2,
                }}
              >
                <Stack
                  mt={2}
                  flexDirection={"row"}
                  gap={2}
                  alignItems={"center"}
                >
                  {!medicalHistoryData?.hasAllergies ? (
                    <Box
                      sx={{
                        height: "26px",
                        width: "26px",
                        border: "1px solid black",
                        borderRadius: "5px",
                      }}
                    />
                  ) : (
                    <Box
                      sx={{
                        height: "26px",
                        width: "26px",
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
                  <Typography variant="body1" fontWeight={400}>
                    {medicalHistoryData?.hasAllergies === true
                      ? "Yes"
                      : medicalHistoryData?.hasAllergies === false
                      ? "No"
                      : "N/A"}
                  </Typography>
                </Stack>
                {medicalHistoryData?.allergies &&
                  medicalHistoryData?.allergies?.length > 0 && (
                    <Box
                      sx={{
                        padding: "19px",
                        border: `1px solid ${theme?.ShadowAndBorder.border2}`,
                        borderRadius: "10px",
                        mt: 2,
                      }}
                    >
                      <Stack flexDirection={"column"} gap={1}>
                        {medicalHistoryData?.allergies.map((allergy) => (
                          <Typography
                            key={allergy}
                            variant="body1"
                            fontWeight={400}
                          >
                            {allergy}
                          </Typography>
                        ))}
                      </Stack>
                    </Box>
                  )}
              </Box>
              {/* Medication */}
              <Box mt={4}>
                <Typography variant="h6" fontWeight={500} fontSize={"18px"}>
                  Medication
                </Typography>
                <Box
                  sx={{
                    padding: "23px 19px",
                    border: `1px solid ${theme?.ShadowAndBorder.border2}`,
                    borderRadius: "10px",
                    mt: 2,
                  }}
                >
                  <Stack
                    mt={2}
                    flexDirection={"row"}
                    gap={2}
                    alignItems={"center"}
                  >
                    {!medicalHistoryData?.takesMedication ? (
                      <Box
                        sx={{
                          height: "26px",
                          width: "26px",
                          border: "1px solid black",
                          borderRadius: "5px",
                        }}
                      />
                    ) : (
                      <Box
                        sx={{
                          height: "26px",
                          width: "26px",
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
                    <Typography variant="body1" fontWeight={400}>
                      {medicalHistoryData?.takesMedication === true
                        ? "Yes"
                        : medicalHistoryData?.takesMedication === false
                        ? "No"
                        : "N/A"}
                    </Typography>
                  </Stack>
                  {medicalHistoryData?.medications &&
                    medicalHistoryData?.medications?.length > 0 && (
                      <Box
                        sx={{
                          padding: "19px",
                          border: `1px solid ${theme?.ShadowAndBorder.border2}`,
                          borderRadius: "10px",
                          mt: 2,
                        }}
                      >
                        <Stack flexDirection={"column"} gap={1}>
                          {medicalHistoryData?.medications.map((med, index) => {
                            const title = [
                              med.name,
                              med.dosageCustom ??
                                (med.dosage !== null && med.dosage !== undefined
                                  ? `${Dosage[med.dosage]}`
                                  : null),
                              med.recurrenceCustom ??
                                (med.recurrence !== null &&
                                med.recurrence !== undefined
                                  ? `${Recurrence[med.recurrence]}`
                                  : null),
                              med.treatmentDurationCustom ??
                                (med.treatmentDuration !== null &&
                                med.treatmentDuration !== undefined
                                  ? `${
                                      TreatmentDuration[med.treatmentDuration]
                                    }`
                                  : null),
                            ]
                              .filter(Boolean)
                              .join(" • ");
                            return (
                              <>
                                <Typography
                                  key={`${med.name}-${index}`}
                                  variant="body1"
                                  fontWeight={400}
                                >
                                  {title}
                                </Typography>
                                <Divider sx={{ marginBlock: 1 }} />
                              </>
                            );
                          })}
                        </Stack>
                      </Box>
                    )}
                </Box>
              </Box>
              {/* Medical Conditions */}
              <Box mt={4}>
                <Typography variant="h6" fontWeight={500}>
                  Medical conditions
                </Typography>
                <Box
                  sx={{
                    padding: "23px 19px",
                    border: `1px solid ${theme?.ShadowAndBorder.border2}`,
                    borderRadius: "10px",
                    mt: 2,
                  }}
                >
                  <Typography variant="body1" fontWeight={400}>
                    Do they have any medical conditions?
                  </Typography>
                  <Stack
                    mt={2}
                    flexDirection={"row"}
                    gap={2}
                    alignItems={"center"}
                  >
                    {!medicalHistoryData?.hasMedicalConditions ? (
                      <Box
                        sx={{
                          height: "26px",
                          width: "26px",
                          border: "1px solid black",
                          borderRadius: "5px",
                        }}
                      />
                    ) : (
                      <Box
                        sx={{
                          height: "26px",
                          width: "26px",
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
                    <Typography variant="body1" fontWeight={400}>
                      {medicalHistoryData?.hasMedicalConditions === true
                        ? "Yes"
                        : medicalHistoryData?.hasMedicalConditions === false
                        ? "No"
                        : "N/A"}
                    </Typography>
                  </Stack>
                  <Box
                    sx={{
                      padding: "19px",
                      border: `1px solid ${theme?.ShadowAndBorder.border2}`,
                      borderRadius: "10px",
                      mt: 2,
                    }}
                  >
                    <Stack flexDirection={"column"} gap={1}>
                      <Typography variant="body1" fontWeight={500}>
                        Medical Condition:
                      </Typography>
                      <Typography variant="body1" fontWeight={400}>
                        {medicalHistoryData?.medicalConditions?.name || "N/A"}
                      </Typography>
                      <Typography variant="body1" fontWeight={500} mt={1}>
                        Special at home equipment:
                      </Typography>
                      <Typography variant="body1" fontWeight={400}>
                        {medicalHistoryData?.medicalConditions?.name || "N/A"}
                      </Typography>
                    </Stack>
                  </Box>
                  <Typography
                    variant="body1"
                    textAlign={"right"}
                    mt={2}
                    fontWeight={400}
                  >
                    View more info
                  </Typography>
                </Box>
              </Box>
              <Box mt={4}>
                <Typography variant="h6" fontWeight={500}>
                  Mobility and accessibility
                </Typography>
                <Box
                  sx={{
                    padding: "23px 19px",
                    border: `1px solid ${theme?.ShadowAndBorder.border2}`,
                    borderRadius: "10px",
                    mt: 2,
                  }}
                >
                  <Typography variant="body1" fontWeight={400}>
                    Any issues with mobility?
                  </Typography>
                  <Stack
                    mt={2}
                    flexDirection={"row"}
                    gap={2}
                    alignItems={"center"}
                  >
                    {!medicalHistoryData?.hasMobilityIssues ? (
                      <Box
                        sx={{
                          height: "26px",
                          width: "26px",
                          border: "1px solid black",
                          borderRadius: "5px",
                        }}
                      />
                    ) : (
                      <Box
                        sx={{
                          height: "26px",
                          width: "26px",
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
                    <Typography variant="body1" fontWeight={400}>
                      {medicalHistoryData?.hasMobilityIssues === true
                        ? "Yes"
                        : medicalHistoryData?.hasMobilityIssues === false
                        ? "No"
                        : "N/A"}
                    </Typography>
                  </Stack>
                  <Box
                    sx={{
                      padding: "19px",
                      border: `1px solid ${theme?.ShadowAndBorder.border2}`,
                      borderRadius: "10px",
                      mt: 2,
                    }}
                  >
                    <Stack flexDirection={"column"} gap={1}>
                      <Typography variant="body1" fontWeight={500}>
                        Mobility issue:
                      </Typography>
                      <Typography variant="body1" fontWeight={400}>
                        {medicalHistoryData?.mobilityIssues?.name || "N/A"}
                      </Typography>
                      <Typography variant="body1" fontWeight={500} mt={1}>
                        Acute Condition:
                      </Typography>
                      <Typography variant="body1" fontWeight={400}>
                        {medicalHistoryData?.acuteConditions?.name || "N/A"}
                      </Typography>
                    </Stack>
                  </Box>
                  <Typography
                    variant="body1"
                    textAlign={"right"}
                    mt={2}
                    fontWeight={400}
                  >
                    View more info
                  </Typography>
                </Box>
              </Box>
            </CommonCard>
          </Box>
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 6 }}>
          <Box mt={4}>
            <CommonCard>
              {/* Lifestyle and Habits */}
              <Box>
                <Typography variant="h6" fontWeight={500}>
                  Lifestyle and habits
                </Typography>
                <Box
                  sx={{
                    padding: "23px 19px",
                    border: `1px solid ${theme?.ShadowAndBorder.border2}`,
                    borderRadius: "10px",
                    mt: 2,
                  }}
                >
                  <Typography variant="body1" fontWeight={400}>
                    Do you smoke?
                  </Typography>
                  <Stack
                    mt={2}
                    flexDirection={"row"}
                    gap={2}
                    alignItems={"center"}
                  >
                    {!medicalHistoryData?.smoker ? (
                      <Box
                        sx={{
                          height: "26px",
                          width: "26px",
                          border: "1px solid black",
                          borderRadius: "5px",
                        }}
                      />
                    ) : (
                      <Box
                        sx={{
                          height: "26px",
                          width: "26px",
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
                    <Typography variant="body1" fontWeight={400}>
                      {medicalHistoryData?.smoker === true
                        ? "Yes"
                        : medicalHistoryData?.smoker === false
                        ? "No"
                        : "N/A"}
                    </Typography>
                  </Stack>
                  <Typography mt={3} variant="body1" fontWeight={400}>
                    Do you live with pets?
                  </Typography>
                  <Stack
                    mt={2}
                    flexDirection={"row"}
                    gap={2}
                    alignItems={"center"}
                  >
                    {!medicalHistoryData?.pets ? (
                      <Box
                        sx={{
                          height: "26px",
                          width: "26px",
                          border: "1px solid black",
                          borderRadius: "5px",
                        }}
                      />
                    ) : (
                      <Box
                        sx={{
                          height: "26px",
                          width: "26px",
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
                    <Typography variant="body1" fontWeight={400}>
                      {medicalHistoryData?.pets === true
                        ? "Yes"
                        : medicalHistoryData?.pets === false
                        ? "No"
                        : "N/A"}
                    </Typography>
                  </Stack>
                  <Box mt={2}>
                    <StyledBox>
                      <Typography
                        variant="body1"
                        fontWeight={400}
                        minHeight={"30px"}
                      >
                        {medicalHistoryData?.petDetails}
                      </Typography>
                    </StyledBox>
                  </Box>
                  <Box mt={3}>
                    <Typography variant="h6" fontWeight={400}>
                      Dietary restrictions?
                    </Typography>
                    <StyledBox mt={1}>
                      <Typography
                        variant="body1"
                        fontWeight={400}
                        minHeight={"30px"}
                      >
                        {medicalHistoryData?.dietaryRestrictions}
                      </Typography>
                    </StyledBox>
                  </Box>
                </Box>
                <Box mt={3}>
                  <Typography variant="body1" fontWeight={500}>
                    Immunisation records
                  </Typography>
                  <Box
                    sx={{
                      padding: "23px 19px",
                      border: `1px solid ${theme?.ShadowAndBorder.border2}`,
                      borderRadius: "10px",
                      mt: 2,
                    }}
                  >
                    <Typography variant="h6" fontWeight={500}>
                      {medicalHistoryData?.immunisations?.name || "N/A"}
                    </Typography>
                    <Box mt={1}>
                      <Typography variant="body1" fontWeight={400}>
                        Date of immunisation:{" "}
                        {medicalHistoryData?.immunisations?.dateOfImmunisation
                          ? moment(
                              medicalHistoryData?.immunisations
                                ?.dateOfImmunisation
                            ).format("DD/MM/YYYY")
                          : "N/A"}
                      </Typography>
                      <Typography variant="body1" fontWeight={400}>
                        Healthcare provider/clinic:{" "}
                        {medicalHistoryData?.immunisations?.healthcareProvider
                          ? medicalHistoryData?.immunisations
                              ?.healthcareProvider
                          : "N/A"}
                      </Typography>
                      <Typography variant="body1" fontWeight={400}>
                        Batch Number:{" "}
                        {medicalHistoryData?.immunisations?.vaccineBatchNumber
                          ? medicalHistoryData?.immunisations
                              ?.vaccineBatchNumber
                          : "N/A"}
                      </Typography>
                      <Typography variant="body1" fontWeight={400}>
                        Immunisation status:{" "}
                        {medicalHistoryData?.immunisations?.immunisationStatus
                          ? ImmunisationStatus[
                              medicalHistoryData?.immunisations
                                ?.immunisationStatus
                            ]
                          : "N/A"}
                      </Typography>
                      <Typography variant="body1" fontWeight={400}>
                        Next dose due:{" "}
                        {medicalHistoryData?.immunisations?.nextDoseDue
                          ? moment(
                              medicalHistoryData?.immunisations?.nextDoseDue
                            ).format("DD/MM/YYYY")
                          : "N/A"}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <Box mt={3}>
                  <Typography variant="body1" fontWeight={500}>
                    Relevant family history
                  </Typography>
                  <Box
                    sx={{
                      padding: "23px 19px",
                      border: `1px solid ${theme?.ShadowAndBorder.border2}`,
                      borderRadius: "10px",
                      mt: 2,
                    }}
                  >
                    {" "}
                    <Typography variant="body1" fontWeight={500}>
                      Major health conditions?
                    </Typography>
                    <Typography variant="body1" mt={1} fontWeight={500}>
                      {medicalHistoryData?.familyHistory
                        ?.hasMajorMedicalHistory === true
                        ? "Yes"
                        : medicalHistoryData?.familyHistory
                            ?.hasMajorMedicalHistory === false
                        ? "No"
                        : "N/A"}
                    </Typography>
                    <Typography variant="body1" mt={1} fontWeight={500}>
                      Details:
                    </Typography>
                    <Typography variant="body1" mt={1} fontWeight={500}>
                      {medicalHistoryData?.familyHistory?.majorMedicalDetails ||
                        "N/A"}
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Box mt={4}>
                <Typography variant="h6" fontWeight={500}>
                  Specific care needs
                </Typography>
                <Box
                  sx={{
                    padding: "23px 19px",
                    border: `1px solid ${theme?.ShadowAndBorder.border2}`,
                    borderRadius: "10px",
                    mt: 2,
                  }}
                >
                  <Typography variant="body1" fontWeight={500}>
                    Specific needs?
                  </Typography>
                  <Typography mb={2} fontSize={"15px"} fontWeight={"500"}>
                    Details:{" "}
                    {medicalHistoryData?.specialCareNeeds
                      ?.specificNeedsDetails || "N/A"}
                  </Typography>
                  <Typography variant="body1" mt={1} fontWeight={500}>
                    Mobility or movement assistance?
                  </Typography>
                  <Typography mb={2} fontSize={"15px"} fontWeight={"500"}>
                    {medicalHistoryData?.specialCareNeeds
                      ?.needsMobilityAssistance === true
                      ? "Yes"
                      : medicalHistoryData?.specialCareNeeds
                          ?.needsMobilityAssistance === false
                      ? "No"
                      : "N/A"}
                  </Typography>
                  <Typography variant="body1" mt={1} fontWeight={500}>
                    Medication management
                  </Typography>
                  <Typography mb={2} fontSize={"15px"} fontWeight={"500"}>
                    {medicalHistoryData?.specialCareNeeds
                      ?.needsMedicationHelp === true
                      ? "Yes"
                      : medicalHistoryData?.specialCareNeeds
                          ?.needsMedicationHelp === false
                      ? "No"
                      : "N/A"}
                  </Typography>
                  <Typography variant="body1" mt={1} fontWeight={500}>
                    Special equipment?
                  </Typography>
                  <Typography mb={2} fontSize={"15px"} fontWeight={"500"}>
                    {medicalHistoryData?.specialCareNeeds
                      ?.specialEquipmentDetails || "N/A"}
                  </Typography>
                  <Typography variant="body1" mt={1} fontWeight={500}>
                    Assistance with eating, bathing or grooming?
                  </Typography>
                  <Typography fontSize={"15px"} fontWeight={"500"}>
                    {medicalHistoryData?.specialCareNeeds
                      ?.needsDailyLivingAssistance === true
                      ? "Yes"
                      : medicalHistoryData?.specialCareNeeds
                          ?.needsDailyLivingAssistance === false
                      ? "No"
                      : "N/A"}
                  </Typography>
                </Box>
              </Box>

              <Box mt={3}>
                <Typography variant="body1" fontWeight={500}>
                  Consent and Permissions
                </Typography>
                <Box
                  sx={{
                    mt: 3,
                    display: "flex",
                  }}
                >
                  <Box sx={{ display: "inline-block" }}>
                    {medicalHistoryData?.consentProvided === false ||
                    medicalHistoryData?.consentProvided === undefined ? (
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
                          background: theme.inProgress.background.primary,
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
                    variant="body1"
                    sx={{
                      marginLeft: "20px",
                      lineHeight: "16px",
                      textAlign: "justify",
                    }}
                  >
                    I consent to sharing my data with healthcare professionals
                    for care purposes.
                  </Typography>
                </Box>
              </Box>
            </CommonCard>
          </Box>
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default MedicalHistory;
