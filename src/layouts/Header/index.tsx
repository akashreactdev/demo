"use client";
import React, { ChangeEvent, useEffect, useMemo, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Image from "next/image";
import { MenuItem, Popover, useMediaQuery } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

//import icons
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import CommonInput from "@/components/CommonInput";
// import CommonSelect from "@/components/CommonSelect";
import { useRouterLoading } from "@/hooks/useRouterLoading";
import FilterModal from "@/components/FilterModal";

interface HeaderProps {
  toggleSidebar: () => void;
}

const StyledWrapper = styled(Box)(({}) => ({
  height: "100%",
  width: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
}));

const StyledProfile = styled(Box)(({ theme }) => ({
  height: "50px",
  width: "50px",
  backgroundColor: theme.palette.primary.main,
  borderRadius: "6px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  [theme.breakpoints.down("md")]: {
    height: "36px",
    width: "36px",
  },
}));

interface FilterOption {
  label: string;
  value: string | number;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const theme = useTheme();
  const { navigateWithLoading } = useRouterLoading();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isLaptop = useMediaQuery(theme.breakpoints.between("md", "lg"));
  const [title, setTitle] = useState<string>("Dashboard");
  const [breadcrumb, setBreadcrumb] = useState<string[]>([]);
  const firstName = localStorage.getItem("firstName");
  const lastName = localStorage.getItem("lastName");

  const filterOptions: FilterOption[] = useMemo(() => {
    const defaultOptions = [
      { label: "All", value: "" },
      { label: "Active", value: 1 },
      { label: "Inactive", value: 2 },
    ];

    switch (true) {
      case pathName.includes("/users/overview"):
        return [
          { label: "Active", value: 1 },
          { label: "Inactive", value: 2 },
          { label: "Deleted", value: 3 },
        ];

      case pathName.includes("/carers/overview"):
        return [
          { label: "Active", value: 1 },
          { label: "Inactive", value: 2 },
          { label: "Deleted", value: 3 },
        ];

      case pathName.includes("/clinical/overview"):
        return [
          { label: "Active", value: 1 },
          { label: "Inactive", value: 2 },
          { label: "Deleted", value: 3 },
        ];

      case pathName.includes("/providers/overview"):
        return [
          { label: "Active", value: 1 },
          { label: "Inactive", value: 2 },
          { label: "Deleted", value: 3 },
        ];

      default:
        return defaultOptions;
    }
  }, [pathName]);

  // Initialize filter value from localStorage (convert string to number)
  const [filterValue, setFilterValue] = useState<string | number | null>(() => {
    const storedValue = localStorage.getItem("filterValue");
    return storedValue ? Number(storedValue) : ""; // Default to 0 (All)
  });

  const [searchOpen, setSearchOpen] = useState(false);
  const [filterAnchor, setFilterAnchor] = useState<null | HTMLElement>(null);
  const [profileAnchor, setProfileAnchor] = useState<null | HTMLElement>(null);
  const [search, setSearch] = useState<string>(
    () => localStorage.getItem("search") || ""
  );
  const [debouncedSearch, setDebouncedSearch] = useState<string>(search);
  const [filterModalOpen, setFilterModalOpen] = useState<boolean>(false);

  useEffect(() => {
    setSearch("");
    setDebouncedSearch("");
    setFilterValue("");
    localStorage.setItem("search", "");
    localStorage.setItem("filterValue", "");
  }, [pathName]);

  useEffect(() => {
    const currentValueExists = filterOptions.some(
      (option) => option.value === filterValue
    );

    if (!currentValueExists && filterOptions.length > 0) {
      const defaultValue = filterOptions[0].value;
      setFilterValue(defaultValue);
      localStorage.setItem("filterValue", String(defaultValue));
    }
  }, [filterOptions, filterValue]);

