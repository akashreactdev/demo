"use client";
import React, { useState } from "react";
import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Pagination from "../Pagination";

interface CommonTableProps {
  rows?: GridRowsProp;
  column?: GridColDef[];
  rowsPerPage?: number;
  isPaginations?: boolean;
  isLoading?: boolean;
  currentPage?: number;
  onPageChange?: (newPage: number) => void;
  totalItems?: number;
}

const CommonTable: React.FC<CommonTableProps> = ({
  rows = [],
  column = [],
  rowsPerPage = 10,
  isPaginations,
  isLoading,
  currentPage = 0,
  onPageChange,
  totalItems = 0,
}) => {
  const [localPage, setLocalPage] = useState(0);
  const theme = useTheme();
  const isApiPagination = !!onPageChange;
  const page = isApiPagination ? currentPage : localPage;

  const processedRows = Array.isArray(rows)
    ? rows.map((row) => ({
        ...row,
        id: row._id || row.id,
      }))
    : [];

  const visibleRows = isApiPagination
    ? processedRows
    : processedRows.slice(
        localPage * rowsPerPage,
        (localPage + 1) * rowsPerPage
      );

  const totalPages = isApiPagination
    ? Math.ceil(totalItems / rowsPerPage)
    : Math.ceil(rows.length / rowsPerPage);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      if (isApiPagination && onPageChange) {
        onPageChange(newPage);
      } else {
        setLocalPage(newPage);
      }
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <DataGrid
        rows={visibleRows}
        columns={column}
        disableColumnMenu
        disableRowSelectionOnClick
        hideFooter
        disableColumnSorting={true}
        getRowId={(row) => row._id || row.id}
        sx={{
          backgroundColor: theme.palette.common.white,
          border: `1px solid ${theme.pending.secondary}`,
          borderRadius: 2,
          textAlign: "center",
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
            display: "flex",
            alignItems: "center",
          },
          ".MuiDataGrid-columnSeparator": {
            display: "none",
          },
          "&.MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-columnHeader": {
            backgroundColor: theme.pending.secondary,
            borderBottom: "none",
            fontSize: "15px",
            fontWeight: 500,
            color: theme.palette.common.black,
            opacity: 0.5,
            cursor: "default",
          },
        }}
        loading={isLoading}
        localeText={{
          noRowsLabel: "No data",
        }}
      />

      {isPaginations && !isLoading && (
        <Box mt={3}>
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </Box>
      )}
    </Box>
  );
};

export default CommonTable;
