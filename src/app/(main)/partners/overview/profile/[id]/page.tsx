"use client";
import React, { useEffect, useMemo, useState } from "react";
import moment from "moment";
// import { toast } from "react-toastify";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useRouterLoading } from "@/hooks/useRouterLoading";
import { useMediaQuery, Menu, MenuItem, CircularProgress } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Grid2 from "@mui/material/Grid2";
import IconButton from "@mui/material/IconButton";
import MoreVertSharpIcon from "@mui/icons-material/MoreVertSharp";
//relative path imports
import CommonCard from "@/components/Cards/Common";
import KeyValueDetails from "@/components/Cards/KeyValueDetails";
import ReasonForDeclineModal from "@/components/carers/profile/ReasonForDeclineModal";
import ViewAllButton from "@/components/ViewAllButton";

const STATUS_LABELS: Record<number, string> = {
  1: "Pending",
  3: "Active",
  8: "Deactivated",
};

const ActiveStatus = styled(Box, {
  shouldForwardProp: (prop) => prop !== "status",
})<{ status?: number }>(({ status, theme }) => {
  const s =
    status === 1
      ? {
          label: "Pending",
          border: theme.pending.main,
          bg: theme.pending.background.primary,
          color: theme.pending.main,
        }
      : status === 3
      ? {
          label: "Active",
          border: theme.accepted.main,
          bg: theme.accepted.background.primary,
          color: theme.accepted.main,
        }
      : status === 8
      ? {
          label: "Deactivated",
          border: theme.declined.main,
          bg: theme.declined.background.primary,
          color: theme.declined.main,
        }
      : {
          label: "N/A",
          border: "",
          bg: "",
          color: "",
        };

  return {
    padding: "8px 16px",
    border: `1px solid ${s.border}`,
    backgroundColor: s.bg,
    color: s.color,
    borderRadius: "8px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    "& .MuiTypography-root": { color: s.color },
  };
});

interface ParamsProps {
  id: string;
}

const partnerCategoryOptions = [
  { label: "HR & care service management", value: 1 },
  { label: "Financial Officer", value: 2 },
  { label: "Full service", value: 3 },
];

const singlePartnerData = {
  _id: "1",
  fullName: "Guernsey Cheshire Home",
  emailAddress: "Reubenhale@shoorah.io",
  partnerType: [1],
  status: 1,
  profile:
    "image/carer/profile/download (2).jpeg-b5d1e2fc-9409-4b75-a241-72d1402c8431-688b38aa7e616963e75dab4e.jpg",
  createdAt: "2025-07-31T09:41:18.269Z",
};

