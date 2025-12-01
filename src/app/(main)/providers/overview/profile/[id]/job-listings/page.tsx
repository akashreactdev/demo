"use client";
import React, { useEffect, useState } from "react";
// import Image from "next/image";
import { useParams } from "next/navigation";
import Box from "@mui/material/Box";
// import Stack from "@mui/material/Stack";
import Grid2 from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import { CircularProgress, useMediaQuery } from "@mui/material";
import CommonCard from "@/components/Cards/Common";
import CommonButton from "@/components/CommonButton";
import { useRouterLoading } from "@/hooks/useRouterLoading";
import ProviderJobListingCard from "@/components/ProviderJobListingCard";
import {
  JobItem,
  JobListResponse,
} from "@/app/(main)/providers/job-postings/page";
import { getAllJobPosting } from "@/services/api/providerApi";
import { ProviderProfileResponse } from "@/types/providerProfileTypes";

interface ParamsProps {
  id: string;
}

const ProviderJobListing: React.FC = () => {
  const theme = useTheme();
  const params = useParams() as unknown as ParamsProps;
  const { navigateWithLoading } = useRouterLoading();
  const [rowsPerPage] = useState<number>(10);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [declinedData, setDeclinedData] = useState<JobItem[]>([]);
  const [activeInActiveData, setActiveInActiveData] = useState<JobItem[]>([]);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [providerProfileInfo, setProviderInfo] = useState<
    ProviderProfileResponse["data"]["data"] | null
  >(null);

  useEffect(() => {
    setIsLoading(false);
    const CarerData = localStorage.getItem("SelectedProvider");
    if (CarerData) {
      try {
        const parsedData = JSON.parse(CarerData);
        if (parsedData) {
          setProviderInfo(parsedData);
        }
      } catch (error) {
        console.error("Invalid JSON:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (providerProfileInfo) {
      fetchDeclinedJobProfile(0, providerProfileInfo?.userId);
      fetchActiveInActiveJobProfile(0, providerProfileInfo?.userId);
    }
  }, [providerProfileInfo]);

  const fetchDeclinedJobProfile = async (page: number, userId: string) => {
    setIsLoading(true);
    try {
      const response = (await getAllJobPosting({
        limit: rowsPerPage,
        page: page + 1,
        status: 4, // active = 1 , declined = 4
        userId: userId,
      })) as JobListResponse;
      if (response?.data?.success) {
        setDeclinedData(response?.data?.data);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchActiveInActiveJobProfile = async (
    page: number,
    userId: string
  ) => {
    setIsLoading(true);
    try {
      const response = (await getAllJobPosting({
        limit: rowsPerPage,
        page: page + 1,
        status: "1,3", // active = 1 , inActive = 3 declined = 4
        userId: userId,
      })) as JobListResponse;
      if (response?.data?.success) {
        setActiveInActiveData(response?.data?.data);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
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
        <Typography variant="body1" fontSize={18} fontWeight={500}>
          Job Listings
        </Typography>
        <Typography variant="caption">
          View the job listings of the providers
        </Typography>
      </CommonCard>

      <Box mt={4}>
        <CommonCard>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" fontWeight={500}>
              Job listings
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 1.25,
              }}
            >
              <CommonButton
                buttonText="View All"
                sx={{
                  maxWidth: isMobile ? "100%" : "max-content",
                  backgroundColor: theme.palette.common.white,
                }}
                buttonTextStyle={{ fontSize: "14px" }}
                onClick={() =>
                  navigateWithLoading(
                    `/providers/overview/profile/${params?.id}/job-listings/all-job-listings?isDeclined=false`
                  )
                }
              />
            </Box>
          </Box>
          <Grid2 container spacing={2}>
            {activeInActiveData?.slice(0, 2).map((data, index) => (
              <Grid2 key={index} size={{ md: 6, sm: 12, xs: 12, lg: 6, xl: 6 }}>
                <ProviderJobListingCard data={data} isShowChip={true} />
              </Grid2>
            ))}
          </Grid2>
        </CommonCard>
      </Box>
      <Box mt={4}>
        <CommonCard>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" fontWeight={500}>
              Declined listings
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 1.25,
              }}
            >
              <CommonButton
                buttonText="View All"
                sx={{
                  maxWidth: isMobile ? "100%" : "max-content",
                  backgroundColor: theme.palette.common.white,
                }}
                buttonTextStyle={{ fontSize: "14px" }}
                onClick={() =>
                  navigateWithLoading(
                    `/providers/overview/profile/${params?.id}/job-listings/all-job-listings?isDeclined=true`
                  )
                }
              />
            </Box>
          </Box>
          <Grid2 container spacing={2}>
            {declinedData?.slice(0, 2).map((data, index) => (
              <Grid2 key={index} size={{ md: 6, sm: 12, xs: 12, lg: 6, xl: 6 }}>
                <ProviderJobListingCard data={data} isShowChip={false} />
              </Grid2>
            ))}
          </Grid2>
        </CommonCard>
      </Box>
    </Box>
  );
};

export default ProviderJobListing;
