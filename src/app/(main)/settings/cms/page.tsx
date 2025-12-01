"use client";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { IconButton, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import { GridColDef } from "@mui/x-data-grid";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
//relative path imports
import CommonTable from "@/components/CommonTable";
import CommonCard from "@/components/Cards/Common";
import CommonButton from "@/components/CommonButton";
import { deleteCms, getAllCms } from "@/services/api/cmsApi";
import CmsAddEditModal from "@/components/CmsAddEditModal";
import DeleteModal from "@/components/DeleteModal";
import { useRouterLoading } from "@/hooks/useRouterLoading";

interface CmsTermsData {
  title?: string;
  description?: string;
}
interface CMSData {
  _id?: number;
  title?: string;
  description?: string;
  alice?: string | null;
  createdAt?: string | null;
  terms?: CmsTermsData[];
  type?: string | null;
  updatedAt?: string | null;
  userId?: string | null;
  userRole?: string | null;
}

interface CMSResponse {
  data: {
    success: boolean;
    message: string;
    data: {
      cmsData: CMSData[];
      total: number;
    };
  };
}

interface CmsDeleteResponse {
  data: {
    success: boolean;
    message: string;
  };
}

const Cms = () => {
  const theme = useTheme();
const { navigateWithLoading } = useRouterLoading();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [DeletedRow, setDeletedRow] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [isAddEditModalShow, setIsAddEditModalShow] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [rowsPerPage] = useState<number>(10);
  const [data, setData] = useState<CMSData[]>([]);

  useEffect(() => {
    fetchAllCms(currentPage);
  }, [currentPage]);

  const fetchAllCms = async (page: number) => {
    setIsLoading(true);
    try {
      const response = (await getAllCms({
        limit: rowsPerPage,
        page: page + 1,
      })) as CMSResponse;
      if (response?.data?.success) {
        setData(response?.data?.data?.cmsData);
        setTotalItems(response?.data?.data?.total);
        setIsLoading(false);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const deleteCMS = async (cmsId: string) => {
    try {
      const response = (await deleteCms(cmsId)) as CmsDeleteResponse;
      if (response?.data?.success) {
        toast.success(response?.data?.message);
        fetchAllCms(currentPage);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleActionItemClick = (row: { title: string; alias?: string }) => {
    navigateWithLoading(`/settings/cms/edit?alias=${row?.alias}&title=${row?.title}`);
  };

  const handleDeleteActionClick = (row: string) => {
    setDeletedRow(row);
    setDeleteModalOpen(true);
  };

  const onDeleteModalClose = () => {
    setDeletedRow(null);
    setDeleteModalOpen(false);
  };

  const onDelete = () => {
    if (DeletedRow) {
      deleteCMS(DeletedRow);
      setDeleteModalOpen(false);
    }
  };

  const onAddEditModalClose = () => {
    setIsAddEditModalShow(false);
  };

  const onAddEditModalRemove = () => {
    setIsAddEditModalShow(false);
    fetchAllCms(currentPage);
  };

  const columns: GridColDef[] = [
    {
      field: "title",
      headerName: "Title",
      flex: 1,
      minWidth: 140,
      renderCell: (params) => {
        return (
          <Typography variant="body1">
            {(params?.row?.title && params?.row?.title) || "N/A"}
          </Typography>
        );
      },
    },
    {
      field: "alias",
      headerName: "Alias",
      flex: 1,
      minWidth: 140,
      renderCell: (params) => {
        return (
          <Typography variant="body1">
            {(params?.row?.title && params?.row?.alias) || "N/A"}
          </Typography>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 140,
      renderCell: (params) => (
        <Box>
          <Stack direction={"row"} alignItems={"center"}>
            <IconButton onClick={() => handleActionItemClick(params?.row)}>
              <EditOutlinedIcon />
            </IconButton>
            <IconButton
              onClick={() => handleDeleteActionClick(params?.row?._id)}
            >
              <DeleteIcon color="error" />
            </IconButton>
          </Stack>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <CommonCard>
        <Stack
          direction={isMobile ? "column" : "row"}
          alignItems={isMobile ? "flex-start" : "center"}
          justifyContent={"space-between"}
          spacing={isMobile ? 2 : 0}
        >
          <Box>
            <Typography variant="h6" fontWeight={500}>
              CMS
            </Typography>
          </Box>
          <CommonButton
            buttonText="Add new"
            sx={{ maxWidth: isMobile ? "100%" : "max-content" }}
            buttonTextStyle={{ fontSize: "14px !important" }}
            onClick={() => setIsAddEditModalShow(true)}
          />
        </Stack>
      </CommonCard>
      <Box mt={3}>
        <CommonTable
          column={columns}
          rows={data}
          isLoading={isLoading}
          totalItems={totalItems}
          isPaginations
          currentPage={currentPage}
          rowsPerPage={rowsPerPage}
          onPageChange={handlePageChange}
        />
      </Box>
      {isAddEditModalShow && (
        <CmsAddEditModal
          isOpen={isAddEditModalShow}
          onClose={onAddEditModalClose}
          onRemove={onAddEditModalRemove}
        />
      )}

      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={onDeleteModalClose}
        onRemove={onDelete}
      />
    </Box>
  );
};

export default Cms;