const ViewPartner: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const params = useParams() as unknown as ParamsProps;
  const { navigateWithLoading } = useRouterLoading();
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isreasonModalOpen, setIsReasonModalOpen] = useState<boolean>(false);
  const [deactivateID, setDeactivateID] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const onCloseReasonModal = () => {
    setIsReasonModalOpen(false);
  };

  const onClickSaveBtnInModal = () => {
    console.log(deactivateID, "deactivatedID");
    setIsReasonModalOpen(false);
  };

  const handleActionClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuActionItemClick = (id: string, cindex: number) => {
    if (cindex === 0) {
      setIsReasonModalOpen(true);
      setDeactivateID(id);
    } else if (cindex === 1) {
    }
    handleClose();
  };

  const cardData = [
    {
      title: "HR & Care Service Managers",
      description: "List of users within this category",
      buttontext: "HR managed",
      redirectionRoute: `/partners/overview/profile/${params.id}/hr-managed`,
    },
    {
      title: "Financial Officer",
      description: "List of users within this category",
      buttontext: "Financial Officers",
      redirectionRoute: `/partners/overview/profile/${params.id}/financial-officer`,
    },
  ];

  const account_informations = useMemo(() => {
    const partnerTypes =
      singlePartnerData?.partnerType &&
      Array.isArray(singlePartnerData.partnerType)
        ? partnerCategoryOptions
            .filter((option) =>
              singlePartnerData.partnerType.includes(option.value)
            )
            .map((option) => option.label)
            .join(", ")
        : "N/A";
    return [
      {
        label: "Company name",
        value: singlePartnerData?.fullName || "N/A",
      },
      {
        label: "Email Address",
        value: singlePartnerData?.emailAddress || "N/A",
      },
      {
        label: "Partner type",
        value: partnerTypes,
      },
    ];
  }, [singlePartnerData]);

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
        <Stack
          direction={"row"}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Stack direction={"row"} alignItems={"center"} spacing={2}>
            <Image
              src={
                singlePartnerData?.profile != "image/superAdmin/profileImage" &&
                singlePartnerData?.profile != null
                  ? `${process.env.NEXT_PUBLIC_ASSETS_URL}/${singlePartnerData?.profile}`
                  : `/assets/images/profile.jpg`
              }
              alt="user-profile-pic"
              height={60}
              width={60}
              style={{ borderRadius: "50px" }}
            />
            <Box>
              <Typography variant="h6" fontWeight={500}>
                {singlePartnerData?.fullName
                  ? singlePartnerData?.fullName
                  : "N/A"}
              </Typography>
              <Typography variant="caption">
                {singlePartnerData?.partnerType &&
                Array.isArray(singlePartnerData.partnerType)
                  ? partnerCategoryOptions
                      .filter((option) =>
                        singlePartnerData.partnerType.includes(option.value)
                      )
                      .map((option) => option.label)
                      .join(", ")
                  : "N/A"}
              </Typography>
            </Box>
          </Stack>
          <Stack direction={"row"} alignItems={"center"} spacing={2}>
            {!isTablet && (
              <Box>
                <Typography variant="caption" fontWeight={400}>
                  Date joined
                </Typography>
                <Typography component={"p"} variant="caption" fontWeight={500}>
                  {moment(singlePartnerData?.createdAt).format("Do MMMM YYYY")}
                </Typography>
              </Box>
            )}
            {!isTablet && (
              <ActiveStatus status={singlePartnerData?.status}>
                <Typography variant="caption" fontWeight={500}>
                  {STATUS_LABELS[singlePartnerData?.status ?? -1] ?? "N/A"}
                </Typography>
              </ActiveStatus>
            )}
            <IconButton onClick={(event) => handleActionClick(event)}>
              <MoreVertSharpIcon
                style={{ color: theme.palette.common.black }}
              />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              PaperProps={{
                sx: {
                  border: "1px solid #E2E6EB",
                  borderRadius: "10px",
                },
              }}
            >
              {(singlePartnerData?.status === 8
                ? ["Activate account"]
                : ["Deactive account"]
              ).map((action, index) => (
                <MenuItem
                  key={index}
                  onClick={() =>
                    singlePartnerData?.status === 8
                      ? handleMenuActionItemClick(params?.id, index)
                      : handleMenuActionItemClick(params?.id, index)
                  }
                  sx={{
                    color:
                      singlePartnerData?.status === 8
                        ? theme?.palette.common.black
                        : theme.declined.main,
                  }}
                >
                  {action}
                </MenuItem>
              ))}
            </Menu>
          </Stack>
        </Stack>

        {isTablet && !isMobile && (
          <Stack
            direction={"row"}
            alignItems={"center"}
            justifyContent={"space-between"}
            mt={2}
          >
            <Stack direction={"row"} alignItems={"center"} spacing={2}>
              <Box>
                <Typography variant="caption" fontWeight={400}>
                  Date joined
                </Typography>
                <Typography component={"p"} variant="caption" fontWeight={500}>
                  {moment(singlePartnerData?.createdAt).format("Do MMMM YYYY")}
                </Typography>
              </Box>
              <ActiveStatus status={singlePartnerData?.status}>
                <Typography variant="caption" fontWeight={500}>
                  {STATUS_LABELS[singlePartnerData?.status ?? -1] ?? "N/A"}
                </Typography>
              </ActiveStatus>
            </Stack>
          </Stack>
        )}

        {isMobile && (
          <Box mt={2}>
            <Stack
              direction={"row"}
              alignItems={"center"}
              justifyContent={"space-between"}
              spacing={2}
            >
              <Box>
                <Typography variant="caption" fontWeight={400}>
                  Date joined
                </Typography>
                <Typography component={"p"} variant="caption" fontWeight={500}>
                  {moment(singlePartnerData?.createdAt).format("Do MMMM YYYY")}
                </Typography>
              </Box>
              <ActiveStatus status={singlePartnerData?.status}>
                <Typography variant="caption" fontWeight={500}>
                  {STATUS_LABELS[singlePartnerData?.status ?? -1] ?? "N/A"}
                </Typography>
              </ActiveStatus>
            </Stack>
          </Box>
        )}
      </CommonCard>
      <Grid2 container spacing={3}>
        <Grid2 size={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 6 }}>
          <Box mt={3}>
            <CommonCard>
              <Typography variant="h6" fontWeight={500}>
                Partner information
              </Typography>
              <Box mt={2}>
                <Image
                  src={
                    singlePartnerData?.profile != "carer/profile" &&
                    singlePartnerData?.profile != null
                      ? `${process.env.NEXT_PUBLIC_ASSETS_URL}/${singlePartnerData?.profile}`
                      : `/assets/images/profile.jpg`
                  }
                  alt="user-profile-pic"
                  height={182}
                  width={182}
                  style={{ borderRadius: "18px" }}
                />
              </Box>
              <Box mt={2}>
                <KeyValueDetails items={account_informations} />
              </Box>
            </CommonCard>
          </Box>
        </Grid2>

        <Grid2 size={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 6 }}>
          {cardData.map((ele, index) => (
            <Box key={index} mt={3}>
              <CommonCard>
                <Typography variant="h6" fontWeight={500}>
                  {ele.title}
                </Typography>
                <Typography variant="caption" fontWeight={400}>
                  {ele.description}
                </Typography>
                <Box mt={4}>
                  <ViewAllButton
                    sx={{ backgroundColor: "#F1F3F5" }}
                    title={ele.buttontext}
                    onClick={() => {
                      if (ele?.redirectionRoute) {
                        navigateWithLoading(ele?.redirectionRoute);
                      }
                    }}
                    isIcon={true}
                  />
                </Box>
              </CommonCard>
            </Box>
          ))}
        </Grid2>
      </Grid2>
      <ReasonForDeclineModal
        isOpen={isreasonModalOpen}
        onClick={onClickSaveBtnInModal}
        onClose={onCloseReasonModal}
        value={""}
        title={"Reason for suspension"}
        description={
          "Please outline your reasons for suspending this <br />account"
        }
        placeholder="Please provide details..."
      />
    </Box>
  );
};
export default ViewPartner;
