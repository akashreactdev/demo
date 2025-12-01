"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import moment from "moment";
import { Button, Menu, MenuItem } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import { GridColDef } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Grid2 from "@mui/material/Grid2";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
//relative path imports
import CommonTable from "@/components/CommonTable";
import OverviewCard from "@/components/Cards/Overview";
import { useRouterLoading } from "@/hooks/useRouterLoading";
import CommonCard from "@/components/Cards/Common";
import CommonButton from "@/components/CommonButton";

type AccountStatus = "Pending" | "Active" | "Deactivated";

const statusMap: Record<number, AccountStatus> = {
  1: "Pending",
  2: "Deactivated",
  3: "Active",
};

type PartnerType = "Financial Officer" | "HR Managed" | "Full Service";

const partnerTypeMap: Record<number, PartnerType> = {
  1: "Financial Officer",
  2: "HR Managed",
  3: "Full Service",
};

export interface Company {
  id: number;
  companyName: string;
  email: string;
  partnerType: number;
  dateAdded: string;
  lastLogin: string;
  status: number;
}

export interface ApiResponse {
  success: boolean;
  data: Company[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

const dummyCompanyResponse: ApiResponse = {
  success: true,
  data: [
    {
      id: 1,
      companyName: "Guernsey Cheshire Home",
      email: "Reubenhale@shoorah.io",
      partnerType: 1,
      dateAdded: "2025-02-05",
      lastLogin: "2025-02-05",
      status: 3,
    },
    {
      id: 2,
      companyName: "Guernsey Cheshire Home",
      email: "Reubenhale@shoorah.io",
      partnerType: 1,
      dateAdded: "2025-02-05",
      lastLogin: "2025-02-05",
      status: 1,
    },
    {
      id: 3,
      companyName: "Guernsey Cheshire Home",
      email: "Reubenhale@shoorah.io",
      partnerType: 2,
      dateAdded: "2025-02-05",
      lastLogin: "2025-02-05",
      status: 3,
    },
    {
      id: 4,
      companyName: "Guernsey Cheshire Home",
      email: "Reubenhale@shoorah.io",
      partnerType: 2,
      dateAdded: "2025-02-05",
      lastLogin: "2025-02-05",
      status: 3,
    },
    {
      id: 5,
      companyName: "Guernsey Cheshire Home",
      email: "Reubenhale@shoorah.io",
      partnerType: 3,
      dateAdded: "2025-02-05",
      lastLogin: "2025-02-05",
      status: 3,
    },
    {
      id: 6,
      companyName: "Guernsey Cheshire Home",
      email: "Reubenhale@shoorah.io",
      partnerType: 3,
      dateAdded: "2025-02-05",
      lastLogin: "2025-02-05",
      status: 3,
    },
    {
      id: 7,
      companyName: "Guernsey Cheshire Home",
      email: "Reubenhale@shoorah.io",
      partnerType: 1,
      dateAdded: "2025-02-05",
      lastLogin: "2025-02-05",
      status: 3,
    },
    {
      id: 8,
      companyName: "Guernsey Cheshire Home",
      email: "Reubenhale@shoorah.io",
      partnerType: 2,
      dateAdded: "2025-02-05",
      lastLogin: "2025-02-05",
      status: 3,
    },
    {
      id: 9,
      companyName: "Guernsey Cheshire Home",
      email: "Reubenhale@shoorah.io",
      partnerType: 1,
      dateAdded: "2025-02-05",
      lastLogin: "2025-02-05",
      status: 3,
    },
    {
      id: 10,
      companyName: "Guernsey Cheshire Home",
      email: "Reubenhale@shoorah.io",
      partnerType: 3,
      dateAdded: "2025-02-05",
      lastLogin: "2025-02-05",
      status: 2,
    },
  ],
  meta: {
    total: 10,
    page: 1,
    limit: 10,
    totalPages: 1,
  },
};

interface StyledChipProps {
  isBgColor?: string;
}

interface ActionItem {
  label: string;
  value: "view" | "pause" | "remove";
}

const StyledChip = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isBgColor",
})<StyledChipProps>(({ theme, isBgColor }) => ({
  height: "30px",
  width: "80%",
  paddingBlock: "10px",
  borderRadius: "5px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: isBgColor || theme.palette.primary.main,
}));

