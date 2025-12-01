"use client";
import React, { useEffect, useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Grid2 from "@mui/material/Grid2";
//relative path imports
import CommonCard from "@/components/Cards/Common";
import ApprovalListItem from "@/components/carers/profile/ApprovalListItem";
import { useRouterLoading } from "@/hooks/useRouterLoading";
import OverviewCard from "@/components/Cards/Overview";
import { FiltersObjects, getSelectedFilters } from "@/types/singleUserInfoType";
import { getAllPaymentDispute } from "@/services/api/carerApi";
import Pagination from "@/components/Pagination";
import { CircularProgress } from "@mui/material";
import moment from "moment";
import {
  Meta,
  PassportItem,
  PassportListResponse,
} from "@/types/paymentDispute";

const PaymentDisputes: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [rowsPerPage] = useState<number>(10);
  const [passportListData, setPassportListData] = useState<PassportItem[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const { navigateWithLoading } = useRouterLoading();
  const [lastSearchValue, setLastSearchValue] = useState<string>("");
  const [lastFilters, setlastFilters] = useState<FiltersObjects>(() =>
    getSelectedFilters()
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    const savedSearch = localStorage.getItem("search") || "";
    const filters = getSelectedFilters();

    setLastSearchValue(savedSearch);
    setlastFilters(filters);

    fetchAllPassportDisputeData(currentPage, savedSearch, filters?.dateFilter);
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
        fetchAllPassportDisputeData(
          currentPage,
          currentSearchValue,
          currentFilters?.dateFilter
        );
      }
    }, 500);

    return () => clearInterval(interval);
  }, [lastSearchValue, currentPage, lastFilters]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "search" || e.key === "selectedFilters") {
        const newSearchValue = localStorage.getItem("search") || "";
        const newFilters = getSelectedFilters();
        setLastSearchValue(newSearchValue);
        setlastFilters(newFilters);
        fetchAllPassportDisputeData(
          currentPage,
          newSearchValue,
          newFilters?.dateFilter
        );
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [currentPage]);

  const fetchAllPassportDisputeData = async (
    page: number,
    searchQuery?: string,
    dateJoined?: string | number | null
  ) => {
    setIsLoading(true);
    try {
      const response = (await getAllPaymentDispute({
        limit: rowsPerPage,
        page: page + 1,
        role: 5, // role = 5 = provider
        search: searchQuery,
        ...(dateJoined && { dateJoined: dateJoined }),
      })) as PassportListResponse;
      if (response?.data?.success) {
        setPassportListData(response?.data?.data);
        setMeta(response?.data?.meta);
        setTotalItems(response?.data?.meta?.totalPages);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  const overviewData = useMemo(() => {
    return [
      {
        icon: "/assets/svg/carers/overview/alert_sign.svg",
        title: "Total disputes",
        count: meta?.totalDocs?.toString() ?? "0",
      },
      {
        icon: "/assets/svg/carers/verifications/approval.svg",
        title: "Solved disputes",
        count: meta?.totalResolved?.toString() ?? "0",
      },
      {
        icon: "/assets/svg/carers/overview/currency_pound.svg",
        title: "Amount processed",
        count: `£${meta?.totalResolvedAmount ?? 0}`,
      },
    ];
  }, [meta]);

  const handleOnclick = (ele: PassportItem) => {
    localStorage.setItem("selectProviderPaymentDispute", JSON.stringify(ele));
    navigateWithLoading(`/providers/payment-disputes/${ele._id}`);
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
        {overviewData.map((ele, index) => {
          return (
            <Grid2 key={index} size={{ md: 6, sm: 6, xs: 12, lg: 4, xl: 4 }}>
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
      <Box mt={3}>
        <CommonCard>
          <Typography variant="h6" fontWeight={500}>
            Awaiting approval
          </Typography>
          <Typography variant="caption" fontWeight={400}>
            This displays payments from Zorbee to a provider that are awaiting
            approval.
          </Typography>

          <Box mt={5}>
            {passportListData.map((ele, index) => {
              return (
                <Box key={index}>
                  <ApprovalListItem
                    profilePic={
                      ele?.userId?.profile != "image/provider" &&
                      ele?.userId?.profile != null
                        ? `${process.env.NEXT_PUBLIC_ASSETS_URL}/${ele?.userId?.profile}`
                        : `/assets/images/profile.jpg`
                    }
                    profileName={
                      ele?.userId?.firstName ||
                      "" + " " + ele?.userId?.lastName ||
                      ""
                    }
                    dateTitle={"Date requested"}
                    date={moment(ele?.createdAt).format("Do MMMM YYYY")}
                    approvalTitle={"Awaiting approval"}
                    approvalVariant={"primary"}
                    isRowButton={true}
                    amount={Number(ele?.invoiceId?.totalAmount) || 0}
                    sx={{
                      "&:hover": {
                        backgroundColor: "#EAEAEA",
                      },
                      backgroundColor: "transparent",
                      padding: "20px",
                      borderRadius: "15px",
                      cursor: "pointer",
                      border: "none",
                    }}
                    onClickMenuBtn={() => handleOnclick(ele)}
                  />
                  {/* {index < arr.length - 1 && <Divider sx={{ mt: 3 }} />} */}
                  <Divider sx={{ my: 1 }} />
                </Box>
              );
            })}
          </Box>
        </CommonCard>
        <Box mt={3}>
          <Pagination
            page={currentPage}
            totalPages={totalItems}
            onPageChange={handlePageChange}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default PaymentDisputes;