  useEffect(() => {
    if (!pathName) return;

    const pathSegments = pathName
      .slice(1)
      .split("/")
      .map((segment) =>
        segment
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")
      );

    const isId =
      pathSegments.length > 1 &&
      /^([a-zA-Z]*\d+|\d+[a-zA-Z]+)[a-zA-Z0-9]*$/.test(
        pathSegments[pathSegments.length - 1]
      );

    if (isId) {
      pathSegments.pop();
    }

    const idRegex = /^([a-zA-Z]*\d+|\d+[a-zA-Z]+)[a-zA-Z0-9]*$/;
    const idIndex = pathSegments.findIndex((segment) => idRegex.test(segment));

    if (idIndex !== -1) {
      pathSegments.splice(idIndex, 1);
    }

    let shortBreadcrumb;
    if (pathSegments.length > 3) {
      shortBreadcrumb = [
        pathSegments[0],
        "...",
        pathSegments[pathSegments.length - 1],
      ];
    } else {
      shortBreadcrumb = pathSegments.map((segment) =>
        segment === "Cms" ? "CMS" : segment
      );
    }

    setBreadcrumb(shortBreadcrumb);
    const lastSegment = pathSegments[pathSegments.length - 1];
    const formattedTitle =
      lastSegment?.toLowerCase() === "cms" ? "CMS" : lastSegment || "Dashboard";
    setTitle(formattedTitle);
    localStorage.removeItem("selectedFilters");
  }, [pathName]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileAnchor && !profileAnchor.contains(event.target as Node)) {
        setProfileAnchor(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileAnchor]);

