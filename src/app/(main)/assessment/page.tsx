"use client";
import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import moment from "moment";
import Grid2 from "@mui/material/Grid2";
import { GridColDef } from "@mui/x-data-grid";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { styled, useTheme } from "@mui/material/styles";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
//relative path imports
import CommonTable from "@/components/CommonTable";
import OverviewCard from "@/components/Cards/Overview";
import {
  getAllAssessment,
  getAssessmentSummary,
  getSingleCarerForRoute,
  getSingleClinicalForRoute,
  getSingleProviderForRoute,
} from "@/services/api/assessmentApi";
import {
  AccountTypeEnum,
  getUserRedirectPath,
} from "@/constants/assessmentData";
import { ProviderProfileResponse } from "@/types/providerProfileTypes";
import { ClinicalProfileResponse } from "@/types/clinicalProfileTypes";
import { useRouterLoading } from "@/hooks/useRouterLoading";

const StyledChip = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isBgColor",
})<StyledChipProps>(({ theme, isBgColor }) => ({
  height: "30px",
  width: "70%",
  paddingBlock: "10px",
  borderRadius: "10px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: isBgColor || theme.palette.primary.main,
}));

type VerifiedStatus = "Pending" | "Approved" | "Rejected";

interface StyledChipProps {
  isBgColor?: string;
}

interface ActionItem {
  label: string;
  value: "account" | "assessment";
}

interface AssessmentSummaryData {
  totalAssessments: null | number;
  approvalRate: number;
  averageAssessmentScore: number;
  retakeRate: number;
}

interface AssessmentSummaryResponse {
  data: {
    data: AssessmentSummaryData;
    success: boolean;
  };
}

interface AssessmentData {
  _id: string;
  status: string;
  isApproved: string | null;
  score: string | null;
  usersInfo: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  testInfo: {
    userType: number;
    createdAt: string;
  };
}

interface AssessmentListResponse {
  data: {
    success: boolean;
    message: string;
    data: {
      assessmentList: AssessmentData[];
      meta: {
        totalAssessmentDocs: number;
      };
    };
  };
}

