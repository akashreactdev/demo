"use client";
import React, { useEffect, useMemo, useState } from "react";
import moment from "moment";
import Box from "@mui/material/Box";
import Grid2 from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
//relative path imports
import OverviewCard from "@/components/Cards/Overview";
import CommonCard from "@/components/Cards/Common";
import ApprovalListItem from "@/components/carers/profile/ApprovalListItem";
import Pagination from "@/components/Pagination";
import {
  getAllClinical,
  getClinicalVerificationSummary,
} from "@/services/api/clinicalApi";
import { UserStatus } from "@/constants/providerData";
import { useRouterLoading } from "@/hooks/useRouterLoading";
import { ClinicalPermissionsState } from "../overview/page";
import { AdminClinicalPermission } from "@/constants/accessData";
import SelectCancelModal from "@/components/CommonModal";

interface VerificationData {
  _id: string;
  approvedBy: string | null;
  businessName: string | null;
  businessLogo: string | null;
  dateApproved: string | null;
  engagementRate: number;
  photo: string | null;
  responseRate: number;
  typeOfProvider: string | null;
  clinicalId: string | null;
  // usersInfo: {
  firstName: string;
  lastName: string;
  status: number;
  createdAt: string | null;
  profile?: string | null;
  // };
}

interface VerificationListResponse {
  data: {
    success: boolean;
    message: string;
    data: VerificationData[];
    meta: {
      totalDocs: number;
      totalPages: number;
    };
  };
}

interface VerificationSummaryResponse {
  data: {
    data: VerificationSummaryData;
    success: boolean;
  };
}

interface VerificationSummaryData {
  awaitingAccount: number;
  processingRate: number;
  averageWaitTime: number;
  approvedAccount: number;
}

