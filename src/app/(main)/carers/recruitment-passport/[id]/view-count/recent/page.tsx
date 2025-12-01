"use client";
import React, { useEffect, useState } from "react";
import moment from "moment";
import { useParams } from "next/navigation";
import Box from "@mui/material/Box";
import Grid2 from "@mui/material/Grid2";
// import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { CircularProgress, Divider } from "@mui/material";
import CommonCard from "@/components/Cards/Common";
import Pagination from "@/components/Pagination";
import { getViewCountRecentData } from "@/services/api/carerApi";
import { FiltersObjects, getSelectedFilters } from "@/types/singleUserInfoType";
import {
  RecentPassportData,
  RecentPassportResponse,
} from "@/types/recruitmentPassportType";

interface ParamsProps {
  id: string;
}

const Recent = () => {
  const params = useParams() as unknown as ParamsProps;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [rowsPerPage] = useState<number>(10);
  const [recentPassportData, setRecentPassportData] = useState<
    RecentPassportData[]
  >([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [lastSearchValue, setLastSearchValue] = useState<string>("");
  const [lastFilters, setlastFilters] = useState<FiltersObjects>(() =>
    getSelectedFilters()
  );

  useEffect(() => {
    const savedSearch = localStorage.getItem("search") || "";
    const filters = getSelectedFilters();
    setCurrentPage(0);
    setlastFilters(filters);
    setLastSearchValue(savedSearch);
    fetchAllPassportList(
      currentPage,
      savedSearch,
      params?.id,
      lastFilters?.dateFilter
    );
  }, [currentPage]);

  useEffect(() => {
    const interval = setInterval(() => {
      const currentSearchValue = localStorage.getItem("search") || "";
      const currentFilters = getSelectedFilters();

      const prevFiltersStr = JSON.stringify(lastFilters);
      const currFiltersStr = JSON.stringify(currentFilters);
      if (
        currentSearchValue !== lastSearchValue ||
        prevFiltersStr !== currFiltersStr
      ) {
        setLastSearchValue(currentSearchValue);
        setlastFilters(currentFilters);
        fetchAllPassportList(
          currentPage,
          currentSearchValue,
          params?.id,
          currentFilters?.dateFilter
        );
      }
    }, 500);

    return () => clearInterval(interval);
  }, [lastSearchValue, currentPage, lastFilters]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "search") {
        const newSearchValue = localStorage.getItem("search") || "";
        const newFilters = getSelectedFilters();
        setLastSearchValue(newSearchValue);
        setlastFilters(newFilters);
        fetchAllPassportList(
          currentPage,
          newSearchValue,
          params?.id,
          newFilters?.dateFilter
        );
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [currentPage]);

  const fetchAllPassportList = async (
    page: number,
    search: string,
    carerId: string,
    dateJoined?: string | number | null
  ) => {
    setIsLoading(true);
    try {
      const response = (await getViewCountRecentData({
        limit: rowsPerPage,
        page: page + 1,
        carerId: carerId,
        ...(search && { search: search }),
        ...(dateJoined && { dateAdded: dateJoined }),
      })) as RecentPassportResponse;
      if (response?.data?.success) {
        setRecentPassportData(response?.data?.data);
        setTotalItems(response?.data?.meta?.totalPages);
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
          <Typography variant="h6" fontWeight={500}>
            View access
          </Typography>
          <Typography variant="caption" fontWeight={400}>
            Track who viewed the passport and when.
          </Typography>
        </CommonCard>
      </Box>
      <Grid2 container spacing={2} mt={3}>
        <Grid2 size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
          <CommonCard>
            <Typography variant="h6" fontWeight={500}>
              Recent
            </Typography>

            <Box mt={1}>
              <Grid2 container spacing={2} columnSpacing={5}>
                {recentPassportData.map((ele, index) => {
                  return (
                    <Grid2
                      key={index}
                      size={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 6 }}
                    >
                      <Box
                        sx={{
                          // borderBottom: "1px solid #E2E6EB",
                          // borderRadius: "8px",
                          padding: "10px",
                          height: "100%",
                        }}
                      >
                        <Typography variant="body1" fontWeight={"500"}>
                          {ele?.email || "N/A"}
                        </Typography>
                        <Typography variant="body2">
                          Last opened:{" "}
                          {ele?.viewedAt
                            ? moment(ele?.viewedAt).format("Do MMMM YYYY")
                            : "N/A"}
                        </Typography>
                      </Box>
                      <Divider />
                    </Grid2>
                  );
                })}
              </Grid2>
            </Box>
          </CommonCard>
        </Grid2>
      </Grid2>
      <Box mt={2}>
        <Pagination
          totalPages={totalItems}
          page={currentPage}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </Box>
    </Box>
  );
};

export default Recent;
