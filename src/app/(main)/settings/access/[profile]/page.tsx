"use client";
import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useMediaQuery, Menu, MenuItem, CircularProgress } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Grid2 from "@mui/material/Grid2";
//relative path imports
import CommonCard from "@/components/Cards/Common";
import KeyValueDetails from "@/components/Cards/KeyValueDetails";
// import CommonSelect from "@/components/CommonSelect";
import CommonChip from "@/components/CommonChip";
import CommonNoteCard from "@/components/CommonNoteCard";
import ReasonForDeclineModal from "@/components/carers/profile/ReasonForDeclineModal";
import IconButton from "@mui/material/IconButton";
import MoreVertSharpIcon from "@mui/icons-material/MoreVertSharp";
import PermissionModal from "@/components/PermissionModal";
import { useParams } from "next/navigation";
import {
  getAccessProfileInfo,
  handlePermissionForAdmin,
} from "@/services/api/settingsAPI";
import moment from "moment";
import { userType } from "@/constants/accessData";
import { toast } from "react-toastify";

export interface AdminInfo {
  userPermissions: number[];
  carerPermissions: number[];
  clinicalPermissions: number[];
  providerPermissions: number[];
  _id: string;
  userId: string;
  dob: string;
  latitude: number | null;
  longitude: number | null;
  address: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  __v: number;
}

export interface UserData {
  _id: string;
  email: string;
  role: number;
  status: number;
  name: string;
  lastLogin: string;
  adminInfo: AdminInfo;
}

export interface UserDetailsResponse {
  data: {
    success: boolean;
    message: string;
    data: UserData;
  };
}

export interface ChangePermissionResponse {
  data: {
    success: boolean;
    message: string;
  };
}

interface ParamsProps {
  profile: string;
}

