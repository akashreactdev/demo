"use client";
import React, { useEffect, useState } from "react";
import moment from "moment";
import Image from "next/image";
import { Box, CircularProgress, Grid2, Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
//relative path imports
import CommonCard from "@/components/Cards/Common";
import { useParams } from "next/navigation";
import { singlePrescription } from "@/services/api/usersApi";

interface ParamsProps {
  log: string;
  id: string;
  prescriptionid: string;
}

export interface PrescriptionClient {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface PrescriptionDetail {
  _id: string;
  client: PrescriptionClient;
  prescriptionName: string;
  prescriptionUrl: string;
  uploadDate: string;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface PrescriptionDetailApiResponse {
  data: {
    success: boolean;
    message: string;
    data: PrescriptionDetail;
  };
}

const StyledBox = styled(Box)(({ theme }) => ({
  border: `1px solid ${theme.pending.secondary}`,
  padding: "10px 20px",
  borderRadius: "10px",
  display: "flex",
  alignItems: "center",
}));

const Prescription = () => {
  const params = useParams() as unknown as ParamsProps;
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<PrescriptionDetail | null>(null);

  useEffect(() => {
    if (params?.prescriptionid) {
      fetchSinglePrescription(params?.prescriptionid);
    }
  }, [params?.prescriptionid]);

  const fetchSinglePrescription = async (lodId: string) => {
    try {
      setLoading(true);
      const response = (await singlePrescription(
        lodId
      )) as PrescriptionDetailApiResponse;
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
              {data?.prescriptionName || "N/A"}
            </Typography>
          </Box>
        </Box>

        <Box mt={3}>
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 6 }}>
              <Typography variant="h6" fontWeight={400}>
                Prescription name
              </Typography>
              <StyledBox mt={1}>
                <Typography variant="body1" fontWeight={400} minHeight={"30px"}>
                  {data?.prescriptionName}
                </Typography>
              </StyledBox>
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 6 }}>
              <Box>
                <Typography variant="h6" fontWeight={400}>
                  Date added
                </Typography>
                <StyledBox mt={1}>
                  <Typography
                    variant="body1"
                    fontWeight={400}
                    minHeight={"30px"}
                  >
                    {moment(data?.uploadDate).format("Do MMMM YYYY") || "N/A"}
                  </Typography>
                </StyledBox>
              </Box>
            </Grid2>
          </Grid2>
        </Box>

        <Box mt={3}>
          <Stack>
            <Typography variant="body1" fontWeight={400}>
              Preview file
            </Typography>
          </Stack>
          <Stack
            alignItems={"center"}
            justifyContent={"center"}
            sx={{
              position: "relative", 
              width: "100%",
              height: "700px",
              borderRadius: "16px",
              overflow: "hidden", 
              border : "1px solid #EAEAEA",
              mt: 2,
            }}
          >
            <Image
              src={
                data?.prescriptionUrl !== "image/superAdmin/profileImage" &&
                data?.prescriptionUrl != null
                  ? `${process.env.NEXT_PUBLIC_ASSETS_URL}/${data?.prescriptionUrl}`
                  : `/assets/images/profile.jpg`
              }
              alt="user-profile-pic"
              fill
              style={{ objectFit: "contain" }} 
            />
          </Stack>
        </Box>
      </CommonCard>
    </Box>
  );
};

export default Prescription;
