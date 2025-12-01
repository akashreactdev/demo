"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button, Menu, MenuItem, Stack, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { GridColDef } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import SearchIcon from "@mui/icons-material/Search";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
//relative path imports
import CommonTable from "@/components/CommonTable";
import Typography from "@mui/material/Typography";
import CommonCard from "@/components/Cards/Common";
import CommonInput from "@/components/CommonInput";
import CommonSelect from "@/components/CommonSelect";
import { getProviderTeamMemberList } from "@/services/api/providerApi";
import {
  MemberAccessEnum,
  TeamMemberJobStatus,
} from "@/constants/providerData";
import { useRouterLoading } from "@/hooks/useRouterLoading";

interface ActionItem {
  label: string;
  value: "view" | "pause" | "remove";
}

const filterOptions = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

interface ParamsProps {
  id: string;
}

interface TeamMemberListResponse {
  data: {
    success: boolean;
    message: string;
    data: {
      businessName: string | null;
      teamMembers: TeamMembersListData[];
      meta: {
        totalDocs: number;
      };
    };
  };
}

interface TeamMembersListData {
  id: number;
  userId: string | null;
  memberName: string | null;
  memberEmail: string | null;
  jobRole: number | null;
  access: string | null;
}

const TeamMembers: React.FC = () => {
  const params = useParams() as unknown as ParamsProps;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedRow, setSelectedRow] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [filterValue, setFilterValue] = useState<string | number | null>("");
  const [teamMembersData, setTeamMembersData] = useState<TeamMembersListData[]>(
    []
  );
  const [totalItems, setTotalItems] = useState<number>(0);
  const [rowsPerPage] = useState<number>(10);
  const [businessName, setBusinessName] = useState<string | number | null>("");
  const { navigateWithLoading } = useRouterLoading();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    if (params?.id) {
      fetchTeamMemberList(params?.id);
    }
  }, [params?.id]);

  const fetchTeamMemberList = async (id: string) => {
    setIsLoading(true);
    try {
      const response = (await getProviderTeamMemberList(
        id
      )) as TeamMemberListResponse;
      if (response?.data?.success) {
        setBusinessName(response?.data?.data?.businessName);
        setTeamMembersData(response?.data?.data?.teamMembers);
        setTotalItems(response?.data?.data?.meta?.totalDocs);
        setIsLoading(false);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleActionClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    rowId: string
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(rowId);
  };

  const handleActionItemClick = (action: string) => {
    console.log(`Action: ${action}`);
    navigateWithLoading("/providers/overview/profile");
    handleClose();
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const actionItems: ActionItem[] = [
    { label: "View account", value: "view" },
    { label: "Pause account", value: "pause" },
    { label: "Remove account", value: "remove" },
  ];

  const columns: GridColDef[] = [
    { field: "memberName", headerName: "User name", flex: 1, minWidth: 140 },
    {
      field: "permissons",
      headerName: "Permissons",
      flex: 1,
      minWidth: 140,
      renderCell: (params) => {
        return (
          <Typography variant="body1">
            {typeof params?.row?.access === "number"
              ? MemberAccessEnum[params?.row?.access as MemberAccessEnum]
              : "N/A"}
          </Typography>
        );
      },
    },
    {
      field: "lastLogin",
      headerName: "Last login",
      flex: 1,
      minWidth: 140,
      renderCell: (params) => {
        return (
          <Typography variant="body1">
            {params?.row?.lastLogin || "N/A"}
          </Typography>
        );
      },
    },
    {
      field: "jobRole",
      headerName: "Job role",
      flex: 1,
      minWidth: 140,
      renderCell: (params) => {
        return (
          <Typography variant="body1">
            {typeof params?.row?.jobRole === "number"
              ? TeamMemberJobStatus[params?.row?.jobRole as TeamMemberJobStatus]
              : "N/A"}
          </Typography>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 140,
      minWidth: 140,
      renderCell: (params) => (
        <Box>
          <Button
            onClick={(event) => handleActionClick(event, params.row.id)}
            endIcon={<KeyboardArrowDownIcon />}
            sx={{
              backgroundColor: "#f5f5f7",
              color: "#000",
              textTransform: "none",
              borderRadius: "8px",

              minWidth: "100px",
              height: "30px",
              justifyContent: "space-between",
              "&:hover": {
                backgroundColor: "#e8e8ea",
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
          >
            {actionItems.map((action, idx) => (
              <MenuItem
                key={idx}
                onClick={() => handleActionItemClick(action.value)}
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
      <CommonCard>
        <Typography variant="h6" fontWeight={600}>
          {businessName ? businessName : "N/A"} | Team members
        </Typography>
      </CommonCard>

      <Stack
        direction={isMobile ? "column" : "row"}
        alignItems={isMobile ? "flex-start" : "center"}
        spacing={3}
        mt={4}
      >
        <CommonInput
          placeholder="Search users or carers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          startAdornment={<SearchIcon sx={{ fontSize: "18px", mr: 1 }} />}
          sx={{
            height: "30px",
            fontSize: "12px",
            "&.MuiOutlinedInput-root": {
              border: "1px solid #E2E6EB",
            },
            borderRadius: "8px",
            width: "100%",
          }}
        />
        <CommonSelect
          placeholder="Filters"
          value={filterValue}
          onChange={(value: string | number | null) => setFilterValue(value)}
          options={filterOptions}
          withFilter={true}
          sx={{ width: isMobile ? "100%" : 120, height: "30px" }}
        />
      </Stack>

      <Box mt={4}>
        <CommonTable
          column={columns}
          rows={teamMembersData}
          isPaginations
          isLoading={isLoading}
          totalItems={totalItems}
          rowsPerPage={rowsPerPage}
        />
      </Box>
    </Box>
  );
};

export default TeamMembers;
