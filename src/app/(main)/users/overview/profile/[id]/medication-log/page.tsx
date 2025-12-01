"use client";
import React, { useEffect, useState } from "react";
import moment from "moment";
import { useParams } from "next/navigation";
import { Box, Stack, Typography, CircularProgress } from "@mui/material";
import Grid2 from "@mui/material/Grid2";
import CloseIcon from "@mui/icons-material/Close";
//relative path imorts
import CommonCard from "@/components/Cards/Common";
import Pagination from "@/components/Pagination";
import RequestCard from "@/components/Cards/Request";
import {
  FiltersObjects,
  getSelectedFilters,
  UserInfoResponse,
} from "@/types/singleUserInfoType";
import { getAllServiceAgreement } from "@/services/api/usersApi";
import { useRouterLoading } from "@/hooks/useRouterLoading";
import CommonButton from "@/components/CommonButton";
import {
  AgreementStatusMap,
  DateFilterOptions,
  getDateFilterLabel,
} from "@/constants/usersData";

interface ParamsProps {
  id: string;
  profile: string;
}

export interface UserShort {
  _id: string;
  firstName: string;
  lastName: string;
}

export interface ServiceAgreement {
  _id: string;
  userId: UserShort;
  endDate: string;
  agreementId: string;
}

export interface PaginationMeta {
  totalDocs: number;
  limit: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: number | null;
  prevPage: number | null;
}

export interface ServiceAgreementApiResponse {
  data: {
    success: boolean;
    message: string;
    data: ServiceAgreement[];
    meta: PaginationMeta;
  };
}

