"use client";
import React, { useEffect, useState } from "react";
import moment from "moment";
import { useParams } from "next/navigation";
import Grid2 from "@mui/material/Grid2";
import Box from "@mui/material/Box";
// import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import { CircularProgress } from "@mui/material";
import { useRouterLoading } from "@/hooks/useRouterLoading";
import CommonCard from "@/components/Cards/Common";
import RequestCard from "@/components/Cards/Request";
import Pagination from "@/components/Pagination";
import { FiltersObjects, getSelectedFilters } from "@/types/singleUserInfoType";
import CommonButton from "@/components/CommonButton";
import { carePlanMap, getDateFilterLabel } from "@/constants/usersData";
import { getAllCareNotes } from "@/services/api/usersApi";

export interface CarerNote {
  _id: string;
  noteId: string;
  dateOfVisit: string;
  carerName: string;
  isDeleted: boolean;
  createdAt: string;
}

export interface Visit {
  _id: string;
  noteId: string;
  updatedAt: string;
  agreementId: string;
  time: string;
  status: number;
  carerName: string;
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

export interface CarerNotesApiResponse {
  data: {
    success: boolean;
    message: string;
    data: CarerNote[];
    meta: PaginationMeta;
  };
}

interface ParamsProps {
  id: string;
  profile: string;
  agreement: string;
}

const CareNotesList = () => {
  // const theme = useTheme();
  const { navigateWithLoading } = useRouterLoading();
  const params = useParams() as unknown as ParamsProps;
  const [activeCarePlan, setActiveCarePlan] = useState<CarerNote[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalpages] = useState<number>(0);
  const [rowsPerPage] = useState<number>(10);
  const [lastFilters, setlastFilters] = useState<FiltersObjects>(() =>
    getSelectedFilters()
  );
  const [lastSearchValue, setLastSearchValue] = useState<string>("");

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  useEffect(() => {
    const clientData = localStorage.getItem("Selecteduser");
    const savedSearch = localStorage.getItem("search") || "";
    const filters = getSelectedFilters();

    setLastSearchValue(savedSearch);
    setlastFilters(filters);
    if (clientData) {
      try {
        const parsedData = JSON.parse(clientData);
        if (parsedData?.userId) {
          fetchAllCareNotes(
            parsedData.userId,
            currentPage,
            filters?.dateFilter,
            savedSearch
          );
        }
      } catch (error) {
        console.error("Invalid JSON:", error);
      }
    }
    setIsLoading(false);
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
        const clientData = localStorage.getItem("Selecteduser");
        if (clientData) {
          try {
            const parsedData = JSON.parse(clientData);
            if (parsedData?.userId) {
              setlastFilters(currentFilters);
              setCurrentPage(0);
              fetchAllCareNotes(
                parsedData.userId,
                0,
                currentFilters?.dateFilter,
                currentSearchValue
              );
            }
          } catch (error) {
            console.error("Invalid JSON:", error);
          }
        }
      }
    }, 500);

