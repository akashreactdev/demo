"use client";
import React, { useEffect, useState } from "react";
import moment from "moment";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Box, CircularProgress, Grid2, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
//relative path imports
import CommonCard from "@/components/Cards/Common";
import { getSingleCareNotes } from "@/services/api/usersApi";

export interface CarerNoteDetails {
  _id: string;
  userId: string;
  clientUserId: string;
  noteId: string;
  dateOfVisit: string;
  carerName: string;
  taskCompleted: string | null;
  healthObservations: string | null;
  vitalSigns: string | null;
  dietHydration: string | null;
  followUpAction: string | null;
  updatesToCarerPlan: string | null;
  familyUpdate: string | null;
  specialRequest: string | null;
  carerSignature: string;
  dateOfSignature: string;
  bookingId: string;
  observations: string | null;
  challenges: string | null;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CarerNoteDetailsApiResponse {
  data: {
    success: boolean;
    message: string;
    data: CarerNoteDetails;
  };
}

interface ParamsProps {
  id: string;
  profile: string;
  agreement: string;
  note: string;
}

const StyledBox = styled(Box)(({ theme }) => ({
  border: `1px solid ${theme.pending.secondary}`,
  padding: "10px 20px",
  borderRadius: "10px",
  display: "flex",
  alignItems: "center",
  minHeight: "47px",
}));
const CareNote = () => {
  // const theme = useTheme();
  const params = useParams() as unknown as ParamsProps;
  const [loading, setLoading] = useState<boolean>(false);
  const [careNoteData, setCareNoteData] = useState<CarerNoteDetails>();
  useEffect(() => {
    if (params?.agreement) {
      fetchSingleMedicationLog(params?.agreement);
    }
  }, [params?.agreement]);

  const fetchSingleMedicationLog = async (lodId: string) => {
    try {
      setLoading(true);
      const response = (await getSingleCareNotes(
        lodId
      )) as CarerNoteDetailsApiResponse;
      setCareNoteData(response?.data?.data);
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
        <Typography variant="h6" fontWeight={500}>
          Care note {careNoteData?.noteId || "N/A"}
        </Typography>

        <Box mt={2}>
          <Grid2 container spacing={2}>
            <Grid2 size={{ lg: 6, xl: 6, md: 6, sm: 6, xs: 12 }}>
              <Box mt={2}>
                <Typography variant="body1" fontWeight={400}>
                  Date of care visit
                </Typography>
                <StyledBox mt={2}>
                  <Typography variant="body1" fontWeight={400}>
                    {careNoteData?.dateOfVisit
                      ? moment(careNoteData?.dateOfVisit).format("Do MMMM YYYY")
                      : ""}
                  </Typography>
                </StyledBox>
              </Box>
              <Box mt={2}>
                <Typography variant="body1" fontWeight={400}>
                  Carer&apos;s name
                </Typography>
                <StyledBox mt={2}>
                  <Typography variant="body1" fontWeight={400}>
                    {careNoteData?.carerName || "N/A"}
                  </Typography>
                </StyledBox>
              </Box>
              <Box mt={2}>
                <Typography variant="body1" fontWeight={400}>
                  Observations
                </Typography>
                <StyledBox mt={2}>
                  <Typography variant="body1" fontWeight={400}>
                    {careNoteData?.observations || "N/A"}
                  </Typography>
                </StyledBox>
              </Box>
              <Box mt={2}>
                <Typography variant="body1" fontWeight={400}>
                  Health observations
                </Typography>
                <StyledBox mt={2}>
                  <Typography variant="body1" fontWeight={400}>
                    {careNoteData?.healthObservations || "N/A"}
                  </Typography>
                </StyledBox>
              </Box>
              <Box mt={2}>
                <Typography variant="body1" fontWeight={400}>
                  Diet and hydrations
                </Typography>
                <StyledBox mt={2}>
                  <Typography variant="body1" fontWeight={400}>
                    {careNoteData?.dietHydration || "N/A"}
                  </Typography>
                </StyledBox>
              </Box>
              <Box mt={2}>
                <Typography variant="body1" fontWeight={400}>
                  Updates to care plan
                </Typography>
                <StyledBox mt={2}>
                  <Typography variant="body1" fontWeight={400}>
                    {careNoteData?.updatesToCarerPlan || "N/A"}
                  </Typography>
                </StyledBox>
              </Box>
              <Box mt={2}>
                <Typography variant="body1" fontWeight={400}>
                  Special requests or notes from the client
                </Typography>
                <StyledBox mt={2}>
                  <Typography variant="body1" fontWeight={400}>
                    {careNoteData?.specialRequest || "N/A"}
                  </Typography>
                </StyledBox>
              </Box>
              <Box mt={2}>
                <Typography variant="body1" fontWeight={400}>
                  Carer signature
                </Typography>
                <StyledBox mt={1}>
                  {careNoteData?.carerSignature &&
                  careNoteData?.carerSignature.match(
                    /\.(jpeg|jpg|png|gif|svg)$/i
                  ) ? (
                    <Image
                      src={
                        careNoteData?.carerSignature != null
                          ? `${process.env.NEXT_PUBLIC_ASSETS_URL}/${careNoteData?.carerSignature}`
                          : "/assets/svg/carers/verifications/signature.svg"
                      }
                      height={30}
                      width={100}
                      alt="signature"
                    />
                  ) : (
                    <Typography
                      variant="body1"
                      fontFamily={"cursive"}
                      fontStyle={"italic"}
                      letterSpacing={1}
                      fontSize={"22px"}
                      fontWeight={400}
                    >
                      {careNoteData?.carerSignature || "-"}
                    </Typography>
                  )}
                </StyledBox>
                <Typography
                  sx={{ margin: "20px 0px 30px 0px !important" }}
                  variant="caption"
                  fontWeight={400}
                >
                  Date of signature:{" "}
                  {careNoteData?.dateOfSignature
                    ? moment(careNoteData?.dateOfSignature).format(
                        "Do MMMM YYYY"
                      )
                    : ""}
                </Typography>
              </Box>
            </Grid2>
            <Grid2 size={{ lg: 6, xl: 6, md: 6, sm: 6, xs: 12 }}>
              <Box mt={2}>
                <Typography variant="body1" fontWeight={400}>
                  Booking NO
                </Typography>
                <StyledBox mt={2}>
                  <Typography variant="body1" fontWeight={400}>
                    {careNoteData?.bookingId || "N/A"}
                  </Typography>
                </StyledBox>
              </Box>
              <Box mt={2}>
                <Typography variant="body1" fontWeight={400}>
                  Task Completed
                </Typography>
                <StyledBox mt={2}>
                  <Typography variant="body1" fontWeight={400}>
                    {careNoteData?.taskCompleted || "N/A"}
                  </Typography>
                </StyledBox>
              </Box>
              <Box mt={2}>
                <Typography variant="body1" fontWeight={400}>
                  Any issues or challenges
                </Typography>
                <StyledBox mt={2}>
                  <Typography variant="body1" fontWeight={400}>
                    {careNoteData?.challenges || "N/A"}
                  </Typography>
                </StyledBox>
              </Box>
              <Box mt={2}>
                <Typography variant="body1" fontWeight={400}>
                  Visit signs
                </Typography>
                <StyledBox mt={2}>
                  <Typography variant="body1" fontWeight={400}>
                    {careNoteData?.vitalSigns || "N/A"}
                  </Typography>
                </StyledBox>
              </Box>
              <Box mt={2}>
                <Typography variant="body1" fontWeight={400}>
                  Follow-up actions
                </Typography>
                <StyledBox mt={2}>
                  <Typography variant="body1" fontWeight={400}>
                    {careNoteData?.followUpAction || "N/A"}
                  </Typography>
                </StyledBox>
              </Box>
              <Box mt={2}>
                <Typography variant="body1" fontWeight={400}>
                  Family or guardian updates
                </Typography>
                <StyledBox mt={2}>
                  <Typography variant="body1" fontWeight={400}>
                    {careNoteData?.familyUpdate || "N/A"}
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

export default CareNote;
