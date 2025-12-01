"use client";
import React, { useEffect, useState } from "react";
// import { useTheme } from "@mui/material/styles";
import { CircularProgress } from "@mui/material";
// import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Grid2 from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
// import CommonButton from "@/components/CommonButton";
import CommonCard from "@/components/Cards/Common";
import { useRouterLoading } from "@/hooks/useRouterLoading";
import ArticleCard from "@/components/Articles";
import Pagination from "@/components/Pagination";
import { useSearchParams } from "next/navigation";
import { getAllProviderResources } from "@/services/api/supportApi";
import { FiltersObjects, getSelectedFilters } from "@/types/singleUserInfoType";

export interface Category {
  name: string;
  value: number;
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

export interface Resource {
  _id: string;
  title: string;
  thumbnailUrl?: string;
  category: string[];
  isSrtAvailable?: boolean;
  srtUrl?: string | null;
  article: ArticleData[];
  conclusion?: ConclusionData[];
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

const AllArticlesList: React.FC = () => {
  //   const theme = useTheme();
  const queryParams = useSearchParams();
  const { navigateWithLoading } = useRouterLoading();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [recentResources, setRecentResources] = useState<Resource[]>([]);
  const [rowsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalpages] = useState<number>(0);
  const [lastSearchValue, setLastSearchValue] = useState<string>("");
  const [lastFilters, setlastFilters] = useState<FiltersObjects>(() =>
    getSelectedFilters()
  );

  useEffect(() => {
    const savedSearch = localStorage.getItem("search") || "";
    const filters = getSelectedFilters();

    setLastSearchValue(savedSearch);
    setlastFilters(filters);
    fetchAllResources(currentPage, savedSearch, filters?.dateFilter);
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
        fetchAllResources(
          currentPage,
          currentSearchValue,
          currentFilters?.dateFilter
        );
      }
    }, 500);

    return () => clearInterval(interval);
  }, [lastSearchValue, lastFilters, currentPage]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "search" || e.key === "selectedFilters") {
        const newSearchValue = localStorage.getItem("search") || "";
        const newFilters = getSelectedFilters();
        setLastSearchValue(newSearchValue);
        setlastFilters(newFilters);
        fetchAllResources(currentPage, newSearchValue, newFilters?.dateFilter);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [currentPage]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const fetchAllResources = async (
    page: number,
    searchQuery?: string,
    dateJoined?: string | number | null
  ) => {
    setIsLoading(true);
    try {
      const isActive = queryParams.get("isArchieve");
      const response = (await getAllProviderResources({
        limit: rowsPerPage,
        page: page + 1,
        ...(isActive === "true" ? { status: 2 } : {}),
        search: searchQuery,
        ...(dateJoined && { dateAdded: dateJoined }),
      })) as ResourcesAllData;
      if (response?.data?.success) {
        setRecentResources(response?.data?.data);
        setTotalpages(response?.data?.meta?.totalPages);
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
        <Box>
          <Typography variant="h6" fontWeight={500}>
            {queryParams.get("isArchieve") === "true"
              ? "Archived articles"
              : "Recent articles"}
          </Typography>
        </Box>
        <Box mt={3}>
          <Grid2 container spacing={2} mt={2}>
            {recentResources.map((doc) => (
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
                />
              </Grid2>
            ))}
            {!(recentResources?.length > 0) && (
              <Box sx={{ textAlign: "center", width: "100%" }}>
                <Typography variant="h6" fontWeight={500} textAlign={"center"}>
                  No articles Found
                </Typography>
              </Box>
            )}
          </Grid2>
        </Box>
      </CommonCard>
      <Box mt={3}>
        <Pagination
          page={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </Box>
    </Box>
  );
};

export default AllArticlesList;
