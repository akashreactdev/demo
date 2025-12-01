"use client";
import React, { useEffect, useMemo, useState } from "react";
import moment from "moment";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import Grid2 from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import { CircularProgress } from "@mui/material";
//relative path imports
import OverviewCard from "@/components/Cards/Overview";
import CommonCard from "@/components/Cards/Common";
import ApprovalListItem from "@/components/carers/profile/ApprovalListItem";
import {
  getAllProvider,
  getVerificationSummary,
} from "@/services/api/providerApi";
import Pagination from "@/components/Pagination";
import { UserStatus } from "@/constants/providerData";
import { useRouterLoading } from "@/hooks/useRouterLoading";
import { ProviderPermissionsState } from "../overview/page";
import { AdminProviderPermission } from "@/constants/accessData";
import SelectCancelModal from "@/components/CommonModal";

interface VerificationData {
  _id: string;
  approvedBy: string | null;
  businessName: string | null;
  businessLogo: string | null;
  dateApproved: string | null;
  engagementRate: number;
  responseRate: number;
  typeOfProvider: string | null;
  providerId: string | null;
  status: number;
  createdAt: string | null;
  usersInfo: {
    firstName: string;
    lastName: string;
  };
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
  const [rowsPerPage] = useState<number>(10);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [VerificationData, setVerificationData] = useState<VerificationData[]>(
    []
  );
  const [verificationSummary, setProviderSummary] =
    useState<VerificationSummaryData | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalpages] = useState<number>(0);
  const [providerPermissionsState, setProviderPermissionsState] =
    useState<ProviderPermissionsState>({
      viewProviderDetails: false,
      verifyNewProviderDetails: false,
      viewProviderPaymentDispute: false,
    });
  const [isPermissionModalOpen, setIsPermissionModalOpen] =
    useState<boolean>(false);

  useEffect(() => {
    const savedPermissions = localStorage.getItem("providerPermissions");
    if (savedPermissions) {
      try {
        const parsed: number[] = JSON.parse(savedPermissions);
        setProviderPermissionsState({
          viewProviderDetails: parsed.includes(
            AdminProviderPermission.VIEW_PROVIDER_DETAILS
          ),
          verifyNewProviderDetails: parsed.includes(
            AdminProviderPermission.VERIFY_NEW_PROVIDER_DETAILS
          ),
          viewProviderPaymentDispute: parsed.includes(
            AdminProviderPermission.VIEW_PROVIDER_PAYMENT_DISPUTE
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
    fetchAllVerifications(currentPage);
    fetchVerificationSummary();
  }, [currentPage]);

  const fetchAllVerifications = async (page: number) => {
    setIsLoading(true);
    try {
      const response = (await getAllProvider({
        limit: rowsPerPage,
        page: page + 1,
        // status: "1,5",
        accountStatus: 1,
      })) as VerificationListResponse;
      if (response?.data?.success) {
        setVerificationData(response?.data?.data);
        setTotalpages(response?.data?.meta?.totalPages);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchVerificationSummary = async () => {
    try {
      const response =
        (await getVerificationSummary()) as VerificationSummaryResponse;
      if (response?.data?.success) {
        setProviderSummary(response?.data?.data);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
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
              ? "0"
              : verificationSummary?.processingRate
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
              : verificationSummary?.averageWaitTime
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
      {isLoading ? (
        <Box
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          height={"calc(100vh - 300px)"}
        >
          <CircularProgress size={30} />
        </Box>
      ) : (
        <>
          <Grid2 container spacing={2}>
            {data.map((ele, index) => {
              return (
                <Grid2
                  key={index}
                  size={{ md: 6, sm: 6, xs: 12, lg: 3, xl: 3 }}
                >
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
                These are providers profiles in need of a review
              </Typography>
              <Box mt={1}>
                {VerificationData?.map((verification, index) => {
                  return (
                    <Box key={index}>
                      <ApprovalListItem
                        profilePic={
                          verification?.businessLogo
                            ? `${process.env.NEXT_PUBLIC_ASSETS_URL}/${verification.businessLogo}`
                            : "/assets/images/Rectangle.jpg"
                        }
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
                        profileName={
                          verification?.businessName
                            ? verification?.businessName
                            : "N/A"
                        }
                        dateTitle={"Date joined"}
                        date={
                          verification?.createdAt
                            ? moment(verification?.createdAt).format(
                                "Do MMMM YYYY"
                              )
                            : "N/A"
                        }
                        approvalTitle={
                          typeof verification?.status === "number"
                            ? UserStatus[verification.status as UserStatus]
                            : "N/A"
                        }
                        approvalVariant={
                          verification?.status === 1 ? "primary" : "primary"
                        }
                        onClickMenuBtn={() => {
                          if (
                            providerPermissionsState?.verifyNewProviderDetails
                          ) {
                            navigateWithLoading(
                              `/providers/verifications/profile/${verification.providerId}`
                            );
                          } else {
                            setIsPermissionModalOpen(true);
                          }
                        }}
                      />
                      <Divider sx={{ marginBlock: 2 }} />
                    </Box>
                  );
                })}
              </Box>
              {!isLoading && (
                <Box mt={3}>
                  <Pagination
                    page={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </Box>
              )}
            </CommonCard>
          </Box>
        </>
      )}
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