const MedicationLog: React.FC = () => {
  const { navigateWithLoading } = useRouterLoading();
  const params = useParams() as unknown as ParamsProps;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalpages] = useState<number>(0);
  const [rowsPerPage] = useState<number>(10);
  const [userInfo, setUserInfo] = useState<
    UserInfoResponse["data"]["data"] | null
  >(null);
  const [agreementData, setAgreementData] = useState<ServiceAgreement[]>([]);
  const [lastFilters, setlastFilters] = useState<FiltersObjects>(() =>
    getSelectedFilters()
  );

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  useEffect(() => {
    const clientData = localStorage.getItem("Selecteduser");
    if (clientData) {
      try {
        const parsedData = JSON.parse(clientData);
        if (parsedData) {
          setUserInfo(parsedData);
        }
      } catch (error) {
        console.error("Invalid JSON:", error);
      }
    }
  }, []);

  useEffect(() => {
    const filters = getSelectedFilters();
    if (userInfo) {
      try {
        fetchAllAgreements(
          userInfo?.userId,
          currentPage,
          filters?.agreementStatus,
          filters?.dateFilter
        );
      } catch (error) {
        console.error("Invalid JSON:", error);
      }
    }
  }, [userInfo, currentPage]);

  useEffect(() => {
    const interval = setInterval(() => {
      const currentFilters = getSelectedFilters();
      const prevFiltersStr = JSON.stringify(lastFilters);
      const currFiltersStr = JSON.stringify(currentFilters);

      if (prevFiltersStr !== currFiltersStr) {
        if (userInfo) {
          try {
            if (userInfo?.userId) {
              setlastFilters(currentFilters);
              setCurrentPage(0);
              fetchAllAgreements(
                userInfo?.userId,
                0,
                currentFilters?.agreementStatus,
                currentFilters?.dateFilter
              );
            }
          } catch (error) {
            console.error("Invalid JSON:", error);
          }
        }
      }
    }, 500);

    return () => clearInterval(interval);
  }, [userInfo, currentPage, lastFilters]);

  const fetchAllAgreements = async (
    clientId: string,
    page: number,
    filter?: string | number | null,
    dateFilter?: string | number | null
  ) => {
    setIsLoading(true);
    try {
      const response = (await getAllServiceAgreement({
        clientId: clientId,
        filter: filter,
        limit: rowsPerPage,
        page: page + 1,
        ...(filter && { filter: filter }),
        ...(dateFilter && {
          dateFilter: DateFilterOptions.find((opt) => opt.value === dateFilter)
            ?.id,
        }),
      })) as ServiceAgreementApiResponse;
      if (response?.data?.success) {
        setAgreementData(response?.data?.data);
        setTotalpages(response?.data?.meta?.totalPages);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleActionItemClick = (id: string | number) => {
    navigateWithLoading(
      `/users/overview/profile/${params?.id}/medication-log/${id}`
    );
  };

  const handleClearSingleFilter = (filterKey: keyof FiltersObjects) => {
    const updatedFilters = {
      ...lastFilters,
      [filterKey]: null,
    };
    setlastFilters(updatedFilters);
    localStorage.setItem("selectedFilters", JSON.stringify(updatedFilters));

    if (userInfo) {
      try {
        if (userInfo?.userId) {
          fetchAllAgreements(
            userInfo?.userId,
            currentPage,
            updatedFilters?.agreementStatus
          );
        }
      } catch (error) {
        console.error("Invalid JSON:", error);
      }
    }
  };

  const handleClearFilters = () => {
    localStorage.removeItem("selectedFilters");

    const clearedFilters: FiltersObjects = {
      carePlan: null,
      dateFilter: null,
      logType: false,
      logStatus: null,
      agreementStatus: null,
    };
    setlastFilters(clearedFilters);
    if (userInfo?.userId) {
      fetchAllAgreements(
        userInfo?.userId,
        currentPage,
        clearedFilters?.agreementStatus
      );
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
          direction={"row"}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Stack direction={"column"} spacing={1}>
            <Typography variant="h6" fontWeight={500}>
              Medication logs
            </Typography>
            <Typography variant="caption">
              View medications recorded by your carer to stay informed and
              up-to-date on administered care.
            </Typography>
          </Stack>
        </Stack>
      </CommonCard>

      <CommonCard
        sx={{
          mt: 2,
        }}
      >
        <Box
          paddingBottom={
            lastFilters?.agreementStatus || lastFilters?.dateFilter ? 3 : 0
          }
        >
          <Grid2
            container
            alignItems="center"
            justifyContent="space-between"
            spacing={2}
          >
            <Grid2>
              <Grid2 container spacing={1}>
                {lastFilters?.agreementStatus && (
                  <Grid2>
                    <CommonButton
                      buttonText={String(
                        AgreementStatusMap[
                          lastFilters.agreementStatus as string
                        ]
                      )}
                      sx={{
                        height: "40px",
                        borderRadius: "80px",
                        border: "1px solid #518ADD",
                        backgroundColor: "#ECF2FB",
                      }}
                      buttonTextStyle={{ fontSize: "15px", color: "#518ADD" }}
                      onClick={() => handleClearSingleFilter("agreementStatus")}
                      endIcon={<CloseIcon sx={{ color: "#518ADD" }} />}
                    />
                  </Grid2>
                )}
                {lastFilters?.dateFilter && (
                  <Grid2>
                    <CommonButton
                      sx={{
                        height: "40px",
                        borderRadius: "80px",
                        border: "1px solid #518ADD",
                        backgroundColor: "#ECF2FB",
                      }}
                      buttonTextStyle={{ fontSize: "15px", color: "#518ADD" }}
                      buttonText={`${getDateFilterLabel(
                        lastFilters?.dateFilter
                      )}`}
                      onClick={() => handleClearSingleFilter("dateFilter")}
                      endIcon={<CloseIcon sx={{ color: "#518ADD" }} />}
                    />
                  </Grid2>
                )}
              </Grid2>
            </Grid2>
            <Grid2>
              {(lastFilters?.agreementStatus || lastFilters?.dateFilter) && (
                <Typography
                  variant="button"
                  sx={{
                    textDecoration: "none",
                    textTransform: "none",
                    cursor: "pointer",
                    fontSize: "15px",
                  }}
                  onClick={handleClearFilters}
                >
                  clear
                </Typography>
              )}
            </Grid2>
          </Grid2>
        </Box>
        <Grid2
          container
          size={{ md: 12, sm: 12, xs: 12, lg: 12, xl: 12 }}
          spacing={2}
        >
          {agreementData?.length > 0 ? (
            agreementData.map((ele, index) => (
              <Grid2
                container
                size={{ md: 6, sm: 6, xs: 6, lg: 6, xl: 6 }}
                key={index}
              >
                <RequestCard
                  path="/assets/svg/carers/profile/payment_request.svg"
                  title={`Agreement #${ele.agreementId}`}
                  subtitle={`Client:${ele?.userId?.firstName} ${ele?.userId?.lastName}`}
                  subtitle2={`Ends on: ${moment(ele?.endDate).format(
                    "DD MMMM YYYY"
                  )}`}
                  onClickRightButton={() =>
                    handleActionItemClick(ele?.agreementId)
                  }
                />
              </Grid2>
            ))
          ) : (
            <Grid2 container size={{ md: 12, sm: 12, xs: 12, lg: 12, xl: 12 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                <Typography variant="h6" fontWeight={400}>
                  No Agreements Found
                </Typography>
              </Box>
            </Grid2>
          )}
        </Grid2>
      </CommonCard>

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

export default MedicationLog;
