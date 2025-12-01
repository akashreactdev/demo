"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import moment from "moment";
import { Box, CircularProgress, Grid2, Stack, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
//relative path imports
import CommonCard from "@/components/Cards/Common";
import RequestCard from "@/components/Cards/Request";
import { useRouterLoading } from "@/hooks/useRouterLoading";
import { getAllMedicationLogs } from "@/services/api/usersApi";
import {
  FiltersObjects,
  getSelectedFilters,
  UserInfoResponse,
} from "@/types/singleUserInfoType";
import Pagination from "@/components/Pagination";
import CommonButton from "@/components/CommonButton";
import {
  getDateFilterLabel,
  MedicationLogStatusEnum,
  MedicationLogStatusLabels,
  // MedicationLogType,
  // MedicationTypeMap,
} from "@/constants/usersData";

interface ParamsProps {
  id: string;
  profile: string;
  log: string;
}

export interface MedicationLog {
  _id: string;
  client: string;
  createdBy: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  bookingId: string;
  clientName: string;
  medicationGiven: string;
  dateOfAdministration: string;
  timeOfAdministration: string;
  createdAt: string;
  updatedAt: string;
  prescriptionName: string;
  uploadDate: string;
  status: string;
}

export interface MedicationLogMeta {
  totalDocs: number;
  limit: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: number | null;
  prevPage: number | null;
}

export interface MedicationLogApiResponse {
  data: {
    success: boolean;
    message: string;
    data: MedicationLog[];
    meta: MedicationLogMeta;
  };
}

const MedicationLogs = () => {
  const { navigateWithLoading } = useRouterLoading();
  const params = useParams() as unknown as ParamsProps;
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPageForLogs, setCurrentPageForLogs] = useState<number>(0);
  const [totalPagesForLogs, setTotalPagesForLogs] = useState<number>(0);
  const [rowsPerPage] = useState<number>(10);
  const [data, setData] = useState<MedicationLog[]>([]);
  const [userInfo, setUserInfo] = useState<
    UserInfoResponse["data"]["data"] | null
  >(null);
  const [lastFilters, setlastFilters] = useState<FiltersObjects>(() =>
    getSelectedFilters()
  );

  const handlePageChange = (newPage: number) => {
    setCurrentPageForLogs(newPage);
  };

  useEffect(() => {
    const clientData = localStorage.getItem("Selecteduser");
    if (clientData) {
      try {
        const parsedData = JSON.parse(clientData);
        setUserInfo(parsedData);
      } catch (error) {
        console.error("Invalid JSON:", error);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const filters = getSelectedFilters();
    if (userInfo) {
      try {
        if (userInfo?.userId) {
          fetchAllLogs(
            currentPageForLogs,
            userInfo?.userId,
            filters?.dateFilter,
            filters?.logStatus
          );
        }
      } catch (error) {
        console.error("Invalid JSON:", error);
      }
    }
    setLoading(false);
  }, [userInfo, currentPageForLogs]);

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
              fetchAllLogs(
                currentPageForLogs,
                userInfo?.userId,
                currentFilters?.dateFilter,
                currentFilters?.logStatus
              );
            }
          } catch (error) {
            console.error("Invalid JSON:", error);
          }
        }
      }
    }, 500);

    return () => clearInterval(interval);
  }, [userInfo, currentPageForLogs, lastFilters]);

  const fetchAllLogs = async (
    page: number,
    userId: string,
    // bookingId?: string,
    dateJoined?: string | number | null,
    status?: string | number | null
  ) => {
    setLoading(true);
    try {
      const response = (await getAllMedicationLogs({
        limit: rowsPerPage,
        page: page + 1,
        clientId: userId,
        userId: params?.id,
        role: 3, // 3 = care , 4 = clinical
        // bookingId: bookingId,
        isPrescription: false,
        ...(dateJoined && { filter: dateJoined }),
        ...(status ? { status } : {}),
      })) as MedicationLogApiResponse;
      if (response?.data?.success) {
        setData(response?.data?.data);
        setTotalPagesForLogs(response?.data?.meta?.totalPages);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const handleActionItemClick = (
    agreementid: string | number,
    id: string | number
  ) => {
    navigateWithLoading(
      `/carers/overview/profile/${params.id}/client-and-job-listings/profile/${params.profile}/medication-log/${id}`
    );
  };

  const handleActionItemClickForPrescription = (
    agreementid: string | number,
    id: string | number
  ) => {
    navigateWithLoading(
      `/carers/overview/profile/${params.id}/client-and-job-listings/profile/${params.profile}/medication-log/${id}`
    );
  };

  const handleClearSingleFilter = (filterKey: keyof FiltersObjects) => {
    const updatedFilters = {
      ...lastFilters,
      [filterKey]: filterKey === "logType" ? false : null,
    };
    setlastFilters(updatedFilters);
    localStorage.setItem("selectedFilters", JSON.stringify(updatedFilters));

    if (userInfo) {
      try {
        if (userInfo?.userId) {
          fetchAllLogs(
            currentPageForLogs,
            userInfo?.userId,
            updatedFilters?.dateFilter,
            updatedFilters?.logStatus
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
    };
    setlastFilters(clearedFilters);
    if (userInfo?.userId) {
      fetchAllLogs(
        currentPageForLogs,
        userInfo.userId,
        clearedFilters.dateFilter,
        clearedFilters.logStatus
      );
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
        <Stack
          direction={"row"}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Box>
            <Typography variant="h6" fontWeight={500}>
              Medication logs
            </Typography>
            <Typography variant="caption">
              View medications recorded by your carer to stay informed and
              up-to-date on administered care.
            </Typography>
          </Box>
        </Stack>
      </CommonCard>
      <Box mt={2}>
        <CommonCard>
          <Box
            paddingBottom={
              lastFilters?.logType ||
              lastFilters?.logStatus ||
              lastFilters?.dateFilter
                ? 3
                : 0
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
                  {/* {!lastFilters?.logType !== undefined && (
                    <Grid2>
                      <CommonButton
                        buttonText={
                          lastFilters.logType
                            ? MedicationTypeMap[MedicationLogType.Prescription]
                            : MedicationTypeMap[MedicationLogType.CarerLog]
                        }
                        sx={{
                          height: "40px",
                          borderRadius: "80px",
                          border: "1px solid #518ADD",
                          backgroundColor: "#ECF2FB",
                        }}
                        buttonTextStyle={{ fontSize: "15px", color: "#518ADD" }}
                        onClick={() => handleClearSingleFilter("logType")}
                        endIcon={<CloseIcon sx={{ color: "#518ADD" }} />}
                      />
                    </Grid2>
                  )} */}
                  {lastFilters?.logStatus && (
                    <Grid2>
                      <CommonButton
                        buttonText={
                          MedicationLogStatusLabels[
                            lastFilters.logStatus as MedicationLogStatusEnum
                          ] || "Unknown"
                        }
                        sx={{
                          height: "40px",
                          borderRadius: "80px",
                          border: "1px solid #518ADD",
                          backgroundColor: "#ECF2FB",
                        }}
                        buttonTextStyle={{ fontSize: "15px", color: "#518ADD" }}
                        onClick={() => handleClearSingleFilter("logStatus")}
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
                {(lastFilters?.logStatus || lastFilters?.dateFilter) && (
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
            mt={2}
          >
            {data?.length > 0 ? (
              data.map((ele, index) => (
                <Grid2
                  container
                  size={{ md: 6, sm: 6, xs: 6, lg: 6, xl: 6 }}
                  key={index}
                >
                  <RequestCard
                    path={
                      ele?.prescriptionName
                        ? "/assets/svg/carers/profile/prescription.svg"
                        : "/assets/svg/carers/profile/medication_log.svg"
                    }
                    title={
                      ele?.medicationGiven
                        ? ele?.medicationGiven
                        : ele?.prescriptionName
                        ? ele?.prescriptionName
                        : "N/A"
                    }
                    subtitle={`Administered: ${
                      ele?.dateOfAdministration
                        ? moment(ele?.dateOfAdministration).format(
                            "DD MMMM YYYY"
                          )
                        : ele?.uploadDate
                        ? moment(ele?.uploadDate).format("DD MMMM YYYY")
                        : "N/A"
                    }`}
                    subtitle2={`Carer: ${
                      (ele?.createdBy?.firstName || "") +
                      " " +
                      (ele?.createdBy?.lastName || "")
                    } | Agreement: #${params?.log}`}
                    onClickRightButton={() => {
                      if (ele?.prescriptionName) {
                        handleActionItemClickForPrescription(
                          params?.log,
                          ele?._id
                        );
                      } else {
                        handleActionItemClick(ele?.bookingId, ele?._id);
                      }
                    }}
                  />
                </Grid2>
              ))
            ) : (
              <Grid2
                container
                size={{ md: 12, sm: 12, xs: 12, lg: 12, xl: 12 }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                  }}
                >
                  <Typography variant="h6" fontWeight={400}>
                    No Medication Logs Found
                  </Typography>
                </Box>
              </Grid2>
            )}
          </Grid2>
        </CommonCard>
        <Box mt={3}>
          <Pagination
            page={currentPageForLogs}
            totalPages={totalPagesForLogs}
            onPageChange={handlePageChange}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default MedicationLogs;