    return () => clearInterval(interval);
  }, [currentPage, lastFilters]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "search" || e.key === "selectedFilters") {
        const newSearchValue = localStorage.getItem("search") || "";
        const newFilters = getSelectedFilters();
        setLastSearchValue(newSearchValue);

        const clientData = localStorage.getItem("Selecteduser");
        if (clientData) {
          try {
            const parsedData = JSON.parse(clientData);
            if (parsedData?.userId) {
              setlastFilters(newFilters);
              fetchAllCareNotes(
                parsedData.userId,
                currentPage,
                newFilters?.dateFilter,
                newSearchValue
              );
            }
          } catch (error) {
            console.error("Invalid JSON:", error);
          }
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [currentPage]);

  const fetchAllCareNotes = async (
    clientId: string | null,
    page: number,
    dateJoined?: string | number | null,
    searchQuery?: string
  ) => {
    setIsLoading(true);
    try {
      const response = (await getAllCareNotes({
        clientId: clientId,
        userId: params?.id,
        role: 4,
        page: page + 1,
        limit: rowsPerPage,
        bookingId: params?.agreement,
        search: searchQuery,
        ...(dateJoined && { dateJoined: dateJoined }),
      })) as CarerNotesApiResponse;
      if (response?.data?.success) {
        setActiveCarePlan(response?.data?.data);
        setTotalpages(response?.data?.meta?.totalPages);
      } else {
        setActiveCarePlan([]);
        setTotalpages(0);
      }
    } catch (e) {
      console.log(e);
      setActiveCarePlan([]);
      setTotalpages(0);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearSingleFilter = (filterKey: keyof FiltersObjects) => {
    const updatedFilters = { ...lastFilters, [filterKey]: null };
    setlastFilters(updatedFilters);
    localStorage.setItem("selectedFilters", JSON.stringify(updatedFilters));
    setCurrentPage(0);
    const clientData = localStorage.getItem("Selecteduser");
    if (clientData) {
      try {
        const parsedData = JSON.parse(clientData);
        if (parsedData?.userId) {
          fetchAllCareNotes(parsedData.userId, 0, updatedFilters?.dateFilter);
        }
      } catch (error) {
        console.error("Invalid JSON:", error);
      }
    }
  };

  const handleClearFilters = () => {
    localStorage.removeItem("selectedFilters");
    const clearedFilters = { carePlan: null, dateFilter: null };
    setlastFilters(clearedFilters);
    setCurrentPage(0);
    const clientData = localStorage.getItem("Selecteduser");
    if (clientData) {
      try {
        const parsedData = JSON.parse(clientData);
        if (parsedData?.userId) {
          fetchAllCareNotes(parsedData.userId, 0, null);
        }
      } catch (error) {
        console.error("Invalid JSON:", error);
      }
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
        <Box>
          <Typography variant="h6" fontWeight={500}>
            Care notes
          </Typography>
          <Typography variant="caption" fontWeight={400}>
            View all the care notes that has been entered by the
            carer/clinician.
          </Typography>
        </Box>
      </CommonCard>

      <Box mt={3}>
        <CommonCard>
          <Box
            paddingBottom={
              lastFilters?.carePlan || lastFilters?.dateFilter ? 3 : 0
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
                  {lastFilters?.carePlan && (
                    <Grid2>
                      <CommonButton
                        buttonText={String(
                          carePlanMap[lastFilters.carePlan as number]
                        )}
                        sx={{
                          height: "40px",
                          borderRadius: "80px",
                          border: "1px solid #518ADD",
                          backgroundColor: "#ECF2FB",
                        }}
                        buttonTextStyle={{ fontSize: "15px", color: "#518ADD" }}
                        onClick={() => handleClearSingleFilter("carePlan")}
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
                {(lastFilters?.carePlan || lastFilters?.dateFilter) && (
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
            {activeCarePlan?.length > 0 ? (
              activeCarePlan.map((ele, index) => (
                <Grid2
                  container
                  size={{ md: 6, sm: 6, xs: 6, lg: 6, xl: 6 }}
                  key={index}
                >
                  <RequestCard
                    path="/assets/svg/carers/verifications/carers_note.svg"
                    title={`Care note ${ele?.noteId || "N/A"}`}
                    subtitle={`Agreement: #${params?.agreement} | Carer: ${ele?.carerName}`}
                    subtitle2={`last updated: ${
                      ele?.dateOfVisit
                        ? moment(ele?.dateOfVisit).format("DD MMMM YYYY")
                        : "N/A"
                    }`}
                    onClickRightButton={() =>
                      navigateWithLoading(
                        `/clinical/overview/profile/${params.id}/client-and-job-listings/profile/${params.profile}/care-notes/${ele?._id}`
                      )
                    }
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
                    No Care note Found
                  </Typography>
                </Box>
              </Grid2>
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

export default CareNotesList;