const Verifications: React.FC = () => {
  const { navigateWithLoading } = useRouterLoading();
  const [verificationSummary, setVerificationSummary] =
    useState<VerificationSummaryData | null>(null);
  const [currentPageForPending, setCurrentPageForPending] = useState<number>(0);
  // const [currentPageForReview, setCurrentPageForReview] = useState<number>(0);
  const [totalPagesForPending, setTotalpagesForPending] = useState<number>(0);
  // const [totalPagesForRerview, setTotalpagesForRerview] = useState<number>(0);
  const [rowsPerPage] = useState<number>(10);
  const [isPendingLoading, setIsPendingLoading] = useState<boolean>(false);
  // const [isReviewLoading, setIsReviewLoading] = useState<boolean>(false);

  const [pendingVerificationData, setPendingVerificationData] = useState<
    VerificationData[]
  >([]);
  const [clinicalPermissionsState, setClinicalPermissionsState] =
    useState<ClinicalPermissionsState>({
      viewClinicalDetails: false,
      verifyNewClinicalDetails: false,
      viewClinicalPaymentDispute: false,
    });
  const [isPermissionModalOpen, setIsPermissionModalOpen] =
    useState<boolean>(false);
  // const [reviewVerificationData, setReviewVerificationData] = useState<
  //   VerificationData[]
  // >([]);

  useEffect(() => {
    const savedPermissions = localStorage.getItem("clinicalPermissions");
    if (savedPermissions) {
      try {
        const parsed: number[] = JSON.parse(savedPermissions);
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
    fetchAllVerificationsPending(currentPageForPending);
    fetchClinicalVerificationSummary();
  }, [currentPageForPending]);

  // useEffect(() => {
  //   fetchAllVerificationsReview(currentPageForReview);
  //   fetchClinicalVerificationSummary();
  // }, [currentPageForReview]);

  const handlePageChangeForPending = (page: number) => {
    setCurrentPageForPending(page);
  };
  // const handlePageChangeForReview = (page: number) => {
  //   setCurrentPageForReview(page);
  // };

  const fetchAllVerificationsPending = async (page: number) => {
    setIsPendingLoading(true);
    try {
      const response = (await getAllClinical({
        limit: rowsPerPage,
        page: page + 1,
        accountStatus: 1,
      })) as VerificationListResponse;
      if (response?.data?.success) {
        setPendingVerificationData(response?.data?.data);
        setTotalpagesForPending(response?.data?.meta?.totalPages);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsPendingLoading(false);
    }
  };

  // const fetchAllVerificationsReview = async (page: number) => {
  //   setIsReviewLoading(true);
  //   try {
  //     const response = (await getAllClinical({
  //       limit: rowsPerPage,
  //       page: page + 1,
  //       status: 5,
  //     })) as VerificationListResponse;
  //     if (response?.data?.success) {
  //       setReviewVerificationData(response?.data?.data);
  //       setTotalpagesForRerview(response?.data?.meta?.totalPages);
  //     }
  //   } catch (e) {
  //     console.log(e);
  //   } finally {
  //     setIsReviewLoading(false);
  //   }
  // };

  const fetchClinicalVerificationSummary = async () => {
    try {
      const response =
        (await getClinicalVerificationSummary()) as VerificationSummaryResponse;
      if (response?.data?.success) {
        setVerificationSummary(response?.data?.data);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const data = useMemo(() => {
    return [
      {
        icon: "/assets/svg/carers/verifications/hourglass.svg",
        title: "Total awaiting",
        count:
          verificationSummary?.awaitingAccount !== null &&
          verificationSummary?.awaitingAccount !== undefined
            ? verificationSummary?.awaitingAccount === 0
              ? "0"
              : verificationSummary?.awaitingAccount
            : "N/A",
      },
      {
        icon: "/assets/svg/carers/verifications/singleneutral.svg",
        title: "Processing rate",
        count:
          verificationSummary?.processingRate !== null &&
          verificationSummary?.processingRate !== undefined
            ? verificationSummary?.processingRate === 0
              ? "0%"
              : `${verificationSummary?.processingRate}%`
            : "N/A",
      },
      {
        icon: "/assets/svg/carers/overview/response_rate.svg",
        title: "Average wait time",
        count:
          verificationSummary?.averageWaitTime !== null &&
          verificationSummary?.averageWaitTime !== undefined
            ? verificationSummary?.averageWaitTime === 0
              ? "0"
              : `${verificationSummary?.averageWaitTime}`
            : "N/A",
      },
      {
        icon: "/assets/svg/carers/verifications/approval.svg",
        title: "Total approved",
        count:
          verificationSummary?.approvedAccount !== null &&
          verificationSummary?.approvedAccount !== undefined
            ? verificationSummary?.approvedAccount === 0
              ? "0"
              : verificationSummary?.approvedAccount
            : "N/A",
      },
    ];
  }, [verificationSummary]);
  return (
    <Box>
      <Grid2 container spacing={2}>
        {data.map((ele, index) => {
          return (
            <Grid2 key={index} size={{ md: 6, sm: 6, xs: 12, lg: 3, xl: 3 }}>
              <OverviewCard
                path={ele.icon}
                alt={ele.icon}
                title={ele.title}
                count={ele.count}
              />
            </Grid2>
          );
        })}
      </Grid2>

      <Box mt={4}>
        <CommonCard>
          <Typography variant="h6" fontWeight={500}>
            Awaiting verification
          </Typography>
          <Typography variant="caption" fontWeight={400}>
            These are the clinical profiles awaiting verification.
          </Typography>
          <Box mt={1}>
            {pendingVerificationData.map((data, index) => {
              return (
                <Box key={index} mt={3}>
                  <ApprovalListItem
                    profilePic={
                      data?.profile !== null && data?.profile !== undefined
                        ? `${process.env.NEXT_PUBLIC_ASSETS_URL}/${data?.profile}`
                        : "/assets/images/profile.jpg"
                    }
                    profileName={`${data?.firstName} ${data?.lastName}`}
                    isRowButton={true}
                    sx={{
                      "&:hover": {
                        backgroundColor: "#EAEAEA",
                      },
                      backgroundColor: "transparent",
                      padding: "20px",
                      borderRadius: "15px",
                      cursor: "pointer",
                      border: "none",
                    }}
                    dateTitle={"Date joined"}
                    date={
                      data?.createdAt
                        ? moment(data?.createdAt).format("Do MMMM YYYY")
                        : "N/A"
                    }
                    approvalTitle={
                      typeof data?.status === "number"
                        ? UserStatus[data.status as UserStatus]
                        : "N/A"
                    }
                    approvalVariant={"primary"}
                    onClickMenuBtn={() => {
                      if (clinicalPermissionsState?.verifyNewClinicalDetails) {
                        navigateWithLoading(
                          `/clinical/verifications/profile/${data?.clinicalId}`
                        );
                      } else {
                        setIsPermissionModalOpen(true);
                      }
                    }}
                  />
                  <Divider sx={{ mt: 3 }} />
                </Box>
              );
            })}
          </Box>
          {!isPendingLoading && (
            <Box mt={3}>
              <Pagination
                page={currentPageForPending}
                totalPages={totalPagesForPending}
                onPageChange={handlePageChangeForPending}
              />
            </Box>
          )}
        </CommonCard>
      </Box>

      {/* <Box mt={4}>
        <CommonCard>
          <Typography variant="h6" fontWeight={500}>
            Under review
          </Typography>
          <Typography variant="caption" fontWeight={400}>
            These are the carer profiles awaiting verification.
          </Typography>
          <Box mt={1}>
            {reviewVerificationData.map((data, index) => {
              return (
                <Box key={index} mt={3}>
                  <ApprovalListItem
                    profilePic={
                      data?.usersInfo?.profile !== null &&
                      data?.usersInfo?.profile !== undefined
                        ? `${process.env.NEXT_PUBLIC_ASSETS_URL}/${data?.usersInfo?.profile}`
                        : "/assets/images/profile.jpg"
                    }
                    profileName={`${data?.usersInfo?.firstName} ${data?.usersInfo?.lastName}`}
                    dateTitle={"Date joined"}
                    date={
                      data?.usersInfo?.createdAt
                        ? moment(data?.usersInfo?.createdAt).format(
                            "Do MMMM YYYY"
                          )
                        : "N/A"
                    }
                    approvalTitle={
                      typeof data?.usersInfo?.status === "number"
                        ? UserStatus[data.usersInfo.status as UserStatus]
                        : "N/A"
                    }
                    approvalVariant={
                      data?.usersInfo?.status === 1 ? "default" : "primary"
                    }
                    onClickMenuBtn={() =>
                      navigateWithLoading(
                        `/clinical/verifications/profile/${data?._id}`
                      )
                    }
                  />
                  <Divider sx={{ mt: 3 }} />
                </Box>
              );
            })}
          </Box>
          {!isReviewLoading && (
            <Box mt={3}>
              <Pagination
                page={currentPageForReview}
                totalPages={totalPagesForRerview}
                onPageChange={handlePageChangeForReview}
              />
            </Box>
          )}
        </CommonCard>
      </Box> */}
      <SelectCancelModal
        title="Message"
        question={`You don't have right to access this feature. Please ask the support team to update your rights.`}
        buttonText="Done"
        isOpen={isPermissionModalOpen}
        isCancelButtonShow={false}
        onRemove={() => setIsPermissionModalOpen(false)}
      />
    </Box>
  );
};

export default Verifications;
