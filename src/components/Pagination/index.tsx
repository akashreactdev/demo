"use client";
import React from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import { SxProps, Theme } from "@mui/material";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
//relative path imports
import CommonCard from "../Cards/Common";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
  sx?: SxProps<Theme>;
}

const StyledBox = styled(Box)(({ theme }) => ({
  width: "100%",
  backgroundColor: theme.palette.common.white,
  borderRadius: "10px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
}));

const PageButton = styled(Button)(({ theme }) => ({
  minWidth: "40px",
  height: "40px",
  margin: "0 5px",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: theme.palette.text.secondary,
  "&.active": {
    backgroundColor: "#FFD600",
    color: theme.palette.common.black,
    fontWeight: 500,
  },
  [theme.breakpoints.down("sm")]: {
    minWidth: "30px",
    height: "30px",
  },
}));

const NavigationButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== "isBgColor",
})<{ isBgColor?: boolean }>(({ theme, isBgColor }) => ({
  padding: "10px 16px",
  minWidth: "auto",
  color: theme.palette.text.primary,
  fontWeight: 500,
  backgroundColor: isBgColor ? "#F9D835" : "transparent",
  borderRadius: "8px",
  textTransform: "none",
  [theme.breakpoints.down("sm")]: {
    padding: "8px",
  },
}));

const Pagination: React.FC<PaginationProps> = ({
  page,
  totalPages,
  onPageChange,
  sx,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      onPageChange(newPage);
    }
  };

  const getPageNumbers = () => {
    const maxPagesToShow = 5;
    const half = Math.floor(maxPagesToShow / 2);
    let start = Math.max(0, page - half);
    const end = Math.min(totalPages, start + maxPagesToShow);

    if (end - start < maxPagesToShow) {
      start = Math.max(0, end - maxPagesToShow);
    }

    return Array.from({ length: end - start }, (_, i) => start + i);
  };

  return (
    <CommonCard sx={sx}>
      <StyledBox>
        {/* Previous Button */}
        <NavigationButton
          isBgColor={page > 0}
          startIcon={!isMobile && <ChevronLeftIcon sx={{ fontSize: "12px" }} />}
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 0}
        >
          {!isMobile ? "Previous Page" : <ChevronLeftIcon />}
        </NavigationButton>

        {/* Page Numbers or "Page X of Y" */}
        {isMobile ? (
          <Typography variant="body2">
            Page {page + 1} of {totalPages}
          </Typography>
        ) : (
          <Stack direction="row" alignItems="center" spacing={1}>
            {getPageNumbers().map((pageNum) => (
              <PageButton
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={pageNum === page ? "active" : ""}
              >
                {pageNum + 1}
              </PageButton>
            ))}
            {totalPages > getPageNumbers().at(-1)! + 1 && (
              <Typography variant="body2" sx={{ mx: 1 }}>
                ...
              </Typography>
            )}
          </Stack>
        )}

        {/* Next Button */}
        <NavigationButton
          isBgColor={page < totalPages - 1}
          endIcon={!isMobile && <ChevronRightIcon sx={{ fontSize: "12px" }} />}
          onClick={() => handlePageChange(page + 1)}
          disabled={page >= totalPages - 1}
        >
          {!isMobile ? "Next Page" : <ChevronRightIcon />}
        </NavigationButton>
      </StyledBox>
    </CommonCard>
  );
};

export default Pagination;