const Partners: React.FC = () => {
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [rowsPerPage] = useState<number>(10);
  const { navigateWithLoading } = useRouterLoading();

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const accountStatusBgColor: Record<AccountStatus, string> = {
    Pending: theme.pending.background.primary,
    Active: theme.accepted.background.primary,
    Deactivated: theme.declined.background.primary,
  };

  const accountStatusTitleColor: Record<AccountStatus, string> = {
    Pending: theme.pending.main,
    Active: theme.accepted.main,
    Deactivated: theme.declined.main,
  };

  const partnerTypeBgColor: Record<PartnerType, string> = {
    "Full Service": theme.pending.background.primary,
    "Financial Officer": "#DCEAFD80",
    "HR Managed": "#F3E8FF80",
  };

  const partnerTypeTitleColor: Record<PartnerType, string> = {
    "Full Service": "#8D5F26",
    "Financial Officer": "#4072BD",
    "HR Managed": "#7D34B9",
  };

  const handleActionClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    rowId: number
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(rowId);
  };

  const handleActionItemClick = (cindex: number, id: string) => {
    if (cindex === 0) {
      // navigateWithLoading(
      //   `${process.env.NEXT_PUBLIC_ZORBEE_BROKERAGE_URL}/dashboard`
      // );
      navigateWithLoading(`/partners/overview/profile/${id}`);
    }
    handleClose();
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const actionItems: ActionItem[] = [{ label: "View details", value: "view" }];

  const columns: GridColDef[] = [
    {
      field: "companyName",
      headerName: "Company name",
      flex: 1,
      minWidth: 240,
      renderCell: (params) => (
        <Stack flexDirection="row" alignItems="center" gap={2}>
          <Image
            src={"/assets/images/profile.jpg"}
            alt="company-logo"
            height={32}
            width={32}
            style={{ borderRadius: "50%" }}
          />
          <Typography variant="body1">{params.row.companyName}</Typography>
        </Stack>
      ),
    },
    {
      field: "email",
      headerName: "Email address",
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <Typography variant="body1">{params.row.email}</Typography>
      ),
    },
    {
      field: "partnerType",
      headerName: "Partner type",
      flex: 1,
      minWidth: 160,
      renderCell: (params) => {
        const legalStatus = partnerTypeMap[params.row.partnerType];
        const bgColor =
          partnerTypeBgColor[legalStatus] || theme.inProgress.background.third;
        const titleColor =
          partnerTypeTitleColor[legalStatus] || theme.palette.common.black;

        return (
          <StyledChip isBgColor={bgColor}>
            <Typography variant="caption" fontWeight={500} color={titleColor}>
              {legalStatus}
            </Typography>
          </StyledChip>
        );
      },
    },
    {
      field: "dateAdded",
      headerName: "Date added",
      flex: 1,
      minWidth: 140,
      renderCell: (params) => (
        <Typography variant="body1">
          {moment(params.row.dateAdded).format("DD.MM.YYYY")}
        </Typography>
      ),
    },
    {
      field: "lastLogin",
      headerName: "Last Login",
      flex: 1,
      minWidth: 140,
      renderCell: (params) => (
        <Typography variant="body1">
          {moment(params.row.lastLogin).format("DD.MM.YYYY")}
        </Typography>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      minWidth: 140,
      renderCell: (params) => {
        const legalStatus = statusMap[params.row.status];
        const bgColor =
          accountStatusBgColor[legalStatus] ||
          theme.inProgress.background.third;
        const titleColor =
          accountStatusTitleColor[legalStatus] || theme.palette.common.black;

        return (
          <StyledChip isBgColor={bgColor}>
            <Typography variant="caption" fontWeight={500} color={titleColor}>
              {legalStatus}
            </Typography>
          </StyledChip>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 140,
      renderCell: (params) => (
        <Box>
          <Button
            onClick={(event) => handleActionClick(event, params.row.id)}
            endIcon={<KeyboardArrowDownIcon />}
            sx={{
              backgroundColor: theme.inProgress.background.fourth,
              color: theme.palette.common.black,
              textTransform: "none",
              borderRadius: "8px",
              minWidth: "100px",
              height: "30px",
              justifyContent: "space-between",
              "&:hover": {
                backgroundColor: theme.inProgress.background.fifth,
              },
            }}
          >
            <Typography variant="caption" fontWeight={500}>
              Select
            </Typography>
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl) && selectedRow === params.row.id}
            onClose={handleClose}
            PaperProps={{
              sx: {
                border: "1px solid #E2E6EB",
                borderRadius: "10px",
              },
            }}
          >
            {actionItems.map((action, index) => (
              <MenuItem
                key={index}
                onClick={() => handleActionItemClick(index, params.row.id)}
              >
                {action.label}
              </MenuItem>
            ))}
          </Menu>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <Grid2 container spacing={2}>
        <Grid2 size={{ md: 6, sm: 6, xs: 12, lg: 3, xl: 3 }}>
          <OverviewCard
            path={"/assets/svg/carers/overview/total_partners.svg"}
            alt={"man_woman"}
            title={"Total partners"}
            count={"252"}
          />
        </Grid2>
        <Grid2 size={{ md: 6, sm: 6, xs: 12, lg: 3, xl: 3 }}>
          <OverviewCard
            path={"/assets/svg/carers/overview/total_active_accounts.svg"}
            alt={"currency_pound"}
            title={"Total active accounts"}
            count={"248"}
          />
        </Grid2>
        <Grid2 size={{ md: 6, sm: 6, xs: 12, lg: 3, xl: 3 }}>
          <OverviewCard
            path={"/assets/svg/carers/overview/top_partner_type.svg"}
            alt={"man_woman"}
            title={"Top partner type"}
            count={"HR Managed"}
          />
        </Grid2>
        <Grid2 size={{ md: 6, sm: 6, xs: 12, lg: 3, xl: 3 }}>
          <OverviewCard
            path={"/assets/svg/carers/overview/top_managed_accounts.svg"}
            alt={"job_choose_candidate"}
            title={"Total managed accounts"}
            count={"1187"}
          />
        </Grid2>
      </Grid2>

      <Box mt={3}>
        <CommonCard>
          <Stack
            flexDirection={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Box>
              <Typography variant="h6">Manage Zorbee partners</Typography>
              <Typography variant="body1">
                Here is where you can add new Zorbee partners
              </Typography>
            </Box>
            <Box>
              <CommonButton
                buttonText="Add new partner"
                sx={{ height: "45px" }}
                buttonTextStyle={{ fontSize: "15px" }}
                onClick={() => navigateWithLoading("/partners/add-new-partner")}
              />
            </Box>
          </Stack>
        </CommonCard>
      </Box>

      <Box mt={3}>
        <CommonTable
          column={columns}
          rows={dummyCompanyResponse.data}
          isPaginations
          isLoading={isLoading}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          totalItems={dummyCompanyResponse.meta.total}
          rowsPerPage={rowsPerPage}
        />
      </Box>
    </Box>
  );
};

export default Partners;
