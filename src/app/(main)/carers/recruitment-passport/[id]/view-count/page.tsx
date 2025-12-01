"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import { CircularProgress, IconButton, useMediaQuery } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Typography from "@mui/material/Typography";
import Grid2 from "@mui/material/Grid2";
import CommonCard from "@/components/Cards/Common";
import CommonChip from "@/components/CommonChip";
import { useRouterLoading } from "@/hooks/useRouterLoading";
import {
  getViewCountBlockedData,
  getViewCountRecentData,
  getViewCountusersData,
} from "@/services/api/carerApi";
import { FiltersObjects, getSelectedFilters } from "@/types/singleUserInfoType";
import moment from "moment";
import {
  PassportUserData,
  PassportUserDataResponse,
  RecentPassportData,
  RecentPassportResponse,
} from "@/types/recruitmentPassportType";

interface ParamsProps {
  id: string;
}

const ViewCount: React.FC = () => {
  const params = useParams() as unknown as ParamsProps;
  const { navigateWithLoading } = useRouterLoading();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [rowsPerPage] = useState<number>(10);
  const [recentPassportData, setRecentPassportData] = useState<
    RecentPassportData[]
  >([]);
  const [userPassportData, setUserPassportData] = useState<PassportUserData[]>(
    []
  );
  const [blockedPassportData, setBlockedPassportData] = useState<
    PassportUserData[]
  >([]);
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
    fetchAllPassportUsersList(
      currentPage,
      savedSearch,
      params?.id,
      lastFilters?.dateFilter
    );
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
        fetchAllPassportList(
          currentPage,
          currentSearchValue,
          params?.id,
          currentFilters?.dateFilter
        );
        fetchAllPassportUsersList(
          currentPage,
          currentSearchValue,
          params?.id,
          currentFilters?.dateFilter
        );
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
        fetchAllPassportList(
          currentPage,
          newSearchValue,
          params?.id,
          newFilters?.dateFilter
        );
        fetchAllPassportUsersList(
          currentPage,
          newSearchValue,
          params?.id,
          newFilters?.dateFilter
        );
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
        ...(dateJoined && { dateJoined: dateJoined }),
      })) as RecentPassportResponse;
      if (response?.data?.success) {
        setRecentPassportData(response?.data?.data);
        // setTotalItems(response?.data?.meta?.totalDocs);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllPassportUsersList = async (
    page: number,
    search: string,
    carerId: string,
    dateJoined?: string | number | null
  ) => {
    setIsLoading(true);
    try {
      const response = (await getViewCountusersData({
        limit: rowsPerPage,
        page: page + 1,
        carerId: carerId,
        ...(search && { search: search }),
        ...(dateJoined && { dateJoined: dateJoined }),
      })) as PassportUserDataResponse;
      if (response?.data?.success) {
        setUserPassportData(response?.data?.data);
        // setTotalItems(response?.data?.meta?.totalDocs);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

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
        ...(dateJoined && { dateJoined: dateJoined }),
      })) as PassportUserDataResponse;
      if (response?.data?.success) {
        setBlockedPassportData(response?.data?.data);
        // setTotalItems(response?.data?.meta?.totalDocs);
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
        <Stack
          direction={isMobile ? "column" : "row"}
          alignItems={isMobile ? "flex-start" : "center"}
          justifyContent={"space-between"}
          spacing={isMobile ? 2 : 0}
        >
          <Box>
            <Typography variant="h6" fontWeight={500}>
              View count
            </Typography>
            <Typography variant="caption" fontWeight={400}>
              Track who viewed the passport and when.
            </Typography>
          </Box>
        </Stack>
      </CommonCard>

      <Box mt={3}>
        <Grid2 container spacing={2}>
          <Grid2 size={{ sm: 12, md: 12, xs: 12, lg: 6, xl: 6 }}>
            <CommonCard>
              <Stack
                direction={"row"}
                alignItems={"center"}
                justifyContent={"space-between"}
              >
                <Typography variant="h6" fontWeight={500}>
                  Recent
                </Typography>
                <CommonChip
                  title="View all"
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    navigateWithLoading(
                      `/carers/recruitment-passport/${params.id}/view-count/recent`
                    )
                  }
                />
              </Stack>

              <Box>
                {recentPassportData && recentPassportData?.length > 0 ? (
                  recentPassportData.map((ele, index) => {
                    return (
                      <Stack
                        key={index}
                        direction={"row"}
                        alignItems={"center"}
                        justifyContent={"space-between"}
                        sx={{ borderBottom: "1px solid #E2E6EB", py: 2 }}
                      >
                        <Box>
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
                      </Stack>
                    );
                  })
                ) : (
                  <Box textAlign={"center"} mt={2}>
                    <Typography variant="body1">No users found</Typography>
                  </Box>
                )}
              </Box>
            </CommonCard>
          </Grid2>
          <Grid2 size={{ sm: 12, md: 12, xs: 12, lg: 6, xl: 6 }}>
            <CommonCard>
              <Stack
                direction={"row"}
                alignItems={"center"}
                justifyContent={"space-between"}
              >
                <Typography variant="h6" fontWeight={500}>
                  User
                </Typography>
                <CommonChip
                  title="View all"
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    navigateWithLoading(
                      `/carers/recruitment-passport/${params.id}/view-count/users`
                    )
                  }
                />
              </Stack>

              <Box>
                {userPassportData && userPassportData?.length > 0 ? (
                  userPassportData.map((ele, index) => {
                    return (
                      <Stack
                        key={index}
                        mt={2}
                        direction={"row"}
                        alignItems={"center"}
                        justifyContent={"space-between"}
                        sx={{
                          border: "1px solid #E2E6EB",
                          p: 2,
                          borderRadius: "10px",
                        }}
                      >
                        <Stack
                          direction={"row"}
                          alignItems={"center"}
                          spacing={2}
                        >
                          <Image
                            src={"/assets/svg/carers/profile/users.svg"}
                            alt="User Profile"
                            width={50}
                            height={50}
                          />
                          <Box>
                            <Typography variant="body1" fontWeight={"500"}>
                              {ele?.email || "N/A"}
                            </Typography>
                            <Typography variant="body2">
                              Last opened:{" "}
                              {ele?.lastViewedAt
                                ? moment(ele?.lastViewedAt).format(
                                    "Do MMMM YYYY"
                                  )
                                : "N/A"}
                            </Typography>
                          </Box>
                        </Stack>
                        <Box>
                          <IconButton
                            onClick={() =>
                              navigateWithLoading(
                                `/carers/recruitment-passport/${params.id}/view-count/users`
                              )
                            }
                          >
                            <ArrowForwardIosIcon
                              sx={{ color: "#000000", fontSize: 16 }}
                            />
                          </IconButton>
                        </Box>
                      </Stack>
                    );
                  })
                ) : (
                  <Box textAlign={"center"} mt={2}>
                    <Typography variant="body1">No users found</Typography>
                  </Box>
                )}
              </Box>
            </CommonCard>

            <Box mt={3}>
              <CommonCard>
                <Stack
                  direction={"row"}
                  alignItems={"center"}
                  justifyContent={"space-between"}
                >
                  <Typography variant="h6" fontWeight={500}>
                    Restricted users
                  </Typography>
                  <CommonChip
                    onClick={() =>
                      navigateWithLoading(
                        `/carers/recruitment-passport/${params.id}/view-count/restricted-user`
                      )
                    }
                    title="View all"
                    style={{ cursor: "pointer" }}
                  />
                </Stack>

                <Box>
                  {blockedPassportData && blockedPassportData?.length > 0 ? (
                    blockedPassportData?.map((ele, index) => {
                      return (
                        <Stack
                          key={index}
                          direction={"row"}
                          mt={2}
                          alignItems={"center"}
                          justifyContent={"space-between"}
                          sx={{
                            border: "1px solid #E2E6EB",
                            p: 2,
                            borderRadius: "10px",
                          }}
                        >
                          <Stack
                            direction={"row"}
                            alignItems={"center"}
                            spacing={2}
                          >
                            <Image
                              src={"/assets/svg/carers/profile/users.svg"}
                              alt="User Profile"
                              width={50}
                              height={50}
                            />
                            <Box>
                              <Typography variant="body1" fontWeight={"500"}>
                                {ele?.email || "N/A"}
                              </Typography>
                              <Typography variant="body2">
                                Last opened:{" "}
                                {ele?.lastViewedAt
                                  ? moment(ele?.lastViewedAt).format(
                                      "Do MMMM YYYY"
                                    )
                                  : "N/A"}
                              </Typography>
                            </Box>
                          </Stack>
                          <Box>
                            <IconButton
                              onClick={() =>
                                navigateWithLoading(
                                  `/carers/recruitment-passport/${params.id}/view-count/restricted-user`
                                )
                              }
                            >
                              <ArrowForwardIosIcon
                                sx={{ color: "#000000", fontSize: 16 }}
                              />
                            </IconButton>
                          </Box>
                        </Stack>
                      );
                    })
                  ) : (
                    <Box textAlign={"center"} mt={2}>
                      <Typography variant="body1">No users found</Typography>
                    </Box>
                  )}
                </Box>
              </CommonCard>
            </Box>
          </Grid2>
        </Grid2>
      </Box>
    </Box>
  );
};

export default ViewCount;
