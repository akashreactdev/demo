"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Collapse from "@mui/material/Collapse";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
//relative path imports
import { sidebarItems } from "@/constants/sidebarItems";
import { useAuth } from "@/hooks/useAuth";
import { useRouterLoading } from "@/hooks/useRouterLoading";
import SelectCancelModal from "@/components/CommonModal";
import { CarerPermissionsState } from "@/app/(main)/carers/overview/page";
import {
  AdminCarerPermission,
  AdminClinicalPermission,
} from "@/constants/accessData";
import { ClinicalPermissionsState } from "@/app/(main)/clinical/overview/page";

interface SidebarItemType {
  title: string;
  pathName?: string;
  activeIcon: string;
  children?: Array<SidebarItemType>;
}

interface ActiveProps {
  isActive: boolean;
}

interface SidebarProps {
  onClose?: () => void;
}

const StyledWrapper = styled(Box)(() => ({
  height: "100%",
  width: "100%",
  display: "flex",
  flexDirection: "column",
  position: "relative",
}));

const MainLogoContainer = styled(Box)(({}) => ({
  minHeight: "80px",
  height: "auto",
  width: "100%",
  justifyContent: "center",
  display: "flex",
}));

const LogoContainer = styled(Box)(({}) => ({
  height: "100%",
  width: "80%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderBottom: "1px solid black",
}));

const ContentWrapper = styled(Box)(() => ({
  flexGrow: 1,
  overflowY: "auto",
  scrollbarWidth: "none",
}));

const SidebarItem = styled(Box)(({}) => ({
  width: "90%",
  margin: "0px auto",
  padding: "12px 16px",
  display: "flex",
  alignItems: "center",
  cursor: "pointer",
}));

const ActiveText = styled(Typography, {
  shouldForwardProp: (prop) => prop !== "isActive",
})<ActiveProps>(({ isActive }) => ({
  fontWeight: isActive ? "500" : "400",
}));

const ChildItemContainer = styled(Box)(({}) => ({
  width: "85%",
  margin: "0px auto",
  padding: "6px 16px",
  display: "flex",
  alignItems: "center",
  cursor: "pointer",
  position: "relative",
}));

const HighlightIndicator = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isActive",
})<ActiveProps>(({ isActive, theme }) => ({
  position: "absolute",
  left: 0,
  top: 5,
  bottom: 0,
  width: "8px",
  backgroundColor: isActive ? theme.palette.primary.main : "transparent",
}));

const ChildHighlightIndicator = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isActive",
})<ActiveProps>(({ isActive, theme }) => ({
  position: "absolute",
  left: 0,
  top: 0,
  bottom: 0,
  width: "8px",
  backgroundColor: isActive ? theme.palette.primary.main : "transparent",
}));