  // Debounce effect for search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  useEffect(() => {
    localStorage.setItem("search", debouncedSearch);
  }, [debouncedSearch]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  // Updated filter change handler to store numeric values
  // const handleFilterChange = (value: string | number | null) => {
  //   setFilterValue(value);
  //   // Store the numeric value directly in localStorage
  //   localStorage.setItem("filterValue", value !== null ? String(value) : "");
  // };

  const handleMobileFilterSelect = (value: string | number | null) => {
    setFilterValue(value);
    // Store the numeric value directly in localStorage
    localStorage.setItem("filterValue", value !== null ? String(value) : "");
    setFilterAnchor(null);
  };

  const filterConfig = useMemo(() => {
    if (pathName.includes("/dashboard")) {
      return {
        showFilterButton: false,
      };
    }
    if (
      (pathName.includes("/partners/overview/profile") &&
        pathName.includes("/hr-managed")) ||
      (pathName.includes("/partners/overview/profile") &&
        pathName.includes("/financial-officer"))
    ) {
      return {
        userType: true,
        accessAccountStatus: true,
        dateFilter: true,
        showFilterButton: true,
      };
    }
    if (pathName.includes("/partners/overview/profile")) {
      return {
        showFilterButton: false,
      };
    }
    if (pathName.includes("/partners/add-new-partner")) {
      return {
        showFilterButton: false,
      };
    }
    if (pathName.includes("/partners/overview")) {
      return {
        dateFilter: true,
        partnerType: true,
        accountStatus: true,
        showFilterButton: true,
      };
    }
    if (pathName.includes("/support/resources/view-all")) {
      return {
        dateFilter: true,
        showFilterButton: true,
      };
    }
    if (pathName.includes("/support/resources")) {
      return {
        showFilterButton: false,
      };
    }
    if (pathName.includes("/support/user")) {
      return {
        dateFilter: false,
        supportUrgencyLevel: true,
        supportTicketStatus: true,
        supportDateCreated: true,
        showFilterButton: true,
      };
    }
    if (pathName.includes("/support/provider")) {
      return {
        dateFilter: false,
        supportUrgencyLevel: true,
        supportTicketStatus: true,
        supportDateCreated: true,
        showFilterButton: true,
      };
    }
    if (pathName.includes("/support/clinical")) {
      return {
        dateFilter: false,
        supportUrgencyLevel: true,
        supportTicketStatus: true,
        supportDateCreated: true,
        showFilterButton: true,
      };
    }
    if (pathName.includes("/support/carer")) {
      return {
        dateFilter: false,
        supportUrgencyLevel: true,
        supportTicketStatus: true,
        supportDateCreated: true,
        showFilterButton: true,
      };
    }
    if (
      pathName.includes("/settings/push-notifications/new-push-notification") ||
      pathName.includes("/settings/push-notifications/view-details")
    ) {
      return {
        dateFilter: true,
        notificationUserBase: true,
        showFilterButton: false,
      };
    }
    if (pathName.includes("/settings/push-notifications")) {
      return {
        dateFilter: true,
        notificationUserBase: true,
        showFilterButton: true,
      };
    }
    if (pathName.includes("/settings/access")) {
      return {
        dateFilter: true,
        accessAccountStatus: true,
        accessUserType: true,
        showFilterButton: true,
      };
    }

    if (pathName.includes("/reporting/export-data")) {
      return {
        dateFilter: false,
        showFilterButton: false,
      };
    }
    if (pathName.includes("/reporting/transaction-history")) {
      return {
        dateFilter: false,
        transactionPaymentType: true,
        transactionPaymentStatus: true,
        transactionDate: true,
        showFilterButton: true,
      };
    }
    // ---------------- USERS ----------------

    if (pathName.includes("/users/health-videos/add-new-video")) {
      return {
        dateFilter: true,
        carePlan: false,
        logType: false,
        showFilterButton: false,
      };
    }

    if (
      pathName.includes("/users/overview") &&
      pathName.includes("service-agreement") &&
      pathName.includes("service-agreement") &&
      searchParams.has("status")
    ) {
      return {
        dateFilter: true,
        logStatus: false,
        serviceAgreementStatus: true,
        logType: false,
        showFilterButton: false,
      };
    }
    if (
      pathName.includes("/users/overview") &&
      pathName.includes("service-agreement")
    ) {
      return {
        dateFilter: true,
        logStatus: false,
        serviceAgreementStatus: true,
        logType: false,
        showFilterButton: true,
      };
    }
    if (
      pathName.includes("/users/overview") &&
      pathName.includes("medication-log/") &&
      (pathName.includes("medication-log-profile") ||
        pathName.includes("prescription"))
    ) {
      return {
        dateFilter: true,
        logStatus: true,
        logType: true,
        showFilterButton: false,
      };
    }
    if (
      pathName.includes("/users/overview") &&
      pathName.includes("medication-log/")
    ) {
      return {
        dateFilter: true,
        logStatus: true,
        logType: true,
        showFilterButton: true,
      };
    }

    if (
      pathName.includes("/users/overview") &&
      pathName.includes("medication-log")
    ) {
      return {
        dateFilter: true,
        logStatus: false,
        serviceAgreementStatus: true,
        logType: false,
        showFilterButton: true,
      };
    }

    if (
      pathName.includes("/users/overview") &&
      pathName.includes("care-plan")
    ) {
      return {
        emailVerification: false,
        accountStatus: false,
        dateFilter: true,
        carePlan: true,
        logType: false,
        showFilterButton: true,
      };
    }

    if (pathName.includes("/users/overview/profile")) {
      return {
        emailVerification: true,
        accountStatus: true,
        dateFilter: true,
        carePlan: false,
        logType: false,
        showFilterButton: false,
      };
    }

    if (pathName.includes("/users/overview")) {
      return {
        emailVerification: true,
        accountStatus: true,
        dateFilter: true,
        carePlan: false,
        logType: false,
        showFilterButton: true,
      };
    }

    // ---------------- CARERS (deep profile routes first) ----------------
    if (
      pathName.includes("/carers/overview/profile") &&
      pathName.includes("client-and-job-listings") &&
      pathName.includes("care-plan/")
    ) {
      return {
        showFilterButton: false,
      };
    }
    if (
      pathName.includes("/carers/overview/profile") &&
      pathName.includes("client-and-job-listings") &&
      pathName.includes("care-plan")
    ) {
      return {
        emailVerification: false,
        accountStatus: false,
        dateFilter: true,
        carePlan: true,
        logType: false,
        jobListingStatus: false,
        careType: false,
        showFilterButton: true, // ✅ show for care-plan
      };
    }
    if (
      pathName.includes("/carers/overview/profile") &&
      pathName.includes("client-and-job-listings") &&
      pathName.includes("care-notes/")
    ) {
      return {
        emailVerification: false,
        accountStatus: false,
        dateFilter: true,
        showFilterButton: false, // ✅ show for medication log
      };
    }

    if (
      pathName.includes("/carers/overview/profile") &&
      pathName.includes("client-and-job-listings") &&
      pathName.includes("care-notes")
    ) {
      return {
        emailVerification: false,
        accountStatus: false,
        dateFilter: true,
        showFilterButton: true, // ✅ show for medication log
      };
    }

    if (
      pathName.includes("/carers/overview/profile") &&
      pathName.includes("client-and-job-listings") &&
      pathName.includes("service-agreement") &&
      searchParams.has("status")
    ) {
      return {
        dateFilter: true,
        logStatus: false,
        serviceAgreementStatus: true,
        logType: false,
        showFilterButton: false,
      };
    }

    if (
      pathName.includes("/carers/overview/profile") &&
      pathName.includes("client-and-job-listings") &&
      pathName.includes("service-agreement")
    ) {
      return {
        dateFilter: true,
        logStatus: false,
        serviceAgreementStatus: true,
        logType: false,
        showFilterButton: true,
      };
    }
    if (
      pathName.includes("/carers/overview/profile") &&
      pathName.includes("client-and-job-listings") &&
      pathName.includes("medication-log/") &&
      (pathName.includes("medication-log-profile") ||
        pathName.includes("prescription"))
    ) {
      return {
        dateFilter: true,
        logStatus: true,
        logType: true,
        showFilterButton: false,
      };
    }
    if (
      pathName.includes("/carers/overview/profile") &&
      pathName.includes("client-and-job-listings") &&
      pathName.includes("medication-log/")
    ) {
      return {
        emailVerification: false,
        accountStatus: false,
        dateFilter: true,
        logStatus: true,
        logType: false,
        showFilterButton: false, // ✅ show for medication log
      };
    }
    if (
      pathName.includes("/carers/overview/profile") &&
      pathName.includes("client-and-job-listings") &&
      pathName.includes("medication-log")
    ) {
      return {
        emailVerification: false,
        accountStatus: false,
        dateFilter: true,
        logStatus: true,
        logType: false,
        showFilterButton: true, // ✅ show for medication log
      };
    }

    if (
      pathName.includes("/carers/overview/profile") &&
      pathName.includes("client-and-job-listings") &&
      pathName.includes("visit-logs/") &&
      pathName.includes("visit-log-profile")
    ) {
      return {
        emailVerification: false,
        accountStatus: false,
        dateFilter: true,
        visitLogsStatus: true,
        showFilterButton: false,
      };
    }

    if (
      pathName.includes("/carers/overview/profile") &&
      pathName.includes("client-and-job-listings") &&
      pathName.includes("visit-logs/")
    ) {
      return {
        emailVerification: false,
        accountStatus: false,
        dateFilter: true,
        visitLogsStatus: true,
        showFilterButton: false,
      };
    }

    if (
      pathName.includes("/carers/overview/profile") &&
      pathName.includes("client-and-job-listings") &&
      pathName.includes("visit-logs")
    ) {
      return {
        emailVerification: false,
        accountStatus: false,
        dateFilter: true,
        visitLogsStatus: true,
        showFilterButton: true,
      };
    }
    if (
      pathName.includes("/carers/overview/profile") &&
      pathName.includes("client-and-job-listings") &&
      pathName.includes("health-report/")
    ) {
      return {
        dateFilter: true,
        logStatus: false,
        serviceAgreementStatus: true,
        logType: false,
        showFilterButton: false,
      };
    }

    if (
      pathName.includes("/carers/overview/profile") &&
      pathName.includes("client-and-job-listings") &&
      pathName.includes("health-report")
    ) {
      return {
        dateFilter: true,
        logStatus: false,
        serviceAgreementStatus: true,
        logType: false,
        showFilterButton: true,
      };
    }

    if (
      pathName.includes("/carers/overview/profile") &&
      pathName.includes("client-and-job-listings/profile")
    ) {
      return {
        emailVerification: false,
        accountStatus: false,
        dateFilter: true,
        jobListingStatus: true,
        careType: true,
        showFilterButton: false, // ✅ hide for nested profile
      };
    }

    // ---------------- CARERS general ----------------

    //--------------- Clinical start-------------

    if (
      pathName.includes("/clinical/overview/profile") &&
      pathName.includes("client-and-job-listings") &&
      pathName.includes("care-plan")
    ) {
      return {
        emailVerification: false,
        accountStatus: false,
        dateFilter: true,
        carePlan: true,
        logType: false,
        jobListingStatus: false,
        careType: false,
        showFilterButton: true, // ✅ show for care-plan
      };
    }
    if (
      pathName.includes("/clinical/overview/profile") &&
      pathName.includes("client-and-job-listings") &&
      pathName.includes("care-notes/")
    ) {
      return {
        emailVerification: false,
        accountStatus: false,
        dateFilter: true,
        showFilterButton: false, // ✅ show for medication log
      };
    }

    if (
      pathName.includes("/clinical/overview/profile") &&
      pathName.includes("client-and-job-listings") &&
      pathName.includes("care-notes")
    ) {
      return {
        emailVerification: false,
        accountStatus: false,
        dateFilter: true,
        showFilterButton: true, // ✅ show for medication log
      };
    }

    if (
      pathName.includes("/clinical/overview/profile") &&
      pathName.includes("client-and-job-listings") &&
      pathName.includes("service-agreement") &&
      searchParams.has("status")
    ) {
      return {
        dateFilter: true,
        logStatus: false,
        serviceAgreementStatus: true,
        logType: false,
        showFilterButton: false,
      };
    }

    if (
      pathName.includes("/clinical/overview/profile") &&
      pathName.includes("client-and-job-listings") &&
      pathName.includes("service-agreement")
    ) {
      return {
        dateFilter: true,
        logStatus: false,
        serviceAgreementStatus: true,
        logType: false,
        showFilterButton: true,
      };
    }
    if (
      pathName.includes("/clinical/overview/profile") &&
      pathName.includes("client-and-job-listings") &&
      pathName.includes("medication-log/") &&
      (pathName.includes("medication-log-profile") ||
        pathName.includes("prescription"))
    ) {
      return {
        dateFilter: true,
        logStatus: true,
        logType: true,
        showFilterButton: false,
      };
    }
    if (
      pathName.includes("/clinical/overview/profile") &&
      pathName.includes("client-and-job-listings") &&
      pathName.includes("medication-log/")
    ) {
      return {
        emailVerification: false,
        accountStatus: false,
        dateFilter: true,
        logStatus: true,
        logType: false,
        showFilterButton: false, // ✅ show for medication log
      };
    }
    if (
      pathName.includes("/clinical/overview/profile") &&
      pathName.includes("client-and-job-listings") &&
      pathName.includes("medication-log")
    ) {
      return {
        emailVerification: false,
        accountStatus: false,
        dateFilter: true,
        logStatus: true,
        logType: false,
        showFilterButton: true, // ✅ show for medication log
      };
    }

    if (
      pathName.includes("/clinical/overview/profile") &&
      pathName.includes("client-and-job-listings") &&
      pathName.includes("visit-logs/") &&
      pathName.includes("visit-log-profile")
    ) {
      return {
        emailVerification: false,
        accountStatus: false,
        dateFilter: true,
        visitLogsStatus: true,
        showFilterButton: false,
      };
    }

    if (
      pathName.includes("/clinical/overview/profile") &&
      pathName.includes("client-and-job-listings") &&
      pathName.includes("visit-logs/")
    ) {
      return {
        emailVerification: false,
        accountStatus: false,
        dateFilter: true,
        visitLogsStatus: true,
        showFilterButton: false,
      };
    }

    if (
      pathName.includes("/clinical/overview/profile") &&
      pathName.includes("client-and-job-listings") &&
      pathName.includes("visit-logs")
    ) {
      return {
        emailVerification: false,
        accountStatus: false,
        dateFilter: true,
        visitLogsStatus: true,
        showFilterButton: true,
      };
    }
    if (
      pathName.includes("/clinical/overview/profile") &&
      pathName.includes("client-and-job-listings") &&
      pathName.includes("health-report/")
    ) {
      return {
        dateFilter: true,
        logStatus: false,
        serviceAgreementStatus: true,
        logType: false,
        showFilterButton: false,
      };
    }
    if (
      pathName.includes("/clinical/overview/profile") &&
      pathName.includes("client-and-job-listings") &&
      pathName.includes("health-report")
    ) {
      return {
        dateFilter: true,
        logStatus: false,
        serviceAgreementStatus: true,
        logType: false,
        showFilterButton: true,
      };
    }

    if (
      pathName.includes("/clinical/overview/profile") &&
      pathName.includes("client-and-job-listings/profile")
    ) {
      return {
        emailVerification: false,
        accountStatus: false,
        dateFilter: true,
        jobListingStatus: true,
        careType: true,
        showFilterButton: false, // ✅ hide for nested profile
      };
    }

    if (
      pathName.includes("/carers/overview/profile") &&
      pathName.includes("client-and-job-listings")
    ) {
      return {
        emailVerification: false,
        accountStatus: false,
        dateFilter: true,
        jobListingStatus: true,
        careType: true,
        showFilterButton: true,
      };
    }

    if (
      pathName.includes("/carers/overview") &&
      pathName.includes("care-plan")
    ) {
      return {
        emailVerification: false,
        accountStatus: false,
        dateFilter: true,
        carePlan: true,
        logType: false,
        showFilterButton: true,
      };
    }

    if (
      pathName.includes("/carers/overview") &&
      pathName.includes("medication-log")
    ) {
      return {
        emailVerification: false,
        accountStatus: false,
        dateFilter: true,
        logStatus: true,
        logType: true,
        showFilterButton: true,
      };
    }

    if (pathName.includes("/carers/overview/profile")) {
      return {
        emailVerification: false,
        accountStatus: true,
        dateFilter: true,
        carePlan: false,
        logType: false,
        showFilterButton: false, // default profile
      };
    }

    if (pathName.includes("/carers/overview")) {
      return {
        emailVerification: false,
        accountStatus: true,
        dateFilter: true,
        carePlan: false,
        logType: false,
        showFilterButton: true,
      };
    }

    if (pathName.includes("/carers/verifications/profile")) {
      return {
        showFilterButton: false,
      };
    }

    if (pathName.includes("/carers/verifications")) {
      return {
        emailVerification: false,
        accountStatus: true,
        dateFilter: true,
        carePlan: false,
        logType: false,
        showFilterButton: false,
      };
    }

    if (pathName.includes("/carers/payment-disputes")) {
      return {
        showFilterButton: false,
      };
    }

    // ---------------- CARERS recruitment passport ----------------

    if (pathName.includes("/clinical/payment-disputes")) {
      return {
        showFilterButton: false,
      };
    }
    if (
      (pathName.includes("/carers/recruitment-passport") &&
        pathName.includes("recent")) ||
      (pathName.includes("/carers/recruitment-passport") &&
        pathName.includes("users")) ||
      (pathName.includes("/carers/recruitment-passport") &&
        pathName.includes("restricted-user"))
    ) {
      return {
        emailVerification: false,
        accountStatus: false,
        dateFilter: true,
        carePlan: false,
        logType: false,
        passportStatus: false,
        showFilterButton: true,
      };
    }

    if (
      (pathName.includes("/carers/recruitment-passport") &&
        pathName.includes("view-passport")) ||
      (pathName.includes("/carers/recruitment-passport") &&
        pathName.includes("view-count")) ||
      pathName.includes("carers/verifications")
    ) {
      return {
        emailVerification: false,
        accountStatus: false,
        dateFilter: true,
        carePlan: false,
        logType: false,
        passportStatus: true,
        showFilterButton: false,
      };
    }

    if (pathName.includes("/carers/recruitment-passport")) {
      return {
        emailVerification: false,
        accountStatus: false,
        dateFilter: true,
        carePlan: false,
        logType: false,
        passportStatus: true,
        showFilterButton: true,
      };
    }

    // ---------------- CLINICAL ----------------

    if (
      pathName.includes("/clinical/overview/profile") &&
      pathName.includes("client-and-job-listings")
    ) {
      return {
        emailVerification: false,
        accountStatus: false,
        dateFilter: true,
        jobListingStatus: true,
        careType: true,
        showFilterButton: true,
      };
    }

    if (
      pathName.includes("/clinical/overview") &&
      pathName.includes("care-plan")
    ) {
      return {
        emailVerification: false,
        accountStatus: false,
        dateFilter: true,
        carePlan: true,
        logType: false,
        showFilterButton: true,
      };
    }

    if (
      pathName.includes("/clinical/overview") &&
      pathName.includes("medication-log")
    ) {
      return {
        emailVerification: false,
        accountStatus: false,
        dateFilter: true,
        logStatus: true,
        logType: true,
        showFilterButton: true,
      };
    }

    if (pathName.includes("/clinical/overview/profile")) {
      return {
        showFilterButton: false,
      };
    }
    if (pathName.includes("/clinical/overview")) {
      return {
        emailVerification: false,
        accountStatus: true,
        dateFilter: true,
        carePlan: false,
        logType: false,
        showFilterButton: true,
      };
    }
    if (pathName.includes("/clinical/verifications/profile")) {
      return {
        showFilterButton: false,
      };
    }

    if (pathName.includes("/clinical/verifications")) {
      return {
        emailVerification: false,
        accountStatus: true,
        dateFilter: true,
        carePlan: false,
        logType: false,
        showFilterButton: false,
      };
    }

    // ---------------- PROVIDERS ----------------

    if (pathName.includes("/providers/resources/view-all/")) {
      return {
        emailVerification: false,
        accountStatus: false,
        dateFilter: true,
        carePlan: false,
        logType: false,
        showFilterButton: false,
      };
    }

    if (pathName.includes("/providers/resources/view-all")) {
      return {
        emailVerification: false,
        accountStatus: false,
        dateFilter: true,
        carePlan: false,
        logType: false,
        showFilterButton: true,
      };
    }

    if (pathName.includes("/providers/resources")) {
      return {
        emailVerification: false,
        accountStatus: false,
        dateFilter: true,
        carePlan: false,
        logType: false,
        showFilterButton: false,
      };
    }

    if (pathName.includes("/providers/payment-disputes")) {
      return {
        emailVerification: false,
        accountStatus: false,
        dateFilter: true,
        carePlan: false,
        logType: false,
        showFilterButton: false,
      };
    }

    if (
      pathName.includes("/providers/overview/profile") &&
      pathName.includes("/job-listings/all-job-listings")
    ) {
      return {
        dateFilter: true,
        jobListing: true,
        showFilterButton: true,
      };
    }

    if (pathName.includes("/providers/overview/profile")) {
      return {
        emailVerification: false,
        accountStatus: true,
        dateFilter: true,
        carePlan: false,
        logType: false,
        showFilterButton: false,
      };
    }

    if (pathName.includes("/providers/overview")) {
      return {
        emailVerification: false,
        accountStatus: true,
        dateFilter: true,
        carePlan: false,
        logType: false,
        showFilterButton: true,
      };
    }

    // ---------------- DEFAULT ----------------
    return {
      emailVerification: false,
      accountStatus: false,
      dateFilter: true,
      carePlan: false,
      logType: false,
      showFilterButton: true,
    };
  }, [pathName, searchParams]);

  return (
    <StyledWrapper>
      <Stack
        direction={"row"}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <Stack direction={"row"} spacing={4} alignItems={"center"}>
          {isMobile && (
            <Stack direction={"row"} alignItems={"center"}>
              <IconButton onClick={toggleSidebar} sx={{ mr: 1 }}>
                <MenuIcon />
              </IconButton>
              <StyledProfile
                onClick={() => navigateWithLoading("/my-account")}
                sx={{ cursor: "pointer" }}
              >
                <Typography variant="h6" fontWeight={600}>
                  {`${firstName?.[0] || "K"}${lastName?.[0] || "H"}`}
                </Typography>
              </StyledProfile>
            </Stack>
          )}
          {!isMobile && (
            <Box>
              <Typography variant="caption" fontWeight={400}>
                {breadcrumb.map((segment, index) => {
                  const isLast = index === breadcrumb.length - 1;
                  return (
                    <Typography
                      key={index}
                      component="span"
                      variant="caption"
                      fontWeight={400}
                      color={
                        isLast
                          ? segment === "Dashboard" ||
                            segment === "Notifications"
                            ? "gray"
                            : theme.palette.common.black
                          : "gray"
                      }
                    >
                      {segment} {isLast ? "" : "/"}&nbsp;
                    </Typography>
                  );
                })}
              </Typography>
              <Typography variant="h6" fontWeight={500}>
                {title}
              </Typography>
            </Box>
          )}

          {!isMobile && (
            <Box>
              {!pathName.includes("team-members") && (
                <Stack direction={"row"} alignItems={"center"} spacing={3}>
                  {filterConfig?.showFilterButton && (
                    <CommonInput
                      placeholder="Search users or carers..."
                      value={search}
                      onChange={handleChange}
                      startAdornment={
                        <SearchIcon sx={{ fontSize: "18px", mr: 1 }} />
                      }
                      sx={{
                        height: "30px",
                        fontSize: "12px",
                        "&.MuiOutlinedInput-root": {
                          border: `1px solid ${theme.pending.secondary}`,
                        },
                        borderRadius: "8px",
                      }}
                    />
                  )}
                  {/* <CommonSelect
                    placeholder="Filters"
                    value={filterValue}
                    onChange={handleFilterChange}
                    options={filterOptions}
                    withFilter={true}
                    sx={{ width: 120, height: "30px" }}
                  /> */}
                  {filterConfig?.showFilterButton && (
                    <Stack
                      flexDirection={"row"}
                      alignItems={"center"}
                      gap={1}
                      sx={{
                        backgroundColor: "#E2E6EB80",
                        borderRadius: "8px",
                        padding: "5px 15px",
                        cursor: "pointer",
                        border: "none",
                      }}
                      component={"button"}
                      onClick={() => setFilterModalOpen(true)}
                    >
                      <Image
                        src={"/assets/svg/sidebar/filter.svg"}
                        height={15}
                        width={15}
                        alt="signature"
                      />
                      <Typography
                        variant="subtitle1"
                        fontSize={"13px"}
                        lineHeight={1}
                      >
                        Filters
                      </Typography>
                      <KeyboardArrowDownIcon sx={{ fontSize: "22px" }} />
                    </Stack>
                  )}
                </Stack>
              )}
            </Box>
          )}
        </Stack>
        <Stack
          direction={"row"}
          alignItems={"center"}
          spacing={isMobile ? 0 : 2}
        >
          {isMobile ? (
            <>
              {filterConfig?.showFilterButton && (
                <IconButton onClick={() => setSearchOpen(true)}>
                  <SearchIcon />
                </IconButton>
              )}
              <IconButton onClick={() => setFilterModalOpen(true)}>
                <FilterListIcon />
              </IconButton>
            </>
          ) : (
            <>
              <StyledProfile onClick={() => navigateWithLoading("/my-account")}>
                <Typography variant="h6" fontWeight={600}>
                  {`${firstName?.[0] || "K"}${lastName?.[0] || "H"}`}
                </Typography>
              </StyledProfile>
              {!isLaptop && (
                <Box>
                  <Typography variant="body1" fontWeight={500}>
                    {`${firstName ? firstName : "Kat"} ${
                      lastName ? lastName : "Hall"
                    }`}
                  </Typography>
                  <Typography
                    textTransform={"none"}
                    variant="caption"
                    fontWeight={400}
                  >
                    Super-admin
                  </Typography>
                </Box>
              )}
            </>
          )}
        </Stack>
      </Stack>

      {searchOpen && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            zIndex: 1000,
          }}
          onClick={() => setSearchOpen(false)}
        >
          <Box
            sx={{
              width: "90%",
              backgroundColor: theme.palette.common.white,
              borderRadius: "8px",
              px: 1,
              py: 0.5,
              mt: 7,
              display: "flex",
              alignItems: "center",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <CommonInput
              placeholder="Search users or carers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ paddingInline: 0, width: "100%" }}
            />
          </Box>
        </Box>
      )}

      {filterModalOpen && (
        <FilterModal
          isOpen={filterModalOpen}
          onClose={() => setFilterModalOpen(false)}
          onClick={() => setFilterModalOpen(false)}
          filterConfig={filterConfig}
        />
      )}

      <Popover
        open={Boolean(filterAnchor)}
        anchorEl={filterAnchor}
        onClose={() => setFilterAnchor(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Box sx={{ width: 140 }}>
          {filterOptions.map((option) => (
            <MenuItem
              sx={{ fontSize: "12px", minHeight: "35px" }}
              key={option.value}
              onClick={() => handleMobileFilterSelect(option.value)}
            >
              {option.label}
            </MenuItem>
          ))}
        </Box>
      </Popover>
    </StyledWrapper>
  );
};

export default Header;
