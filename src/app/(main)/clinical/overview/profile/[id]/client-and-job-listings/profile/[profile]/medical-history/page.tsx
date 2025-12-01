"use client";
import React, { useEffect, useState } from "react";
import moment from "moment";
import { Box, Grid2, Stack, Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
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
import CommonChip from "@/components/CommonChip";
import CommonNoteCard from "@/components/CommonNoteCard";

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

// const StyledBox = styled(Box)(({ theme }) => ({
//   border: `1px solid ${theme.pending.secondary}`,
//   padding: "10px 20px",
//   borderRadius: "10px",
//   display: "flex",
//   alignItems: "center",
// }));

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
              <Box mt={3}>
                <Typography variant="body1" fontWeight={500} mb={2}>
                  Do you currently take medication?
                </Typography>
                <CommonChip
                  title={
                    medicalHistoryData?.hasAllergies === true
                      ? "Yes"
                      : medicalHistoryData?.hasAllergies === false
                      ? "No"
                      : "N/A"
                  }
                  style={{
                    borderColor: theme.ShadowAndBorder.border1,
                    backgroundColor: "transparent",
                  }}
                />
                <Box mt={2}>
                  <Typography variant="body1" fontWeight={500} mb={2}>
                    Medical conditions selected:
                  </Typography>
                  <Stack flexDirection={"row"} flexWrap={"wrap"} gap={2}>
                    {medicalHistoryData?.allergies.map((allergy) => (
                      <CommonChip
                        key={allergy}
                        title={allergy}
                        style={{
                          borderColor: theme.ShadowAndBorder.border1,
                          backgroundColor: "transparent",
                          whiteSpace: "nowrap", // 👈 Prevents text wrapping
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      />
                    ))}
                  </Stack>
                </Box>
              </Box>
            </CommonCard>
          </Box>
          {/* Medical Conditions */}
          <Box mt={4}>
            <CommonCard>
              <Typography variant="h6" fontWeight={500}>
                Medical conditions
              </Typography>
              <Box mt={2}>
                <Typography variant="body1" fontWeight={500} mb={2}>
                  Do they have any medical conditions?
                </Typography>
                <CommonChip
                  title={
                    medicalHistoryData?.hasMedicalConditions === true
                      ? "Yes"
                      : medicalHistoryData?.hasMedicalConditions === false
                      ? "No"
                      : "N/A"
                  }
                  style={{
                    borderColor: theme.ShadowAndBorder.border1,
                    backgroundColor: "transparent",
                  }}
                />
                <Box mt={2}>
                  <Typography variant="body1" fontWeight={500} mb={2}>
                    Medical Condition:
                  </Typography>{" "}
                  <CommonChip
                    title={medicalHistoryData?.medicalConditions?.name || "N/A"}
                    style={{
                      borderColor: theme.ShadowAndBorder.border1,
                      backgroundColor: "transparent",
                    }}
                  />
                  <Typography variant="body1" fontWeight={500} mt={2} mb={2}>
                    Special at home equipment:
                  </Typography>
                  <CommonChip
                    title={
                      medicalHistoryData?.medicalConditions?.treatmentName ||
                      "N/A"
                    }
                    style={{
                      borderColor: theme.ShadowAndBorder.border1,
                      backgroundColor: "transparent",
                    }}
                  />
                </Box>
              </Box>
            </CommonCard>
          </Box>
          {/* lifes style */}
          <Box mt={4}>
            <CommonCard>
              {/* Lifestyle and Habits */}
              <Box>
                <Typography variant="h6" fontWeight={500}>
                  Lifestyle and habits
                </Typography>
                <Box mt={2}>
                  <Typography variant="body1" fontWeight={500} mb={2}>
                    Do you smoke?
                  </Typography>
                  <CommonChip
                    title={
                      medicalHistoryData?.smoker === true
                        ? "Yes"
                        : medicalHistoryData?.smoker === false
                        ? "No"
                        : "N/A"
                    }
                    style={{
                      borderColor: theme.ShadowAndBorder.border1,
                      backgroundColor: "transparent",
                    }}
                  />
                  <Typography mt={2} mb={2} variant="body1" fontWeight={500}>
                    Do you live with pets?
                  </Typography>
                  <CommonChip
                    title={
                      medicalHistoryData?.pets === true
                        ? "Yes"
                        : medicalHistoryData?.pets === false
                        ? "No"
                        : "N/A"
                    }
                    style={{
                      borderColor: theme.ShadowAndBorder.border1,
                      backgroundColor: "transparent",
                    }}
                  />
                  {medicalHistoryData?.petDetails && (
                    <>
                      <Typography variant="body1" fontWeight={500}>
                        If yes, please describe
                      </Typography>
                      <CommonNoteCard
                        value={medicalHistoryData?.petDetails || "N/A"}
                      />
                    </>
                  )}
                  <Typography variant="body1" fontWeight={500} mb={2} mt={2}>
                    Dietary restrictions?
                  </Typography>
                  <CommonChip
                    title={medicalHistoryData?.dietaryRestrictions || "N/A"}
                    style={{
                      borderColor: theme.ShadowAndBorder.border1,
                      backgroundColor: "transparent",
                    }}
                  />
                </Box>
              </Box>
            </CommonCard>
          </Box>
          {/* Special Care needs */}
          <Box mt={4}>
            <CommonCard>
              <Typography variant="h6" fontWeight={500}>
                Specific care needs
              </Typography>
              <Box mt={2}>
                <Typography variant="body1" fontWeight={500}>
                  Details:
                </Typography>
                <CommonNoteCard
                  value={
                    medicalHistoryData?.specialCareNeeds
                      ?.specificNeedsDetails || "N/A"
                  }
                />
                <Typography variant="body1" mt={2} mb={2} fontWeight={500}>
                  Mobility or movement assistance?
                </Typography>
                <CommonChip
                  title={
                    medicalHistoryData?.specialCareNeeds
                      ?.needsMobilityAssistance === true
                      ? "Yes"
                      : medicalHistoryData?.specialCareNeeds
                          ?.needsMobilityAssistance === false
                      ? "No"
                      : "N/A"
                  }
                  style={{
                    borderColor: theme.ShadowAndBorder.border1,
                    backgroundColor: "transparent",
                  }}
                />

                <Typography variant="body1" mt={2} mb={2} fontWeight={500}>
                  Medication management
                </Typography>
                <CommonChip
                  title={
                    medicalHistoryData?.specialCareNeeds
                      ?.needsMedicationHelp === true
                      ? "Yes"
                      : medicalHistoryData?.specialCareNeeds
                          ?.needsMedicationHelp === false
                      ? "No"
                      : "N/A"
                  }
                  style={{
                    borderColor: theme.ShadowAndBorder.border1,
                    backgroundColor: "transparent",
                  }}
                />

                <Typography variant="body1" mt={2} mb={2} fontWeight={500}>
                  Assistance with eating, bathing or grooming?
                </Typography>
                <CommonChip
                  title={
                    medicalHistoryData?.specialCareNeeds
                      ?.needsDailyLivingAssistance === true
                      ? "Yes"
                      : medicalHistoryData?.specialCareNeeds
                          ?.needsDailyLivingAssistance === false
                      ? "No"
                      : "N/A"
                  }
                  style={{
                    borderColor: theme.ShadowAndBorder.border1,
                    backgroundColor: "transparent",
                  }}
                />
                <Typography variant="body1" mt={2} fontWeight={500}>
                  Do you require special equipment or devices for daily
                  activities?
                </Typography>
                <CommonNoteCard
                  value={
                    medicalHistoryData?.specialCareNeeds
                      ?.specialEquipmentDetails || "N/A"
                  }
                />
              </Box>
            </CommonCard>
          </Box>
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 6 }}>
          {/* Medication */}
          <Box mt={4}>
            <CommonCard>
              <Typography variant="h6" fontWeight={500} fontSize={"18px"}>
                Medication
              </Typography>
              <Box mt={2}>
                <Stack mt={2} gap={2}>
                  <Box>
                    <Typography variant="body1" fontWeight={400} mb={2}>
                      Do you currently take medication?
                    </Typography>
                    <CommonChip
                      title={
                        medicalHistoryData?.takesMedication === true
                          ? "Yes"
                          : medicalHistoryData?.takesMedication === false
                          ? "No"
                          : "N/A"
                      }
                      style={{
                        borderColor: theme.ShadowAndBorder.border1,
                        backgroundColor: "transparent",
                      }}
                    />
                  </Box>
                  <Box mt={2}>
                    <Typography variant="body1" fontWeight={400} mb={2}>
                      Medication selected:
                    </Typography>
                  </Box>
                </Stack>

                <Stack flexDirection={"row"} flexWrap={"wrap"} gap={2}>
                  {medicalHistoryData?.medications.map((med, index) => {
                    const title = [
                      med.name,
                      med.dosageCustom ??
                        (med.dosage !== null && med.dosage !== undefined
                          ? `${Dosage[med.dosage]}`
                          : null),
                      med.recurrenceCustom ??
                        (med.recurrence !== null && med.recurrence !== undefined
                          ? `${Recurrence[med.recurrence]}`
                          : null),
                      med.treatmentDurationCustom ??
                        (med.treatmentDuration !== null &&
                        med.treatmentDuration !== undefined
                          ? `${TreatmentDuration[med.treatmentDuration]}`
                          : null),
                    ]
                      .filter(Boolean)
                      .join(" • ");
                    return (
                      <CommonChip
                        title={title}
                        key={`${med.name}-${index}`}
                        style={{
                          borderColor: theme.ShadowAndBorder.border1,
                          backgroundColor: "transparent",
                          whiteSpace: "nowrap",
                        }}
                      />
                    );
                  })}
                </Stack>
              </Box>
            </CommonCard>
          </Box>
          {/* Mobility */}
          <Box mt={4}>
            <CommonCard>
              <Typography variant="h6" fontWeight={500}>
                Mobility and accessibility
              </Typography>
              <Box mt={2}>
                <Typography variant="body1" fontWeight={500} mb={2}>
                  Any issues with mobility?
                </Typography>
                <CommonChip
                  title={
                    medicalHistoryData?.hasMobilityIssues === true
                      ? "Yes"
                      : medicalHistoryData?.hasMobilityIssues === false
                      ? "No"
                      : "N/A"
                  }
                  style={{
                    borderColor: theme.ShadowAndBorder.border1,
                    backgroundColor: "transparent",
                  }}
                />
              </Box>
              <Box mt={2}>
                <Typography variant="body1" fontWeight={500} mb={2}>
                  Mobility issue:
                </Typography>
                <CommonChip
                  title={medicalHistoryData?.mobilityIssues?.name || "N/A"}
                  style={{
                    borderColor: theme.ShadowAndBorder.border1,
                    backgroundColor: "transparent",
                  }}
                />
              </Box>
              <Box mt={2}>
                <Typography variant="body1" fontWeight={500} mb={2}>
                  Acute Condition:
                </Typography>
                <CommonChip
                  title={medicalHistoryData?.acuteConditions?.name || "N/A"}
                  style={{
                    borderColor: theme.ShadowAndBorder.border1,
                    backgroundColor: "transparent",
                  }}
                />
              </Box>
            </CommonCard>
          </Box>
          {/* Immunisation */}
          <Box mt={4}>
            <CommonCard>
              <Typography variant="h6" fontWeight={500} fontSize={"18px"}>
                Immunisation records
              </Typography>
              <Typography
                variant="h6"
                fontWeight={500}
                fontSize={"15px"}
                mt={2}
              >
                {medicalHistoryData?.immunisations?.name || "N/A"}
              </Typography>
              <Box
                sx={{
                  padding: "14px 16px",
                  border: `1px solid ${theme?.ShadowAndBorder.border2}`,
                  borderRadius: "10px",
                  mt: 2,
                  width: "max-content",
                }}
              >
                <Box mt={1}>
                  <Typography variant="body1" fontWeight={500}>
                    Date of immunisation:{" "}
                    <Typography
                      variant="body1"
                      component={"span"}
                      fontWeight={400}
                    >
                      {medicalHistoryData?.immunisations?.dateOfImmunisation
                        ? moment(
                            medicalHistoryData?.immunisations
                              ?.dateOfImmunisation
                          ).format("DD/MM/YYYY")
                        : "N/A"}
                    </Typography>
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    Healthcare provider/clinic:{" "}
                    <Typography
                      variant="body1"
                      component={"span"}
                      fontWeight={400}
                    >
                      {medicalHistoryData?.immunisations?.healthcareProvider
                        ? medicalHistoryData?.immunisations?.healthcareProvider
                        : "N/A"}
                    </Typography>
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    Batch Number:{" "}
                    <Typography
                      variant="body1"
                      component={"span"}
                      fontWeight={400}
                    >
                      {medicalHistoryData?.immunisations?.vaccineBatchNumber
                        ? medicalHistoryData?.immunisations?.vaccineBatchNumber
                        : "N/A"}
                    </Typography>
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    Immunisation status:{" "}
                    <Typography
                      variant="body1"
                      component={"span"}
                      fontWeight={400}
                    >
                      {medicalHistoryData?.immunisations?.immunisationStatus
                        ? ImmunisationStatus[
                            medicalHistoryData?.immunisations
                              ?.immunisationStatus
                          ]
                        : "N/A"}
                    </Typography>
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    Next dose due:{" "}
                    <Typography
                      variant="body1"
                      component={"span"}
                      fontWeight={400}
                    >
                      {medicalHistoryData?.immunisations?.nextDoseDue
                        ? moment(
                            medicalHistoryData?.immunisations?.nextDoseDue
                          ).format("DD/MM/YYYY")
                        : "N/A"}
                    </Typography>
                  </Typography>
                </Box>
              </Box>
            </CommonCard>
          </Box>
          {/* Family */}
          <Box mt={4}>
            <CommonCard>
              <Typography variant="h6" fontWeight={500} fontSize={"18px"}>
                Relevant family history
              </Typography>
              <Box mt={2}>
                <Typography variant="body1" fontWeight={500} mb={2}>
                  Major health conditions?
                </Typography>
                <CommonChip
                  title={
                    medicalHistoryData?.familyHistory
                      ?.hasMajorMedicalHistory === true
                      ? "Yes"
                      : medicalHistoryData?.familyHistory
                          ?.hasMajorMedicalHistory === false
                      ? "No"
                      : "N/A"
                  }
                  style={{
                    borderColor: theme.ShadowAndBorder.border1,
                    backgroundColor: "transparent",
                  }}
                />

                <Typography variant="body1" mt={2} mb={2} fontWeight={500}>
                  Details:
                </Typography>
                <CommonChip
                  title={
                    medicalHistoryData?.familyHistory?.majorMedicalDetails ||
                    "N/A"
                  }
                  style={{
                    borderColor: theme.ShadowAndBorder.border1,
                    backgroundColor: "transparent",
                  }}
                />
              </Box>
            </CommonCard>
          </Box>
          {/* Sign off */}
          <Box mt={4}>
            <CommonCard>
              <Typography variant="h6" fontSize={"18px"} fontWeight={500}>
                Sign off
              </Typography>
              <Typography variant="body1" mt={2}>
                The user has provided their consent and permissions.
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
                  I consent to sharing my data with healthcare professionals for
                  care purposes.
                </Typography>
              </Box>
            </CommonCard>
          </Box>
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default MedicalHistory;