const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const theme = useTheme();
  const pathName = usePathname();
  const [activePath, setActivePath] = useState<string>("dashboard");
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const { logout } = useAuth();
  const { navigateWithLoading } = useRouterLoading();
  const [isPermissionModalOpen, setIsPermissionModalOpen] =
    useState<boolean>(false);
  const [carerPermissionsState, setCarerPermissionsState] =
    useState<CarerPermissionsState>({
      viewCarerDetails: false,
      verifyNewCarerDetails: false,
      viewCarerPaymentDispute: false,
    });
  const [clinicalPermissionsState, setClinicalPermissionsState] =
    useState<ClinicalPermissionsState>({
      viewClinicalDetails: false,
      verifyNewClinicalDetails: false,
      viewClinicalPaymentDispute: false,
    });

  useEffect(() => {
    const carerPermissionsFromLocal = localStorage.getItem("carerPermissions");
    if (carerPermissionsFromLocal) {
      try {
        const parsed: number[] = JSON.parse(carerPermissionsFromLocal);
        setCarerPermissionsState({
          viewCarerDetails: parsed.includes(
            AdminCarerPermission.VIEW_CARER_DETAILS
          ),
          verifyNewCarerDetails: parsed.includes(
            AdminCarerPermission.VERIFY_NEW_CARER_DETAILS
          ),
          viewCarerPaymentDispute: parsed.includes(
            AdminCarerPermission.VIEW_CARER_PAYMENT_DISPUTE
          ),
        });
      } catch (err) {
        console.error(
          "Failed to parse carerPermissions from localStorage",
          err
        );
      }
    }
    const clinicalPermissionsFromLocal = localStorage.getItem(
      "clinicalPermissions"
    );
    if (clinicalPermissionsFromLocal) {
      try {
        const parsed: number[] = JSON.parse(clinicalPermissionsFromLocal);
        setClinicalPermissionsState({
          viewClinicalDetails: parsed.includes(
            AdminClinicalPermission.VIEW_CLINICAL_DETAILS
          ),
          verifyNewClinicalDetails: parsed.includes(
            AdminClinicalPermission.VERIFY_NEW_CLINICAL_DETAILS
          ),
          viewClinicalPaymentDispute: parsed.includes(
            AdminClinicalPermission.VIEW_CLINICAL_PAYMENT_DISPUTE
          ),
        });
      } catch (err) {
        console.error(
          "Failed to parse carerPermissions from localStorage",
          err
        );
      }
    }
  }, []);

  useEffect(() => {
    if (!pathName) return;
    const cleanedPath = pathName.startsWith("/") ? pathName.slice(1) : pathName;
    let foundParent: SidebarItemType | undefined;
    let foundChild: SidebarItemType | undefined;
    (sidebarItems as unknown as SidebarItemType[]).forEach((parent) => {
      if (parent.children && parent.children.length > 0) {
        parent.children.forEach((child) => {
          if (cleanedPath.startsWith(child.pathName || "")) {
            if (
              !foundChild ||
              (child.pathName?.length || 0) > (foundChild.pathName?.length || 0)
            ) {
              foundParent = parent;
              foundChild = child;
            }
          }
        });
      } else {
        if (
          cleanedPath.includes(parent.pathName || "") ||
          parent.pathName?.includes(cleanedPath)
        ) {
          foundParent = parent;
        }
      }
    });
    if (foundChild) {
      setActivePath(foundChild.pathName || "");
    } else if (foundParent) {
      setActivePath(foundParent.pathName || "");
    } else {
      setActivePath(cleanedPath);
    }
    if (foundParent) {
      setExpandedItem(foundParent.title);
    }
  }, [pathName]);

  const handleItemClick = (pathName?: string) => {
    // console.log(pathName, "path name");
    if (pathName) {
      if (
        carerPermissionsState?.viewCarerPaymentDispute === false &&
        pathName === "carers/payment-disputes"
      ) {
        setIsPermissionModalOpen(true);
      } else if (
        clinicalPermissionsState?.viewClinicalPaymentDispute === false &&
        pathName === "clinical/payment-disputes"
      ) {
        setIsPermissionModalOpen(true);
      } else {
        setActivePath(pathName);
        navigateWithLoading(`/${pathName}`);
      }
      if (onClose) {
        onClose();
      }
    }
    if (["dashboard", "notifications"].includes(pathName || "")) {
      setExpandedItem(null);
    }
  };

  const handleExpandClick = (title: string) => {
    setExpandedItem(expandedItem === title ? null : title);
  };

  return (
    <StyledWrapper>
      <MainLogoContainer>
        <LogoContainer>
          <Image
            src="/assets/svg/logos/new_zorbee_health_logo.svg"
            alt="zorbee-logo"
            height={50}
            width={180}
            priority
          />
        </LogoContainer>
      </MainLogoContainer>

      <ContentWrapper>
        {sidebarItems.map((item) => {
          const isActive = activePath === item.pathName;
          const hasChildren = !!item.children;
          const isExpanded = expandedItem === item.title;

          return (
            <React.Fragment key={item.title}>
              <Box
                sx={{ position: "relative", width: "100%", marginTop: "16px" }}
              >
                <HighlightIndicator isActive={isActive} />
                <SidebarItem
                  onClick={() =>
                    hasChildren
                      ? handleExpandClick(item.title)
                      : handleItemClick(item.pathName)
                  }
                >
                  <Stack
                    direction="row"
                    width="100%"
                    justifyContent="space-between"
                  >
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Image
                        src={
                          isActive || isExpanded
                            ? `/assets/svg/sidebar/active/${item.activeIcon}.svg`
                            : `/assets/svg/sidebar/inactive/${item.activeIcon}.svg`
                        }
                        alt={item.title}
                        width={24}
                        height={24}
                      />
                      <ActiveText
                        variant="body1"
                        isActive={isActive || isExpanded}
                      >
                        {item.title}
                      </ActiveText>
                    </Stack>
                    {hasChildren &&
                      (isExpanded ? (
                        <ExpandMoreIcon fontSize="small" />
                      ) : (
                        <ChevronRightIcon fontSize="small" />
                      ))}
                  </Stack>
                </SidebarItem>
              </Box>
              {hasChildren && (
                <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                  {item.children?.map((child) => {
                    const childActive = activePath === child.pathName;

                    return (
                      <Box
                        key={child.title}
                        sx={{ position: "relative", width: "100%" }}
                      >
                        <ChildHighlightIndicator isActive={childActive} />
                        <ChildItemContainer
                          onClick={() => handleItemClick(child.pathName)}
                        >
                          <ActiveText variant="body1" isActive={childActive}>
                            {child.title}
                          </ActiveText>
                        </ChildItemContainer>
                      </Box>
                    );
                  })}
                </Collapse>
              )}
            </React.Fragment>
          );
        })}

        <Box
          sx={{
            width: "80%",
            margin: "0px auto",
            borderTop: `1px solid ${theme.palette.common.black}`,
            py: 4,
            mt: 4,
            pl: 1,
          }}
        >
          <Box onClick={() => logout()}>
            <Stack
              sx={{ cursor: "pointer" }}
              direction="row"
              alignItems="center"
              spacing={2}
              width={"90%"}
            >
              <Image
                src="/assets/svg/sidebar/logout.svg"
                alt="logout"
                width={24}
                height={24}
              />
              <Typography variant="body1">Log out</Typography>
            </Stack>
          </Box>
        </Box>
      </ContentWrapper>
      <SelectCancelModal
        title="Message"
        question={`You don't have right to access this feature. Please ask the support team to update your rights.`}
        buttonText="Done"
        isOpen={isPermissionModalOpen}
        isCancelButtonShow={false}
        onRemove={() => setIsPermissionModalOpen(false)}
      />
    </StyledWrapper>
  );
};

export default Sidebar;
