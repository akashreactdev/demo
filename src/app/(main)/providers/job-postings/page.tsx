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
  getAllJobPosting,
  getJobPostingSummary,
} from "@/services/api/providerApi";
import Pagination from "@/components/Pagination";
import { useRouterLoading } from "@/hooks/useRouterLoading";

export interface JobListResponse {
  data: {
    success: boolean;
    message: string;
    data: JobItem[];
    meta: PaginationMeta;
  };
}

export interface JobItem {
  _id: string;
  jobTitle: string;
  startDate: string; 
  frequency: number;
  requirement: Requirement;
  county: string;
  preferredGender: number;
  budgetType: number;
  isAdminApprovalRequired: boolean;
  approvedAt: string | null;
  status: number;
  fullName: string;
  profile: string | null;
  approvedByAdmin: string | null;
}

export interface Requirement {
  name: string;
  value: number;
}

export interface PaginationMeta {
  totalDocs: number;
  limit: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: number | null;
  prevPage: number | null;
}

interface VerificationSummaryResponse {
  data: {
    data: VerificationSummaryData;
    success: boolean;
  };
}

interface VerificationSummaryData {
  totalAwaiting: number;
  processingRate: number;
  averageWaitTime: number;
  totalApproved: number;
}

const JobPostingList: React.FC = () => {
  const { navigateWithLoading } = useRouterLoading();
  const [rowsPerPage] = useState<number>(10);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [VerificationData, setVerificationData] = useState<JobItem[]>([]);
  const [verificationSummary, setProviderSummary] =
    useState<VerificationSummaryData | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalpages] = useState<number>(0);

  useEffect(() => {
    fetchAllVerifications(currentPage);
    fetchVerificationSummary();
  }, [currentPage]);

  const fetchAllVerifications = async (page: number) => {
    setIsLoading(true);
    try {
      const response = (await getAllJobPosting({
        limit: rowsPerPage,
        page: page + 1,
        status: 2, // pending = 2
      })) as JobListResponse;
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
        (await getJobPostingSummary()) as VerificationSummaryResponse;
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
          verificationSummary?.totalAwaiting !== null &&
          verificationSummary?.totalAwaiting !== undefined
            ? verificationSummary?.totalAwaiting === 0
              ? "0"
              : verificationSummary?.totalAwaiting
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
          verificationSummary?.totalApproved !== null &&
          verificationSummary?.totalApproved !== undefined
            ? verificationSummary?.totalApproved === 0
              ? "0"
              : verificationSummary?.totalApproved
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
                          verification?.profile
                            ? `${process.env.NEXT_PUBLIC_ASSETS_URL}/${verification.profile}`
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
                          verification?.fullName
                            ? verification?.fullName
                            : "N/A"
                        }
                        dateTitle={"Date joined"}
                        date={
                          verification?.startDate
                            ? moment(verification?.startDate).format(
                                "Do MMMM YYYY"
                              )
                            : "N/A"
                        }
                        approvalTitle={"Job listing approval"}
                        approvalVariant={
                          verification?.status === 1 ? "primary" : "primary"
                        }
                        onClickMenuBtn={() =>
                          navigateWithLoading(
                            `/providers/job-postings/profile/${verification._id}`
                          )
                        }
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
    </Box>
  );
};

export default JobPostingList;
