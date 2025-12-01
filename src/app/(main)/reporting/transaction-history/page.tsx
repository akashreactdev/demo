"use client";
import React, { useEffect, useState } from "react";
import { styled, useTheme } from "@mui/material/styles";
import { GridColDef } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import CommonTable from "@/components/CommonTable";
import CommonCard from "@/components/Cards/Common";
import { FiltersObjects, getSelectedFilters } from "@/types/singleUserInfoType";
import { DateFilterOptions } from "@/constants/usersData";
import { getAllTransactionHistoryData } from "@/services/api/reportingsAPI";
import moment from "moment";

interface StyledChipProps {
  isBgColor?: string;
}

const StyledChip = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isBgColor",
})<StyledChipProps>(({ theme, isBgColor }) => ({
  height: "30px",
  width: "70%",
  paddingBlock: "10px",
  borderRadius: "3px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: isBgColor || theme.palette.primary.main,
}));

export interface TransactionItem {
  id: number;
  sender_id: string;
  sender_name: string;
  sender_email: string;
  receiver_id: string;
  role: number | null;
  receiver_firstname: string | null;
  amount: string;
  trx: string;
  invoice_id: string;
  agreement_id: string | null;
  status: string;
  transation_date: string;
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

export interface TransactionsResponse {
  data: {
    success: boolean;
    message: string;
    data: {
      items: TransactionItem[];
      meta: Meta;
    };
  };
}

const TransactionHistory: React.FC = () => {
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [rowsPerPage] = useState<number>(10);
  const [historyData, setHistoryData] = useState<TransactionItem[]>([]);
  const [lastSearchValue, setLastSearchValue] = useState<string>("");
  const [lastFilters, setlastFilters] = useState<FiltersObjects>(() =>
    getSelectedFilters()
  );

  type TransactionStatus = "Pending" | "Completed" | "Canceled";

  // Map API status to display status
  const mapStatus = (status: string): TransactionStatus => {
    switch (status.toLowerCase()) {
      case "pending":
      case "held":
        return "Pending";
      case "completed":
        return "Completed";
      case "canceled":
        return "Canceled";
      default:
        return "Pending";
    }
  };

  const statusBgColor: Record<TransactionStatus, string> = {
    Pending: theme.pending.background.primary,
    Completed: theme.accepted.background.primary,
    Canceled: theme.declined.background.primary,
  };

  const statusTitleColor: Record<TransactionStatus, string> = {
    Pending: theme.pending.main,
    Completed: theme.accepted.main,
    Canceled: theme.declined.main,
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  useEffect(() => {
    const savedSearch = localStorage.getItem("search") || "";
    const filters = getSelectedFilters();

    setLastSearchValue(savedSearch);
    setlastFilters(filters);

    fetchAllCarerList(
      currentPage,
      savedSearch,
      filters?.transactionPaymentStatus,
      filters?.transactionPaymentType,
      filters?.transactionDate
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
        fetchAllCarerList(
          currentPage,
          currentSearchValue,
          currentFilters?.transactionPaymentStatus,
          currentFilters?.transactionPaymentType,
          currentFilters?.transactionDate
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
        fetchAllCarerList(
          currentPage,
          newSearchValue,
          newFilters?.transactionPaymentStatus,
          newFilters?.transactionPaymentType,
          newFilters?.transactionDate
        );
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [currentPage]);

  const fetchAllCarerList = async (
    page: number,
    searchQuery?: string,
    transactionPaymentStatus?: string | number | null,
    transactionPaymentType?: string | number | null,
    transactionDate?: string | number | null
  ) => {
    setIsLoading(true);
    try {
      const response = (await getAllTransactionHistoryData({
        limit: rowsPerPage,
        page: page + 1,
        search: searchQuery,
        ...(transactionPaymentStatus && {
          status: transactionPaymentStatus,
        }),
        ...(transactionPaymentType && {
          role: transactionPaymentType,
        }),
        ...(transactionDate && {
          dateAdded: DateFilterOptions.find((opt) => opt.value === transactionDate)
            ?.id,
        }),
      })) as TransactionsResponse;
      if (response?.data?.success) {
        setHistoryData(response?.data?.data?.items);
        setTotalItems(response?.data?.data?.meta?.totalDocs);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  const columns: GridColDef[] = [
    {
      field: "trx",
      headerName: "Transaction ID",
      flex: 1,
      minWidth: 140,
    },
    {
      field: "transation_date",
      headerName: "Transaction Date",
      flex: 1,
      minWidth: 140,
      renderCell: (params) => {
        return (
          <Typography variant="body1">
            {(params?.row?.transation_date &&
              moment(params?.row?.transation_date).format("DD.MM.YYYY")) ||
              "---"}
          </Typography>
        );
      },
    },
    {
      field: "sender_name",
      headerName: "From",
      flex: 1,
      minWidth: 140,
      renderCell: (params) => {
        return (
          <Stack
            flexDirection={"row"}
            justifyContent={"start"}
            alignItems={"center"}
            gap={2}
          >
            <Typography variant="body1">{params?.row?.sender_name}</Typography>
          </Stack>
        );
      },
    },
    {
      field: "type",
      headerName: "Payment type",
      flex: 1,
      minWidth: 140,
      renderCell: (params) => {
        const roleType =
          params?.row?.role === 2
            ? "User payment"
            : params?.row?.role === 3
            ? "Carer payment"
            : params?.row?.role === 4
            ? "Clinical payment"
            : params?.row?.role === 5
            ? "Provider payment"
            : "N/A";
        return (
          <Stack
            flexDirection={"row"}
            justifyContent={"start"}
            alignItems={"center"}
            gap={2}
          >
            <Typography variant="body1">{roleType || "N/A"}</Typography>
          </Stack>
        );
      },
    },
    {
      field: "amount",
      headerName: "Amount",
      flex: 1,
      minWidth: 140,
      renderCell: (params) => {
        const value = parseFloat(params.row.amount);
        const formattedAmount =
          (value >= 0 ? "+" : "-") + "£" + Math.abs(value).toFixed(2);
        return <Typography variant="body1">{formattedAmount}</Typography>;
      },
    },

    {
      field: "status",
      headerName: "Status",
      flex: 1,
      minWidth: 140,
      renderCell: (params) => {
        const legalStatus = mapStatus(params.row.status); // use mapping function
        const bgColor = statusBgColor[legalStatus] || "#E0E0E0";
        const titleColor = statusTitleColor[legalStatus] || "#000000";

        return (
          <Box
            height={"100%"}
            display={"flex"}
            alignItems={"center"}
            width={"100%"}
          >
            <StyledChip isBgColor={bgColor}>
              <Typography variant="caption" fontWeight={500} color={titleColor}>
                {legalStatus}
              </Typography>
            </StyledChip>
          </Box>
        );
      },
    },
  ];

  return (
    <Box>
      <CommonCard sx={{ mb: 4 }}>
        <Typography variant="h6" fontWeight={500}>
          Zorbee transaction history
        </Typography>
        <Typography variant="caption" fontWeight={400}>
          Let&apos;s review the transaction history.
        </Typography>
      </CommonCard>
      <Box mt={1}>
        <CommonTable
          column={columns}
          rows={historyData}
          isPaginations
          isLoading={isLoading}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          totalItems={totalItems}
          rowsPerPage={rowsPerPage}
        />
      </Box>
    </Box>
  );
};

export default TransactionHistory;
