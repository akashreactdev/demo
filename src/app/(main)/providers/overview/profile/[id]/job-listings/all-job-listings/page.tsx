"use client";
import React, { useEffect, useState } from "react";
// import Image from "next/image";
// import { useParams } from "next/navigation";
import Box from "@mui/material/Box";
// import Stack from "@mui/material/Stack";
import Grid2 from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import { CircularProgress } from "@mui/material";
import CommonCard from "@/components/Cards/Common";
import { useRouterLoading } from "@/hooks/useRouterLoading";
import ProviderJobListingCard from "@/components/ProviderJobListingCard";
import {
  JobItem,
  JobListResponse,
} from "@/app/(main)/providers/job-postings/page";
import { getAllJobPosting } from "@/services/api/providerApi";
import { ProviderProfileResponse } from "@/types/providerProfileTypes";
import Pagination from "@/components/Pagination";
import { useSearchParams } from "next/navigation";
// import { FiltersObjects, getSelectedFilters } from "@/types/singleUserInfoType";

// interface ParamsProps {
//   id: string;
// }

const ProviderAllJobListing: React.FC = () => {
  //   const params = useParams() as unknown as ParamsProps;
  const searchParams = useSearchParams();
  const { navigateWithLoading } = useRouterLoading();
  const isActive = searchParams.get("isDeclined");
  const [rowsPerPage] = useState<number>(10);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeInActiveData, setActiveInActiveData] = useState<JobItem[]>([]);
  const [providerProfileInfo, setProviderInfo] = useState<
    ProviderProfileResponse["data"]["data"] | null
  >(null);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalpages] = useState<number>(0);
  // const [lastSearchValue, setLastSearchValue] = useState<string>("");
  // const [lastFilters, setlastFilters] = useState<FiltersObjects>(() =>
  //   getSelectedFilters()
  // );

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

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
    // const savedSearch = localStorage.getItem("search") || "";
    // const filters = getSelectedFilters();

    // setLastSearchValue(savedSearch);
    // setlastFilters(filters);
    if (providerProfileInfo) {
      const status = isActive === "true" ? 4 : "1,3";
      fetchActiveInActiveJobProfile(
        0,
        providerProfileInfo?.userId,
        status
        // filters.jobListing ? filters.jobListing : status,
        // savedSearch,
        // filters.dateFilter
      );
    }
  }, [providerProfileInfo, isActive]);

  const fetchActiveInActiveJobProfile = async (
    page: number,
    userId: string,
    status?: string | number | null
    // searchQuery?: string,
    // dateJoined?: string | number | null
  ) => {
    setIsLoading(true);
    try {
      const response = (await getAllJobPosting({
        limit: rowsPerPage,
        page: page + 1,
        status: status,
        userId: userId,
        // search: searchQuery,
        // ...(dateJoined && { dateJoined: dateJoined }),
      })) as JobListResponse;
      if (response?.data?.success) {
        setActiveInActiveData(response?.data?.data);
        setTotalpages(response?.data?.meta?.totalPages);
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
      <Box>
        <CommonCard>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" fontWeight={500}>
              {isActive === "true" ? "Declined " : ""}Job listings
            </Typography>
          </Box>
          <Grid2 container spacing={2} mt={2}>
            {activeInActiveData && activeInActiveData?.length > 0 ? (
              activeInActiveData?.map((data, index) => (
                <Grid2
                  key={index}
                  size={{ md: 6, sm: 12, xs: 12, lg: 6, xl: 6 }}
                  component={"button"}
                  onClick={() =>
                    navigateWithLoading(
                      `/providers/job-postings/profile/${data._id}`
                    )
                  }
                  sx={{ border: "none", background: "none", cursor: "pointer" }}
                >
                  <ProviderJobListingCard data={data} isShowChip={true} />
                </Grid2>
              ))
            ) : (
              <Box
                width="100%"
                display="flex"
                justifyContent="center"
                alignItems="center"
                padding="40px 0"
              >
                <Typography variant="body1" color="text.secondary">
                  No jobs found
                </Typography>
              </Box>
            )}
          </Grid2>
        </CommonCard>
      </Box>
      {!isLoading && (
        <Box mt={3}>
          <Pagination
            page={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </Box>
      )}
    </Box>
  );
};

export default ProviderAllJobListing;
