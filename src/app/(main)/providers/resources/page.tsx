"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useTheme } from "@mui/material/styles";
import { CircularProgress, useMediaQuery } from "@mui/material";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Grid2 from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import OverviewCard from "@/components/Cards/Overview";
import CommonButton from "@/components/CommonButton";
import CommonCard from "@/components/Cards/Common";
import { useRouterLoading } from "@/hooks/useRouterLoading";
import ArticleCard from "@/components/Articles";
import {
  getAllProviderResources,
  getResourceSummary,
} from "@/services/api/supportApi";

interface ResourceSummaryData {
  total: number | null;
  active: number | null;
  topCategory: string | null;
  overallEngagementRate: string | number | null;
}

export interface Category {
  name: string;
  value: number;
}

export interface Article {
  _id: string;
  thumbnailUrl: string;
  category: Category[];
  title: string;
  createdAt: string;
}

export interface ResourcesAllData {
  data: {
    success: boolean;
    message: string;
    data: Resource[];
    meta: Meta;
  };
}

export interface ResourcesSummaryResponse {
  data: {
    success: boolean;
    message: string;
    data: ResourceSummaryData;
  };
}

export interface Resource {
  _id: string;
  title: string;
  thumbnailUrl?: string;
  category: string[];
  isSrtAvailable?: boolean;
  srtUrl?: string | null;
  article: ArticleData[];
  conclusion?: ConclusionData[];
  userType?: number[];
  createdAt: string;
  updatedAt?: string;
  __v?: number;
}

export interface ConclusionData {
  subTitle: string;
  text: string;
}

export interface ArticleData {
  subTitle: string;
  text: string;
  subText?: string | null;
  imageUrl?: string;
  caption?: string;
}

export interface Meta {
  totalDocs: number;
  limit: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: number | null;
  prevPage: number | null;
}
const Resources: React.FC = () => {
  const theme = useTheme();
  const { navigateWithLoading } = useRouterLoading();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [resourceSummary, setResourceSummary] =
    useState<ResourceSummaryData | null>(null);
  const [rowsPerPage] = useState<number>(10);
  const [recentResources, setRecentResources] = useState<Resource[]>([]);
  const [archievedResources, setArchievedResources] = useState<Resource[]>([]);

  useEffect(() => {
    fetchResourcesSummary();
    fetchAllRecentResources(0);
    fetchAllArchievedResources(0);
  }, []);

  const data = useMemo(() => {
    return [
      {
        icon: "/assets/svg/provider/profile/total_articles.svg",
        title: "Total articles",
        count:
          resourceSummary?.total !== null &&
          resourceSummary?.total !== undefined
            ? resourceSummary?.total === 0
              ? "0"
              : resourceSummary?.total
            : "N/A",
      },
      {
        icon: "/assets/svg/provider/profile/active_articles.svg",
        title: "Total active articles",
        count:
          resourceSummary?.active !== null &&
          resourceSummary?.active !== undefined
            ? resourceSummary?.active === 0
              ? "0"
              : resourceSummary?.active
            : "N/A",
      },
      {
        icon: "/assets/svg/assessment/check_icon.svg",
        title: "Top category",
        count:
          resourceSummary?.topCategory !== null &&
          resourceSummary?.topCategory !== undefined
            ? resourceSummary?.topCategory
            : "N/A",
      },
      {
        icon: "/assets/svg/health-videos/discount.svg",
        title: "Engagement rate",
        count:
          resourceSummary?.overallEngagementRate !== null &&
          resourceSummary?.overallEngagementRate !== undefined
            ? resourceSummary?.overallEngagementRate === 0
              ? "0%"
              : `${resourceSummary?.overallEngagementRate} %`
            : "N/A",
      },
    ];
  }, [resourceSummary]);

  const fetchResourcesSummary = async () => {
    try {
      const response = (await getResourceSummary()) as ResourcesSummaryResponse;
      if (response?.data?.success) {
        setResourceSummary(response?.data?.data);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const fetchAllRecentResources = async (page: number) => {
    setIsLoading(true);
    try {
      const response = (await getAllProviderResources({
        limit: rowsPerPage,
        page: page + 1,
        // status: 1,
      })) as ResourcesAllData;
      if (response?.data?.success) {
        setRecentResources(response?.data?.data);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllArchievedResources = async (page: number) => {
    setIsLoading(true);
    try {
      const response = (await getAllProviderResources({
        limit: rowsPerPage,
        page: page + 1,
        status: 2, // Archieved = 2
      })) as ResourcesAllData;
      if (response?.data?.success) {
        setArchievedResources(response?.data?.data);
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
              Resource articles
            </Typography>
            <Typography variant="caption" fontWeight={400}>
              Expert tips, care advice, and easy-to-follow guides
            </Typography>
          </Box>
          <CommonButton
            buttonText="Create New Article"
            sx={{ maxWidth: isMobile ? "100%" : "max-content", height: "45px" }}
            buttonTextStyle={{ fontSize: "14px !important" }}
            onClick={() =>
              navigateWithLoading("/providers/resources/create-new-article")
            }
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
              Recent articles
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
                    "/providers/resources/view-all?isArchieve=false"
                  )
                }
              />
            </Box>
          </Box>
          <Box mt={3}>
            <Grid2 container spacing={2} mt={2}>
              {recentResources.slice(0, 3).map((doc) => (
                <Grid2
                  key={doc._id}
                  size={{ md: 6, sm: 6, xs: 12, lg: 4, xl: 4 }}
                >
                  <ArticleCard
                    video={doc}
                    onClick={() =>
                      navigateWithLoading(
                        `/providers/resources/preview-article?id=${doc._id}`
                      )
                    }
                    onEdit={(v) =>
                      navigateWithLoading(
                        `/providers/resources/create-new-article?id=${v._id}`
                      )
                    }
                    onArchive={(v) => console.log("Archive article:", v._id)}
                    // selectedRow={selectedRow}
                  />
                </Grid2>
              ))}
              {!(recentResources?.length > 0) && (
                <Box sx={{ textAlign: "center", width: "100%" }}>
                  <Typography
                    variant="h6"
                    fontWeight={500}
                    textAlign={"center"}
                  >
                    No articles Found
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
              Archived articles
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
                    "/providers/resources/view-all?isArchieve=true"
                  )
                }
              />
            </Box>
          </Box>
          <Box mt={3}>
            <Grid2 container spacing={2} mt={2}>
              {archievedResources.slice(0, 3).map((doc) => (
                <Grid2
                  key={doc._id}
                  size={{ md: 6, sm: 6, xs: 12, lg: 4, xl: 4 }}
                >
                  <ArticleCard
                    video={doc}
                    onClick={() =>
                      navigateWithLoading(
                        `/providers/resources/view-all/${doc._id}`
                      )
                    }
                    onEdit={(v) =>
                      navigateWithLoading(
                        `/providers/resources/preview-article?id=${v._id}`
                      )
                    }
                    onArchive={(v) => console.log("Archive article:", v._id)}
                  />
                </Grid2>
              ))}
              {!(archievedResources?.length > 0) && (
                <Box sx={{ textAlign: "center", width: "100%" }}>
                  <Typography
                    variant="h6"
                    fontWeight={500}
                    textAlign={"center"}
                  >
                    No articles Found
                  </Typography>
                </Box>
              )}
            </Grid2>
          </Box>
        </CommonCard>
      </Box>
    </Box>
  );
};

export default Resources;
