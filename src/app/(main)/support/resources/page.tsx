"use client";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useTheme } from "@mui/material/styles";
import { CircularProgress, useMediaQuery } from "@mui/material";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Grid2 from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import OverviewCard from "@/components/Cards/Overview";
import CommonButton from "@/components/CommonButton";
import CommonCard from "@/components/Cards/Common";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useRouterLoading } from "@/hooks/useRouterLoading";
import ArticleCard from "@/components/Articles";
import {
  ArchieveProviderResource,
  deleteProviderResource,
  getAllProviderFAQs,
  getAllProviderResources,
  getResourceSummary,
  getSingleResources,
} from "@/services/api/supportApi";
import CommonAccordion from "@/components/CommonAccordian";
import { UserBases } from "@/constants/usersData";
import { ResourceResponse } from "./preview-article/page";

interface ResourceSummaryData {
  totalArticle: number | null;
  totalFaq: number | null;
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

export interface FAQItem {
  _id: string;
  userId: string;
  userType: number[];
  question: string;
  answer: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface FAQApiResponse {
  data: {
    success: boolean;
    message: string;
    data: {
      items: FAQItem[];
      meta: Meta;
    };
  };
}

export interface RemoveArticleResponse {
  data: {
    success: boolean;
    message: string;
  };
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
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [faqData, setFaqData] = useState<FAQItem[]>([]);
  const open = Boolean(anchorEl);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (path: string) => {
    navigateWithLoading(path);
    handleClose();
  };

  useEffect(() => {
    fetchResourcesSummary();
    fetchAllRecentResources(0);
    fetchAllArchievedResources(0);
    fetchAllFAQs(0);
    localStorage.removeItem("PreviewArticle");
  }, []);

  const data = useMemo(() => {
    return [
      {
        icon: "/assets/svg/provider/profile/total_articles.svg",
        title: "Total articles",
        count:
          resourceSummary?.totalArticle !== null &&
          resourceSummary?.totalArticle !== undefined
            ? resourceSummary?.totalArticle === 0
              ? "0"
              : resourceSummary?.totalArticle
            : "N/A",
      },
      {
        icon: "/assets/svg/provider/profile/active_articles.svg",
        title: "Total FAQ's",
        count:
          resourceSummary?.totalFaq !== null &&
          resourceSummary?.totalFaq !== undefined
            ? resourceSummary?.totalFaq === 0
              ? "0"
              : resourceSummary?.totalFaq
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

  const fetchAllFAQs = async (page: number) => {
    setIsLoading(true);
    try {
      const response = (await getAllProviderFAQs({
        limit: rowsPerPage,
        page: page + 1,
        // status: 1,
      })) as FAQApiResponse;
      if (response?.data?.success) {
        setFaqData(response?.data?.data?.items);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllRecentResources = async (page: number) => {
    setIsLoading(true);
    try {
      const response = (await getAllProviderResources({
        limit: rowsPerPage,
        page: page + 1,
        status: 1,
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

  const handleDeleteBtnClick = (resourceId: string) => {
    deleteResourceData(resourceId);
  };

  const deleteResourceData = async (resourceId: string) => {
    setIsLoading(true);
    try {
      const response = (await deleteProviderResource(
        resourceId
      )) as RemoveArticleResponse;
      if (response?.data?.success) {
        toast.success(response?.data?.message);
        fetchResourcesSummary();
        fetchAllRecentResources(0);
        fetchAllArchievedResources(0);
        fetchAllFAQs(0);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleArchieveBtnClick = (resourceId: string) => {
    archieveResourceData(resourceId);
  };

  const archieveResourceData = async (resourceId: string) => {
    setIsLoading(true);
    try {
      const payload = {
        status: 2,
      };
      const response = (await ArchieveProviderResource(
        resourceId,
        payload
      )) as RemoveArticleResponse;
      if (response?.data?.success) {
        toast.success(response?.data?.message);
        fetchResourcesSummary();
        fetchAllRecentResources(0);
        fetchAllArchievedResources(0);
        fetchAllFAQs(0);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSingleResourceData = async (resourceId: string) => {
    setIsLoading(true);
    try {
      const response = (await getSingleResources(
        resourceId
      )) as ResourceResponse;
      if (response?.data?.success) {
        localStorage.setItem(
          "PreviewArticle",
          JSON.stringify(response?.data?.data)
        );
        navigateWithLoading(
          `/support/resources/preview-article?id=${resourceId}`
        );
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
          <Box
            component={"button"}
            sx={{
              maxWidth: isMobile ? "100%" : "max-content",
              height: "45px",
              backgroundColor: theme.pending.main,
              borderRadius: "8px",
              border: "none",
              padding: "14px 16px",
              cursor: "pointer",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 1,
            }}
            onClick={(event: React.MouseEvent<HTMLButtonElement>) =>
              setAnchorEl(event.currentTarget)
            }
          >
            <Typography
              variant="body1"
              fontSize={"14px"}
              mt={0.5}
              fontWeight={500}
            >
              Create New Resource
            </Typography>
            <KeyboardArrowDownIcon />
          </Box>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            PaperProps={{
              sx: {
                border: "1px solid #E2E6EB",
                borderRadius: "10px",
              },
            }}
            sx={{ marginTop: "10px" }}
          >
            <MenuItem
              onClick={() =>
                handleMenuItemClick("/support/resources/create-new-article")
              }
            >
              Article
            </MenuItem>
            <MenuItem
              onClick={() =>
                handleMenuItemClick("/support/resources/create-new-faq")
              }
            >
              FAQ
            </MenuItem>
          </Menu>
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
                    "/support/resources/view-all?isArchieve=false"
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
                    onClick={
                      () => fetchSingleResourceData(doc._id)
                      // navigateWithLoading(
                      //   `/support/resources/preview-article?id=${doc._id}`
                      // )
                    }
                    onEdit={(v) =>
                      navigateWithLoading(
                        `/support/resources/create-new-article?id=${v._id}`
                      )
                    }
                    onArchive={(v) => handleArchieveBtnClick(v._id)}
                    onDelete={(v) => handleDeleteBtnClick(v._id)}
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
                    "/support/resources/view-all?isArchieve=true"
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
                        `/support/resources/preview-article?id=${doc._id}`
                      )
                    }
                    onEdit={(v) =>
                      navigateWithLoading(
                        `/support/resources/preview-article?id=${v._id}`
                      )
                    }
                    isArchive={true}
                    onArchive={(v) => console.log("Archive article:", v._id)}
                    onDelete={(v) => handleDeleteBtnClick(v._id)}
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
              Frequently Asked Questions
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
                  navigateWithLoading("/support/resources/all-faqs")
                }
              />
            </Box>
          </Box>
          <Box mt={2}>
            {faqData && faqData.length > 0 ? (
              faqData?.slice(0, 5).map((data, index) => (
                <CommonAccordion
                  key={index}
                  title={`${data?.question} - ${
                    data.userType && data.userType.length > 0
                      ? data.userType.map((type) => UserBases[type]).join(", ")
                      : "N/A"
                  }`}
                  defaultExpanded={false}
                  sx={{ paddingBottom: "10px", marginBottom: "10px" }}
                >
                  <Typography
                    variant="body1"
                    dangerouslySetInnerHTML={{
                      __html: data?.answer || "",
                    }}
                  />
                </CommonAccordion>
              ))
            ) : (
              <Typography variant="body2" sx={{ textAlign: "center", py: 2 }}>
                No FAQ found
              </Typography>
            )}
          </Box>
        </CommonCard>
      </Box>
    </Box>
  );
};

export default Resources;
