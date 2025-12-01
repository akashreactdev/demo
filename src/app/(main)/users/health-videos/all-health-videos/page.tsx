"use client";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Box from "@mui/material/Box";
import Grid2 from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import CommonCard from "@/components/Cards/Common";
import HealthVideoCard from "@/components/HealthVideos/VideoCard";
import Pagination from "@/components/Pagination";
import {
  getAllHealthVideos,
  updateHealthVideos,
} from "@/services/api/usersApi";
import { CircularProgress } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { FiltersObjects, getSelectedFilters } from "@/types/singleUserInfoType";

type RawCategory = {
  name: string;
  value: number;
};

interface VideoData {
  _id: string;
  title: string;
  category: RawCategory[];
  thumbnailUrl: string;
  durationMinutes: number;
  durationSeconds: number;
  updatedAt: string;
  isBookmarked: boolean;
  status: number;
}

interface VideosListResponse {
  data: {
    success: boolean;
    message: string;
    data: VideoData[];
    meta: {
      totalDocs: number;
      limit: number;
      page: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
      nextPage: string | boolean | null;
      prevPage: string | boolean | null;
    };
  };
}

interface RemoveUserInfoResponse {
  data: {
    success: boolean;
    message: string;
  };
}

const AllHealthVideos: React.FC = () => {
  const searchParams = useSearchParams();
  const isArchivedView = searchParams?.get("isArchieve") === "true";
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeVideosData, setActiveVideosData] = useState<VideoData[]>([]);
  const [currentPageForPending, setCurrentPageForPending] = useState<number>(0);
  const [totalPagesForPending, setTotalpagesForPending] = useState<number>(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedRow, setSelectedRow] = useState<string | null>(null);
  const [rowsPerPage] = useState<number>(10);
  const [lastSearchValue, setLastSearchValue] = useState<string>("");
  const [lastFilters, setlastFilters] = useState<FiltersObjects>(() =>
    getSelectedFilters()
  );

  const handleActionClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    rowId: string
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(rowId);
  };

  const onUpdateHealthVideos = async (id: string, status: number) => {
    try {
      const payload = {
        status: status,
      };
      const response = (await updateHealthVideos(
        id,
        payload
      )) as RemoveUserInfoResponse;
      if (response?.data?.success) {
        toast.success(response?.data?.message);
        const currentSearch = localStorage.getItem("search") || "";
        fetchAllHealthVideos(currentPageForPending, currentSearch);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleActionItemClick = (rowId: string, actionIndex: number) => {
    // console.log("Row:", rowId, "Action Index:", actionIndex);
    if (actionIndex === 3) {
      onUpdateHealthVideos(rowId, 3);
    } else if (actionIndex === 4) {
      onUpdateHealthVideos(rowId, 4);
    }
    handleClose();
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const fetchAllHealthVideos = async (
    page: number,
    searchQuery?: string,
    dateAdded?: string | number | null
  ) => {
    setIsLoading(true);
    try {
      const response = (await getAllHealthVideos({
        limit: rowsPerPage,
        page: page + 1,
        ...(isArchivedView ? { status: 3 } : { status: 1 }),
        ...(searchQuery && { search: searchQuery }),
        ...(dateAdded && { dateAdded: dateAdded }),
      })) as VideosListResponse;
      if (response?.data?.success) {
        setActiveVideosData(response?.data?.data);
        setTotalpagesForPending(response?.data?.meta?.totalPages);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChangeForPending = (page: number) => {
    setCurrentPageForPending(page);
  };

  useEffect(() => {
    const savedSearch = localStorage.getItem("search") || "";
    const filters = getSelectedFilters();

    setLastSearchValue(savedSearch);
    setlastFilters(filters);
    fetchAllHealthVideos(
      currentPageForPending,
      savedSearch,
      filters?.dateFilter
    );
  }, [currentPageForPending, isArchivedView]);

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
        setCurrentPageForPending(0);
        fetchAllHealthVideos(0, currentSearchValue, currentFilters?.dateFilter);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lastSearchValue, isArchivedView, lastFilters]);

  // Watch for filter changes
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
        setCurrentPageForPending(0);
        fetchAllHealthVideos(0, currentSearchValue, currentFilters?.dateFilter);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lastFilters, isArchivedView]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "search" || e.key === "selectedFilters") {
        const newSearchValue = localStorage.getItem("search") || "";
        const newFilters = getSelectedFilters();
        setlastFilters(newFilters);

        setLastSearchValue(newSearchValue);
        setCurrentPageForPending(0);
        fetchAllHealthVideos(0, newSearchValue, newFilters?.dateFilter);
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [isArchivedView]);

  useEffect(() => {
    const savedSearch = localStorage.getItem("search") || "";
    const filters = getSelectedFilters();

    setLastSearchValue(savedSearch);
    setlastFilters(filters);
    fetchAllHealthVideos(
      currentPageForPending,
      savedSearch,
      filters?.dateFilter
    );
  }, [currentPageForPending]);

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
      <Box mt={2}>
        <CommonCard>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" fontWeight={500}>
              {isArchivedView ? "Archived videos" : "Recent videos"}
            </Typography>
          </Box>
          <Box>
            <Grid2 container spacing={2} mt={2}>
              {activeVideosData.map((video) => (
                <Grid2
                  key={video._id}
                  size={{ md: 6, sm: 6, xs: 12, lg: 4, xl: 4 }}
                >
                  <HealthVideoCard
                    video={video}
                    anchorEl={anchorEl}
                    selectedRow={selectedRow}
                    onActionClick={handleActionClick}
                    onActionItemClick={handleActionItemClick}
                    onClose={handleClose}
                  />
                </Grid2>
              ))}
              {!(activeVideosData?.length > 0) && (
                <Box sx={{ textAlign: "center", width: "100%" }}>
                  <Typography
                    variant="h6"
                    fontWeight={500}
                    textAlign={"center"}
                  >
                    No videos Found
                  </Typography>
                </Box>
              )}
            </Grid2>
          </Box>
        </CommonCard>
      </Box>

      <Box mt={3}>
        <Pagination
          page={currentPageForPending}
          totalPages={totalPagesForPending}
          onPageChange={handlePageChangeForPending}
        />
      </Box>
    </Box>
  );
};

export default AllHealthVideos;