const Assessment: React.FC = () => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedRow, setSelectedRow] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [rowsPerPage] = useState<number>(10);
  const [assessmentSummary, setAssessmentSummary] =
    useState<AssessmentSummaryData | null>(null);
  const [assessmentData, setAssessmentData] = useState<AssessmentData[]>([]);
  const { navigateWithLoading } = useRouterLoading();

  const statusBgColor: Record<VerifiedStatus, string> = {
    Pending: theme.pending.background.primary,
    Approved: theme.accepted.background.primary,
    Rejected: theme.declined.background.primary,
  };

  const statusTitleColor: Record<VerifiedStatus, string> = {
    Pending: theme.pending.main,
    Approved: theme.accepted.main,
    Rejected: theme.declined.main,
  };

  useEffect(() => {
    fetchAssessmentSummary();
    fetchAssessmentList(currentPage);
  }, [currentPage]);

  const fetchAssessmentList = async (page: number) => {
    setIsLoading(true);
    try {
      const response = (await getAllAssessment({
        limit: rowsPerPage,
        page: page + 1,
      })) as AssessmentListResponse;
      if (response?.data?.success) {
        setAssessmentData(response?.data?.data?.assessmentList);
        setTotalItems(response?.data?.data?.meta.totalAssessmentDocs);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAssessmentSummary = async () => {
    try {
      const response =
        (await getAssessmentSummary()) as AssessmentSummaryResponse;
      if (response?.data?.success) {
        setAssessmentSummary(response?.data?.data);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const fetchSingleProvider = async (
    id: string,
    userType: number,
    status: number
  ) => {
    try {
      const response = (await getSingleProviderForRoute(
        id
      )) as ProviderProfileResponse;
      if (response?.data?.success) {
        const path = getUserRedirectPath(userType, status);
        if (path) {
          navigateWithLoading(`/${path}/profile/${response?.data?.data?._id}`);
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  const fetchSingleClinical = async (
    id: string,
    userType: number,
    status: number
  ) => {
    try {
      const response = (await getSingleClinicalForRoute(
        id
      )) as ClinicalProfileResponse;
      if (response?.data?.success) {
        const path = getUserRedirectPath(userType, status);
        if (path) {
          navigateWithLoading(`/${path}/profile/${response?.data?.data?._id}`);
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  const fetchSingleCarer = async (
    id: string,
    userType: number,
    status: number
  ) => {
    try {
      const response = await getSingleCarerForRoute(id);
      if (response?.data?.success) {
        const path = getUserRedirectPath(userType, status);
        if (path) {
          navigateWithLoading(`/${path}/profile/${response?.data?.data?._id}`);
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleActionClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    rowId: string
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(rowId);
  };

  const handleActionItemClick = (
    row: string,
    cindex: number,
    status?: number | null,
    userType?: number | null
  ) => {
    if (cindex === 0 && userType && status) {
      if (userType === 3) {
        fetchSingleCarer(row, userType, status);
      } else if (userType === 4) {
        fetchSingleClinical(row, userType, status);
      } else if (userType === 5) {
        fetchSingleProvider(row, userType, status);
      }
    } else if (cindex === 1) {
      navigateWithLoading(`/assessment/${row}/view-assessment`);
    }
    handleClose();
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const actionItems: ActionItem[] = [
    { label: "View account", value: "account" },
    { label: "View assessment", value: "assessment" },
  ];

  const columns: GridColDef[] = [
    {
      field: "clientName",
      headerName: "Client name",
      flex: 1,
      minWidth: 140,
      renderCell: (params) => {
        return (
          <Typography variant="body1">
            {params?.row?.usersInfo?.firstName}&nbsp;
            {params?.row?.usersInfo?.lastName}
          </Typography>
        );
      },
    },
    {
      field: "accountType",
      headerName: "Account type",
      flex: 1,
      minWidth: 140,
      renderCell: (params) => {
        return (
          <Typography variant="body1">
            {typeof params?.row?.testInfo?.userType === "number"
              ? AccountTypeEnum[
                  params?.row?.testInfo?.userType as AccountTypeEnum
                ]
              : "N/A"}
          </Typography>
        );
      },
    },
    {
      field: "createdAt",
      headerName: "date taken",
      flex: 1,
      minWidth: 140,
      renderCell: (params) => {
        return (
          <Typography variant="body1">
            {(params?.row?.testInfo?.createdAt &&
              moment(params?.row?.testInfo?.createdAt).format("DD.MM.YYYY")) ||
              "N/A"}
          </Typography>
        );
      },
    },
    {
      field: "score",
      headerName: "score",
      flex: 1,
      minWidth: 140,
      renderCell: (params) => {
        return (
          <Typography variant="body1">
            {params?.row?.score ? `${params?.row?.score}%` : "0%"}
          </Typography>
        );
      },
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      minWidth: 140,
      renderCell: (params) => {
        const verifiedStatus = params?.row?.status as VerifiedStatus;
        const bgColor =
          statusBgColor[verifiedStatus] || theme.inProgress.background.third;
        const titleColor =
          statusTitleColor[verifiedStatus] || theme.palette.common.black;

        return (
          <Box
            height={"100%"}
            display={"flex"}
            alignItems={"center"}
            width={"100%"}
          >
            <StyledChip isBgColor={bgColor}>
              <Typography variant="caption" fontWeight={500} color={titleColor}>
                {verifiedStatus ? verifiedStatus : "N/A"}
              </Typography>
            </StyledChip>
          </Box>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      minWidth: 140,
      renderCell: (params) => (
        <Box>
          <Button
            onClick={(event) =>
              handleActionClick(event, params.row.usersInfo._id)
            }
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
            open={Boolean(anchorEl) && selectedRow === params.row.usersInfo._id}
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
                onClick={() =>
                  handleActionItemClick(
                    params?.row?.usersInfo._id,
                    index,
                    params?.row?.usersInfo.status,
                    params?.row?.testInfo?.userType
                  )
                }
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
            path={"/assets/svg/assessment/task_list.svg"}
            alt={"man_woman"}
            title={"Total taken assessments"}
            count={
              assessmentSummary?.totalAssessments === 0
                ? "0"
                : assessmentSummary?.totalAssessments
            }
          />
        </Grid2>
        <Grid2 size={{ md: 6, sm: 6, xs: 12, lg: 3, xl: 3 }}>
          <OverviewCard
            path={"/assets/svg/assessment/check_icon.svg"}
            alt={"man_woman"}
            title={"Approval Rate"}
            count={
              assessmentSummary?.approvalRate === 0
                ? "0%"
                : `${assessmentSummary?.approvalRate}%`
            }
          />
        </Grid2>
        <Grid2 size={{ md: 6, sm: 6, xs: 12, lg: 3, xl: 3 }}>
          <OverviewCard
            path={"/assets/svg/assessment/hundred_score.svg"}
            alt={"man_woman"}
            title={"Avg. Assessment Score"}
            count={
              assessmentSummary?.averageAssessmentScore === 0
                ? "0%"
                : `${assessmentSummary?.averageAssessmentScore}%`
            }
          />
        </Grid2>
        <Grid2 size={{ md: 6, sm: 6, xs: 12, lg: 3, xl: 3 }}>
          <OverviewCard
            path={"/assets/svg/assessment/arrow_icon.svg"}
            alt={"man_woman"}
            title={"Retake Rate"}
            count={
              assessmentSummary?.retakeRate === 0
                ? "0%"
                : `${assessmentSummary?.retakeRate}%`
            }
          />
        </Grid2>
      </Grid2>

      <Box mt={4}>
        <CommonTable
          column={columns}
          rows={assessmentData}
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

export default Assessment;