const Profile = () => {
  const theme = useTheme();
  const params = useParams() as unknown as ParamsProps;
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [imageSrc, setImageSrc] = useState("");
  const [isreasonModalOpen, setIsReasonModalOpen] = useState<boolean>(false);
  const [permissionModalOpen, setPermissionModalOpen] =
    useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [accessProfileInfo, setAccessProfileInfo] = useState<UserData | null>(
    null
  );

  const account_informations = useMemo(() => {
    return [
      {
        label: "Name",
        value: accessProfileInfo?.name || "N/A",
      },
      {
        label: "Date of birth",
        value:
          moment(accessProfileInfo?.adminInfo?.dob, "DD-MM-YYYY").format(
            "Do MMMM YYYY"
          ) || "N/A",
      },
      {
        label: "Email",
        value: accessProfileInfo?.email || "N/A",
      },
      {
        label: "Job Role",
        value: userType[Number(accessProfileInfo?.role)] || "N/A",
      },
      {
        label: "Location",
        value: accessProfileInfo?.adminInfo?.address || "N/A",
      },
    ];
  }, [accessProfileInfo]);

  useEffect(() => {
    if (params?.profile) {
      fetchCarerProfile(params?.profile);
    }
  }, [params?.profile]);

  const fetchCarerProfile = async (id: string) => {
    setIsLoading(true);
    try {
      const response = (await getAccessProfileInfo(id)) as UserDetailsResponse;
      if (response?.data?.success) {
        setIsLoading(false);
        setAccessProfileInfo(response?.data?.data);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        if (e.target?.result) {
          setImageSrc(e.target.result as string);
        }
      };

      reader.readAsDataURL(file);
    }
  };

  const onCloseReasonModal = () => {
    setIsReasonModalOpen(false);
    handleClose();
  };

  const onClickSaveBtnInModal = (value: string) => {
    console.log(value, "reason");
    setIsReasonModalOpen(false);
    handleClose();
  };

  const onClosePermissionModal = () => {
    setPermissionModalOpen(false);
  };

  const handleActionClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleActionItemClick = (index: number) => {
    if (index === 0) {
      setIsReasonModalOpen(true);
    }
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSavePermissions = async (payload: {
    userPermissions: number[];
    carerPermissions: number[];
    clinicalPermissions: number[];
    providerPermissions: number[];
  }) => {
    setIsLoading(true);
    try {
      const response = (await handlePermissionForAdmin(
        params?.profile,
        payload
      )) as ChangePermissionResponse;
      if (response?.data?.success) {
        localStorage.setItem(
          "userPermissions",
          JSON.stringify(payload?.userPermissions)
        );
        localStorage.setItem(
          "carerPermissions",
          JSON.stringify(payload?.carerPermissions)
        );
        localStorage.setItem(
          "clinicalPermissions",
          JSON.stringify(payload?.clinicalPermissions)
        );
        localStorage.setItem(
          "providerPermissions",
          JSON.stringify(payload?.providerPermissions)
        );
        toast.success(response?.data?.message);
        onClosePermissionModal();
        fetchCarerProfile(params?.profile);
      } else {
        console.error("Failed to update permissions", response.data.message);
      }
    } catch (error) {
      console.error("Error updating permissions:", error);
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
      <CommonCard
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "stretch", md: "flex-start" },
          gap: { xs: 2, md: 0 },
          padding: { xs: 2, md: 3 },
        }}
      >
        <Box>
          <Typography variant="h6" fontWeight={500}>
            {accessProfileInfo?.name || "-"}’s profile
          </Typography>
          <Typography variant="body1" fontSize={"12px"}>
            Manage and assign permissions where necessary
          </Typography>
        </Box>
        <Box>
          <IconButton onClick={(event) => handleActionClick(event)}>
            <MoreVertSharpIcon style={{ color: theme.palette.common.black }} />
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
            {["Deactivate account"].map((action, index) => (
              <MenuItem
                key={index}
                onClick={() => handleActionItemClick(index)}
                sx={{ color: "#9C3C3C" }}
              >
                {action}
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </CommonCard>
      <Grid2 container spacing={2} mt={3}>
        <Grid2 size={{ md: 6, sm: 12, xs: 12, lg: 6, xl: 6 }}>
          <CommonCard>
            <Typography variant="h6" fontWeight={500}>
              Profile image
            </Typography>
            <Typography variant="body1" fontSize={"12px"}>
              Add a profile image for this new user.
            </Typography>

            <Box mt={5}>
              <Image
                src={imageSrc || "/assets/images/Rectangle.jpg"}
                alt="profile-pic"
                height={182}
                width={182}
              />

              <input
                type="file"
                accept="image/*"
                id="profile-image-upload"
                style={{ display: "none" }}
                onChange={handleImageChange}
              />

              {/* <Typography
                component="label"
                htmlFor="profile-image-upload"
                sx={{
                  cursor: "pointer",
                  textDecoration: "underline",
                  mt: 1,
                  display: "block",
                }}
              >
                {imageSrc ? "Replace profile image" : "Add profile image"}
              </Typography> */}
            </Box>
          </CommonCard>

          <Box mt={4}>
            <CommonCard>
              <Typography variant="h6" fontWeight={500}>
                Account status
              </Typography>
              <Typography variant="caption" fontWeight={400}>
                Here is the current status of this Zorbee staff member.
              </Typography>
              <Stack
                mt={isMobile ? 2 : 3}
                sx={{
                  flexDirection: "row", // default
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 3,
                  "@media (max-width: 426px)": {
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: 1,
                  },
                  "@media (width: 1024px)": {
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: 1,
                  },
                }}
                // direction={isMobile ? "column" : "row"}
                // alignItems={isMobile ? "flex-start" : "center"}
                spacing={isMobile ? 1 : 3}
                justifyContent={"space-between"}
              >
                <Stack flexDirection={"row"} gap={2} alignItems={"center"}>
                  <Box>
                    <CommonChip
                      title="Suspended"
                      textStyle={{ color: "#9C3C3C" }}
                      style={{ backgroundColor: "#F4A6A6" }}
                    />
                  </Box>
                  <Box>
                    <Typography variant="caption" fontWeight={400}>
                      Date suspended
                    </Typography>
                    <Typography
                      component={"p"}
                      variant="caption"
                      fontWeight={500}
                    >
                      5th February 2025 | 19.30PM
                    </Typography>
                  </Box>
                </Stack>
              </Stack>

              <Box mt={2}>
                <CommonNoteCard
                  title="Internal notes"
                  rows={1.2}
                  value="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
                />
              </Box>
            </CommonCard>
          </Box>
        </Grid2>
        <Grid2 size={{ md: 6, sm: 12, xs: 12, lg: 6, xl: 6 }}>
          <CommonCard>
            <Typography variant="h6" fontWeight={500}>
              Account information
            </Typography>
            <Box mt={isMobile ? 2 : 4}>
              <KeyValueDetails items={account_informations} />
            </Box>
          </CommonCard>

          <Box mt={4}>
            <CommonCard>
              <Typography variant="h6" fontWeight={500}>
                Permissions
              </Typography>
              <Typography
                variant="caption"
                fontWeight={400}
              >{`Please select the level of access you'd like to grant this new user.`}</Typography>
              <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
                <CommonChip
                  title="Manage access"
                  onClick={() => setPermissionModalOpen(true)}
                  style={{ cursor: "pointer" }}
                />
              </Box>
            </CommonCard>
          </Box>
        </Grid2>
      </Grid2>
      <ReasonForDeclineModal
        isOpen={isreasonModalOpen}
        onClick={onClickSaveBtnInModal}
        onClose={onCloseReasonModal}
        value={""}
        title={"Reason for suspension"}
        description={"Please outline your reasons for suspending this account"}
        placeholder="Please provide details..."
      />
      <PermissionModal
        isOpen={permissionModalOpen}
        onClick={handleSavePermissions}
        onClose={onClosePermissionModal}
        title={"Super admin permissions"}
        description={"Manage access to all features and data."}
        adminInfo={{
          userPermissions: accessProfileInfo?.adminInfo?.userPermissions,
          carerPermissions: accessProfileInfo?.adminInfo?.carerPermissions,
          clinicalPermissions:
            accessProfileInfo?.adminInfo?.clinicalPermissions,
          providerPermissions:
            accessProfileInfo?.adminInfo?.providerPermissions,
        }}
      />
    </Box>
  );
};

export default Profile;
