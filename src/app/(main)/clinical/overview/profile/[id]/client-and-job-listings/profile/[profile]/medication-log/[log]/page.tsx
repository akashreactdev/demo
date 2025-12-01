"use client";
import React, { useEffect, useState } from "react";
import moment from "moment";
import Image from "next/image";
import { Box, CircularProgress, Grid2, Stack, Typography } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
//relative path imports
import CommonCard from "@/components/Cards/Common";
import { useParams } from "next/navigation";
import { singleMedicationLog } from "@/services/api/usersApi";

interface ParamsProps {
  log: string;
  id: string;
  logid: string;
}

interface MedicationLog {
  client: string;
  clientName: string;
  dosage: string;
  createdAt: string;
  dateOfAdministration: string;
  endDate: string;
  medicationGiven: string;
  prescriptionRenewalDate: string;
  reasonForAdministration: string;
  routeOfAdministration: string;
  startDate: string;
  status: string;
  timeOfAdministration: string | null;
  prescribingProfessional: string;
  reactionsOrSideEffects: string;
  createdBy: {
    firstName: string;
    lastName: string;
    _id: string;
  };
  _id: string;
}

interface MedicationLogResponse {
  data: {
    success: boolean;
    message: string;
    data: MedicationLog;
  };
}

const StyledBox = styled(Box)(({ theme }) => ({
  border: `1px solid ${theme.pending.secondary}`,
  padding: "10px 20px",
  borderRadius: "10px",
  display: "flex",
  alignItems: "center",
}));

const Profile = () => {
  const theme = useTheme();
  const params = useParams() as unknown as ParamsProps;
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<MedicationLog | null>(null);

  useEffect(() => {
    if (params?.log) {
      fetchSingleMedicationLog(params?.log);
    }
  }, [params?.log]);

  const fetchSingleMedicationLog = async (lodId: string) => {
    try {
      setLoading(true);
      const response = (await singleMedicationLog(
        lodId
      )) as MedicationLogResponse;
      setData(response?.data?.data);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

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
        <Box flexWrap={"wrap"} width={"100%"}>
          <Box>
            <Typography variant="h6" fontWeight={500}>
              {data?.medicationGiven || "N/A"}
            </Typography>
          </Box>
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
              <Stack
                flexDirection={"row"}
                gap={2}
                alignItems={"center"}
                mt={2}
                sx={{
                  padding: "23px 19px",
                  border: `1px solid ${theme?.ShadowAndBorder.border2}`,
                  borderRadius: "10px",
                  mt: 2,
                }}
              >
                <Image
                  src={"/assets/svg/carers/profile/medication_log.svg"}
                  height={37}
                  width={37}
                  alt="signature"
                />
                <Box>
                  <Typography variant="body1" fontWeight={500}>
                    {data?.medicationGiven || "N/A"}
                  </Typography>
                  <Typography variant="caption" fontWeight={400}>
                    Adminsitered:{" "}
                    {moment(data?.dateOfAdministration).format(
                      "DD MMMM YYYY [at] h:mm A"
                    ) || "N/A"}
                  </Typography>
                  <Typography
                    variant="body2"
                    fontSize={"12px"}
                    fontWeight={400}
                  >
                    Carer: {data?.clientName || "N/A"}
                  </Typography>
                </Box>
              </Stack>
            </Grid2>
          </Grid2>
        </Box>

        <Box mt={3}>
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 6 }}>
              <Typography variant="h6" fontWeight={400}>
                Administered by
              </Typography>
              <StyledBox mt={1}>
                <Typography variant="body1" fontWeight={400} minHeight={"30px"}>
                  {data?.createdBy?.firstName + " " + data?.createdBy?.lastName}
                </Typography>
              </StyledBox>
              <Box mt={3}>
                <Typography variant="h6" fontWeight={400}>
                  Route of administration
                </Typography>
                <StyledBox mt={1}>
                  <Typography
                    variant="body1"
                    fontWeight={400}
                    minHeight={"30px"}
                  >
                    {data?.routeOfAdministration || "N/A"}
                  </Typography>
                </StyledBox>
              </Box>
              <Box mt={3}>
                <Typography variant="h6" fontWeight={400}>
                  Time of administration
                </Typography>
                <StyledBox mt={1}>
                  <Typography
                    variant="body1"
                    fontWeight={400}
                    minHeight={"30px"}
                  >
                    {data?.timeOfAdministration || "N/A"}
                  </Typography>
                </StyledBox>
              </Box>
              <Box mt={3}>
                <Typography variant="h6" fontWeight={400}>
                  Start Date
                </Typography>
                <StyledBox mt={1}>
                  <Typography
                    variant="body1"
                    fontWeight={400}
                    minHeight={"30px"}
                  >
                    {data?.startDate
                      ? moment(data?.startDate).format("Do MMMM YYYY")
                      : "N/A"}
                  </Typography>
                </StyledBox>
              </Box>
              <Box mt={3}>
                <Typography variant="h6" fontWeight={400}>
                  Prescribing professional
                </Typography>
                <StyledBox mt={1}>
                  <Typography
                    variant="body1"
                    fontWeight={400}
                    minHeight={"30px"}
                  >
                    {data?.prescribingProfessional || "N/A"}
                  </Typography>
                </StyledBox>
              </Box>
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 6 }}>
              <Typography variant="h6" fontWeight={400}>
                Doasge
              </Typography>
              <StyledBox mt={1}>
                <Typography variant="body1" fontWeight={400} minHeight={"30px"}>
                  {data?.dosage || "N/A"}
                </Typography>
              </StyledBox>
              <Box mt={3}>
                <Typography variant="h6" fontWeight={400}>
                  Reason for administration
                </Typography>
                <StyledBox mt={1}>
                  <Typography
                    variant="body1"
                    fontWeight={400}
                    minHeight={"30px"}
                  >
                    {data?.reasonForAdministration || "N/A"}
                  </Typography>
                </StyledBox>
              </Box>
              <Box mt={3}>
                <Typography variant="h6" fontWeight={400}>
                  Reactions/side effects
                </Typography>
                <StyledBox mt={1}>
                  <Typography
                    variant="body1"
                    fontWeight={400}
                    minHeight={"30px"}
                  >
                    {data?.reactionsOrSideEffects || "N/A"}
                  </Typography>
                </StyledBox>
              </Box>
              <Box mt={3}>
                <Typography variant="h6" fontWeight={400}>
                  End Date
                </Typography>
                <StyledBox mt={1}>
                  <Typography
                    variant="body1"
                    fontWeight={400}
                    minHeight={"30px"}
                  >
                    {data?.endDate
                      ? moment(data?.endDate).format("Do MMMM YYYY")
                      : "N/A"}
                  </Typography>
                </StyledBox>
              </Box>
              <Box mt={3}>
                <Typography variant="h6" fontWeight={400}>
                  Prescription renewal date
                </Typography>
                <StyledBox mt={1}>
                  <Typography
                    variant="body1"
                    fontWeight={400}
                    minHeight={"30px"}
                  >
                    {data?.prescriptionRenewalDate
                      ? moment(data?.prescriptionRenewalDate).format(
                          "Do MMMM YYYY"
                        )
                      : "N/A"}
                  </Typography>
                </StyledBox>
              </Box>
            </Grid2>
          </Grid2>
        </Box>
      </CommonCard>
    </Box>
  );
};

export default Profile;
