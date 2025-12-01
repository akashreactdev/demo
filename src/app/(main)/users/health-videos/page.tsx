"use client";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { CircularProgress, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Grid2 from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import OverviewCard from "@/components/Cards/Overview";
import CommonCard from "@/components/Cards/Common";
import CommonButton from "@/components/CommonButton";
import HealthVideoCard from "@/components/HealthVideos/VideoCard";
import {
  getAllHealthVideos,
  updateHealthVideos,
  gethealthVideosSummary,
} from "@/services/api/usersApi";
import { useRouterLoading } from "@/hooks/useRouterLoading";
import { FiltersObjects, getSelectedFilters } from "@/types/singleUserInfoType";
import { UserPermissionsState } from "../overview/page";
import { AdminUserPermission } from "@/constants/accessData";
import SelectCancelModal from "@/components/CommonModal";

interface HealthVideosSummaryData {
  totalActiveVideos: string | number | null;
  totalVideos: string | number | null;
  engagementRate: string | number | null;
  topCategoryName: string | number | null;
}
interface HealthVideosSummarayResponse {
  data: {
    success: boolean;
    message: string;
    data: HealthVideosSummaryData;
  };
}

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

const HealthVideos: React.FC = () => {
  const theme = useTheme();
  const { navigateWithLoading } = useRouterLoading();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [rowsPerPage] = useState<number>(10);
  const [healthVideosSummary, setHealthVideosSummary] =
    useState<HealthVideosSummaryData | null>(null);
  const [activeVideosData, setActiveVideosData] = useState<VideoData[]>([]);
  const [archievedVideosData, setArchievedVideosData] = useState<VideoData[]>(
    []
  );
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedRow, setSelectedRow] = useState<string | null>(null);
  const [lastSearchValue, setLastSearchValue] = useState<string>("");
  const [lastFilters, setlastFilters] = useState<FiltersObjects>(() =>
    getSelectedFilters()
  );
  const [userPermissionsState, setUserPermissionsState] =
    useState<UserPermissionsState>({
      viewUserDetails: false,
      deactivateUserAccount: false,
      createHealthVideo: false,
    });
  const [isPermissionModalOpen, setIsPermissionModalOpen] =
    useState<boolean>(false);

  useEffect(() => {
    const savedPermissions = localStorage.getItem("userPermissions");
    if (savedPermissions) {
      try {
        const parsed: number[] = JSON.parse(savedPermissions);
        setUserPermissionsState({
          viewUserDetails: parsed.includes(
            AdminUserPermission.VIEW_USER_DETAILS
          ),
          deactivateUserAccount: parsed.includes(
            AdminUserPermission.DEACTIVATE_USER_ACCOUNT
          ),
          createHealthVideo: parsed.includes(
            AdminUserPermission.CREATE_HEALTH_VIDEO
          ),
        });
      } catch (err) {
        console.error(
          "Failed to parse carerPermissions from localStorage",
          err
        );
      }
    }
  }, []);

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
        fetchAllHealthVideos(0, lastSearchValue, lastFilters?.dateFilter);
        fetchAllArchievedHealthVideos(
          0,
          lastSearchValue,
          lastFilters?.dateFilter
        );
        fetchVideosSummary();
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

  const fetchVideosSummary = async () => {
    setIsLoading(true);
    try {
      const response =
        (await gethealthVideosSummary()) as HealthVideosSummarayResponse;
      if (response?.data?.success) {
        setHealthVideosSummary(response?.data?.data);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
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
        search: searchQuery,
        status: 1,
        ...(dateAdded && { dateAdded: dateAdded }),
      })) as VideosListResponse;
      if (response?.data?.success) {
        setActiveVideosData(response?.data?.data);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllArchievedHealthVideos = async (
    page: number,
    searchQuery?: string,
    dateAdded?: string | number | null
  ) => {
    setIsLoading(true);
    try {
      const response = (await getAllHealthVideos({
        limit: rowsPerPage,
        page: page + 1,
        status: 3,
        search: searchQuery,
        ...(dateAdded && { dateAdded: dateAdded }),
      })) as VideosListResponse;
      if (response?.data?.success) {
        setArchievedVideosData(response?.data?.data);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  const data = useMemo(() => {
    return [
      {
        icon: "/assets/svg/health-videos/video_player.svg",
        title: "Total videos",
        count:
          healthVideosSummary?.totalVideos !== null &&
          healthVideosSummary?.totalVideos !== undefined
            ? healthVideosSummary?.totalVideos === 0
              ? "0"
              : healthVideosSummary?.totalVideos
            : "N/A",
      },
      {
        icon: "/assets/svg/health-videos/paginate_filter_video.svg",
        title: "Total active videos",
        count:
          healthVideosSummary?.totalActiveVideos !== null &&
          healthVideosSummary?.totalActiveVideos !== undefined
            ? healthVideosSummary?.totalActiveVideos === 0
              ? "0"
              : healthVideosSummary?.totalActiveVideos
            : "N/A",
      },
      {
        icon: "/assets/svg/assessment/check_icon.svg",
        title: "Top category",
        count:
          healthVideosSummary?.topCategoryName !== null &&
          healthVideosSummary?.topCategoryName !== undefined
            ? healthVideosSummary?.topCategoryName === 0
              ? "0"
              : healthVideosSummary?.topCategoryName
            : "N/A",
      },
      {
        icon: "/assets/svg/health-videos/discount.svg",
        title: "Engagement rate",

        count:
          healthVideosSummary?.engagementRate !== null &&
          healthVideosSummary?.engagementRate !== undefined
            ? healthVideosSummary?.engagementRate === 0
              ? "0%"
              : `${healthVideosSummary?.engagementRate} %`
            : "N/A",
      },
    ];
  }, [healthVideosSummary]);

  useEffect(() => {
    const savedSearch = localStorage.getItem("search") || "";
    const filters = getSelectedFilters();

    setLastSearchValue(savedSearch);
    setlastFilters(filters);
    fetchAllHealthVideos(0, savedSearch, filters?.dateFilter);
    fetchAllArchievedHealthVideos(0, savedSearch, filters?.dateFilter);
    fetchVideosSummary();
  }, []);

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
        fetchAllHealthVideos(0, currentSearchValue, currentFilters?.dateFilter);
        fetchAllArchievedHealthVideos(
          0,
          currentSearchValue,
          currentFilters?.dateFilter
        );
      }
    }, 500);

    return () => clearInterval(interval);
  }, [lastSearchValue, lastFilters]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "search" || e.key === "selectedFilters") {
        const newSearchValue = localStorage.getItem("search") || "";
        const newFilters = getSelectedFilters();
        setlastFilters(newFilters);

        setLastSearchValue(newSearchValue);
        fetchAllHealthVideos(0, newSearchValue, newFilters?.dateFilter);
        fetchAllArchievedHealthVideos(
          0,
          newSearchValue,
          newFilters?.dateFilter
        );
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

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
        {data.map((ele, index) => {
          return (
            <Grid2 key={index} size={{ md: 6, sm: 6, xs: 12, lg: 3, xl: 3 }}>
              <OverviewCard
                path={ele.icon}
                alt={ele.icon}
                title={ele.title}
                count={ele.count}
              />
            </Grid2>
          );
        })}
      </Grid2>

      <CommonCard sx={{ mt: 3 }}>
        <Stack
          direction={isMobile ? "column" : "row"}
          alignItems={isMobile ? "flex-start" : "center"}
          justifyContent={"space-between"}
          spacing={isMobile ? 2 : 0}
        >
          <Box>
            <Typography variant="h6" fontWeight={500}>
              Health videos
            </Typography>
            <Typography variant="caption" fontWeight={400}>
              From HCI for on-demand support
            </Typography>
          </Box>
          <CommonButton
            buttonText="Add new video"
            sx={{ maxWidth: isMobile ? "100%" : "max-content" }}
            buttonTextStyle={{ fontSize: "14px !important" }}
            disabled={
              userPermissionsState?.createHealthVideo === false ? true : false
            }
            onClick={() => {
              if (userPermissionsState?.createHealthVideo) {
                navigateWithLoading("/users/health-videos/add-new-video");
              } else {
                setIsPermissionModalOpen(true);
              }
            }}
          />
        </Stack>
      </CommonCard>

      <Box mt={3}>
        <CommonCard>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" fontWeight={500}>
              Recent videos
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <CommonButton
                buttonText="View All"
                sx={{
                  maxWidth: isMobile ? "100%" : "max-content",
                  backgroundColor: theme.palette.common.white,
                }}
                buttonTextStyle={{ fontSize: "14px !important" }}
                onClick={() =>
                  navigateWithLoading(
                    "/users/health-videos/all-health-videos?isArchieve=false"
                  )
                }
              />
            </Box>
          </Box>
          <Box mt={3}>
            <Grid2 container spacing={2} mt={2}>
              {activeVideosData.slice(0, 3).map((video) => (
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
        <CommonCard>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" fontWeight={500}>
              Archived videos
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <CommonButton
                buttonText="View All"
                sx={{
                  maxWidth: isMobile ? "100%" : "max-content",
                  backgroundColor: theme.palette.common.white,
                }}
                buttonTextStyle={{ fontSize: "14px !important" }}
                onClick={() =>
                  navigateWithLoading(
                    "/users/health-videos/all-health-videos?isArchieve=true"
                  )
                }
              />
            </Box>
          </Box>
          <Box mt={3}>
            <Grid2 container spacing={2} mt={2}>
              {archievedVideosData.slice(0, 3).map((video) => (
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
              {!(archievedVideosData?.length > 0) && (
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
      <SelectCancelModal
        title="Message"
        question={`You don't have right to access this feature. Please ask the support team to update your rights.`}
        buttonText="Done"
        isOpen={isPermissionModalOpen}
        isCancelButtonShow={false}
        onRemove={() => setIsPermissionModalOpen(false)}
      />
    </Box>
  );
};

export default HealthVideos;
