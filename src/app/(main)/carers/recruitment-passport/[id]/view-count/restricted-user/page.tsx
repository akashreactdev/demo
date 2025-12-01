"use client";
import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Grid2 from "@mui/material/Grid2";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CommonCard from "@/components/Cards/Common";
import CommonPassportCard from "@/components/CommonPassportCard";
import Pagination from "@/components/Pagination";
import {
  PassportUserData,
  PassportUserDataResponse,
} from "@/types/recruitmentPassportType";
import { getViewCountBlockedData } from "@/services/api/carerApi";
import { FiltersObjects, getSelectedFilters } from "@/types/singleUserInfoType";
import { useParams } from "next/navigation";
import { CircularProgress } from "@mui/material";
import moment from "moment";

interface ParamsProps {
  id: string;
}

const RestrictedUser = () => {
  const params = useParams() as unknown as ParamsProps;
  const [isSelected, setIsSelected] = useState<string>("0");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [rowsPerPage] = useState<number>(10);
  const [blockedPassportData, setBlockedPassportData] = useState<
    PassportUserData[]
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
    fetchAllPassportBlockedUsersList(
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
        fetchAllPassportBlockedUsersList(
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
        fetchAllPassportBlockedUsersList(
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

  const fetchAllPassportBlockedUsersList = async (
    page: number,
    search: string,
    carerId: string,
    dateJoined?: string | number | null
  ) => {
    setIsLoading(true);
    try {
      const response = (await getViewCountBlockedData({
        limit: rowsPerPage,
        page: page + 1,
        carerId: carerId,
        ...(search && { search: search }),
        ...(dateJoined && { dateAdded: dateJoined }),
      })) as PassportUserDataResponse;
      if (response?.data?.success) {
        setBlockedPassportData(response?.data?.data);
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
      <Grid2 container spacing={2}>
        <Grid2 size={{ xs: 12, sm: 12, md: 12, lg: 6, xl: 6 }}>
          <CommonCard>
            <Typography variant="h6" fontWeight={500}>
              Restricted users
            </Typography>

            <Box mt={1}>
              {blockedPassportData.map((ele, index) => {
                return (
                  <CommonPassportCard
                    path="/assets/svg/carers/profile/users.svg"
                    onClick={() => setIsSelected(index.toString())}
                    key={index}
                    isRightButton={false}
                    email={ele?.email || "N/A"}
                    date={
                      ele?.lastViewedAt
                        ? moment(ele?.lastViewedAt).format("Do MMMM YYYY")
                        : "N/A"
                    }
                    style={{
                      cursor: "pointer",
                      backgroundColor:
                        isSelected === index.toString() ? "#F0F0F0" : "#FFFFFF",
                    }}
                  />
                );
              })}
            </Box>
          </CommonCard>
        </Grid2>
        {isSelected && (
          <Grid2 size={{ xs: 12, sm: 12, md: 12, lg: 6, xl: 6 }}>
            <CommonCard>
              <Typography variant="h6" fontWeight={500}>
                View
              </Typography>

              <Box>
                {blockedPassportData[+isSelected]?.viewedAt?.length ? (
                  blockedPassportData[+isSelected].viewedAt.map(
                    (date, index) => (
                      <Stack
                        key={index}
                        direction={"row"}
                        alignItems={"center"}
                        justifyContent={"space-between"}
                        sx={{ borderBottom: "1px solid #E2E6EB", py: 2 }}
                      >
                        <Box>
                          <Typography variant="body1" fontWeight={"500"}>
                            {blockedPassportData[+isSelected]?.email || "N/A"}
                          </Typography>
                          <Typography variant="body2">
                            Opened:{" "}
                            {date ? moment(date).format("Do MMMM YYYY") : "N/A"}
                          </Typography>
                        </Box>
                      </Stack>
                    )
                  )
                ) : (
                  <>
                    <Box textAlign={"center"}>
                      <Typography variant="body1">No view found</Typography>
                    </Box>
                  </>
                )}
              </Box>
            </CommonCard>
          </Grid2>
        )}
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

export default RestrictedUser;
