"use client";
import React, { useEffect, useState } from "react";
import moment from "moment";
import { useParams } from "next/navigation";
import { CircularProgress } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Grid2 from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import CommonCard from "@/components/Cards/Common";
import CommonChip from "@/components/CommonChip";
import CommonNoteCard from "@/components/CommonNoteCard";
import { getSingleVisitLog } from "@/services/api/usersApi";

const StyledBox = styled(Box)(({ theme }) => ({
  border: `1px solid ${theme.pending.secondary}`,
  padding: "10px 20px",
  borderRadius: "10px",
  display: "flex",
  alignItems: "center",
  minHeight: "47px",
}));

export interface VisitLogClient {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface VisitLogCreatedBy {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface VisitLogDetails {
  _id: string;
  client: VisitLogClient;
  createdBy: VisitLogCreatedBy;
  visitDate: string;
  visitTime: string;
  visitNumber: number;
  notes: string;
  status: number;
  declineReason: string | null;
  didCarerAttend: boolean | null;
  confirmedAt: string | null;
  declinedAt: string | null;
  bookingId: string;
  createdAt: string;
  updatedAt: string;
  visitTimeEnd: string | number | null;
  __v: number;
}

export interface VisitLogDetailsApiResponse {
  data: {
    success: boolean;
    message: string;
    data: VisitLogDetails;
  };
}

interface ParamsProps {
  id: string;
  profile: string;
  agreeemnt: string;
  log: string;
}

const VisitLog = () => {
  const theme = useTheme();
  const params = useParams() as unknown as ParamsProps;
  const [loading, setLoading] = useState<boolean>(false);
  const [visitLogData, setVisitLogData] = useState<VisitLogDetails>();

  const statusMap: Record<
    number,
    { label: string; color: string; bg: string; borderColor: string }
  > = {
    1: {
      label: "Pending",
      color: theme.palette.common.black,
      bg: theme.palette.grey[200],
      borderColor: theme.pending.background.secondary,
    },
    2: {
      label: "Confirmed",
      color: theme.accepted.main,
      bg: theme.accepted.background.primary,
      borderColor: theme.accepted.main,
    },
    3: {
      label: "Declined",
      color: theme.declined.main,
      bg: theme.declined.background.primary,
      borderColor: theme.declined.main,
    },
  };

  useEffect(() => {
    if (params?.log) {
      fetchSingleVisitLog(params?.log);
    }
  }, [params?.log]);

  const fetchSingleVisitLog = async (lodId: string) => {
    try {
      setLoading(true);
      const response = (await getSingleVisitLog(
        lodId
      )) as VisitLogDetailsApiResponse;
      setVisitLogData(response?.data?.data);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const currentStatus = visitLogData?.status ?? 1;
  const statusInfo = statusMap[currentStatus];

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
      <CommonCard
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h6" fontWeight={500}>
            Visit log #{visitLogData?.visitNumber || "N/A"}
          </Typography>
          <Typography variant="caption" fontWeight={400}>
            You are currently previewing a visit log. Please find the details
            below.
          </Typography>
        </Box>

        <Box>
          <CommonChip
            title={statusInfo.label}
            style={{
              backgroundColor: statusInfo.bg,
              borderRadius: "8px",
              border: `1px solid ${statusInfo.borderColor}`,
              padding: "14.5px 16px",
            }}
            textStyle={{
              color: statusInfo.color,
              fontWeight: 500,
            }}
          />
        </Box>
      </CommonCard>
      <Box mt={3}>
        <Grid2 container spacing={2}>
          <Grid2 size={{ lg: 6, xl: 6, md: 6, sm: 6, xs: 12 }}>
            <CommonCard>
              <Typography variant="h6" fontWeight={500}>
                New visit log
              </Typography>
              <Box mt={2}>
                <Typography variant="body1" fontWeight={400}>
                  Date of visit:
                </Typography>
                <StyledBox mt={2}>
                  <Typography variant="body1" fontWeight={400}>
                    {visitLogData?.visitDate
                      ? moment(visitLogData?.visitDate).format("Do MMMM YYYY")
                      : "N/A"}
                  </Typography>
                </StyledBox>
              </Box>
              <Box mt={2}>
                <Typography variant="body1" fontWeight={400}>
                  Time of visit:
                </Typography>
                <StyledBox mt={2}>
                  <Typography variant="body1" fontWeight={400}>
                    {visitLogData?.visitTime || "N/A"}
                  </Typography>
                </StyledBox>
              </Box>
              <Box mt={2}>
                <Typography variant="body1" fontWeight={400}>
                  Time of visit ended:
                </Typography>
                <StyledBox mt={2}>
                  <Typography variant="body1" fontWeight={400}>
                    {visitLogData?.visitTimeEnd || "N/A"}
                  </Typography>
                </StyledBox>
              </Box>
            </CommonCard>
          </Grid2>
          <Grid2 size={{ lg: 6, xl: 6, md: 6, sm: 6, xs: 12 }}>
            <CommonCard sx={{ height: "100%" }}>
              <Box mt={5}>
                <CommonNoteCard
                  title="Notes:"
                  value={visitLogData?.notes || ""}
                />
              </Box>
            </CommonCard>
          </Grid2>
        </Grid2>
      </Box>
      {statusInfo.label === "Declined" && (
        <Box mt={3}>
          <CommonCard>
            <Typography variant="h6" fontWeight={500}>
              User confirmation details
            </Typography>
            <Box width={"50%"} mt={3}>
              <CommonNoteCard
                title="Reason for declining...:"
                value="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
              />
            </Box>
          </CommonCard>
        </Box>
      )}
    </Box>
  );
};

export default VisitLog;
