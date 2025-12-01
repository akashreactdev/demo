"use client";
import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import { CircularProgress, useMediaQuery } from "@mui/material";
import Box from "@mui/material/Box";
import Grid2 from "@mui/material/Grid2";
import CommonCard from "@/components/Cards/Common";
import CommonAccordion from "@/components/CommonAccordian";
import CommonButton from "@/components/CommonButton";
import { useRouterLoading } from "@/hooks/useRouterLoading";
import { getAllProviderFAQs } from "@/services/api/supportApi";
import { FAQApiResponse, FAQItem } from "../page";

const AllFAQs: React.FC = () => {
  const theme = useTheme();
  const [rowsPerPage] = useState<number>(10);
  const { navigateWithLoading } = useRouterLoading();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userFaqData, setUserFaqData] = useState<FAQItem[]>([]);
  const [carerFaqData, setCarerFaqData] = useState<FAQItem[]>([]);
  const [clincalFaqData, setClinicalFaqData] = useState<FAQItem[]>([]);
  const [providerFaqData, setProviderFaqData] = useState<FAQItem[]>([]);

  useEffect(() => {
    fetchAllCarersFAQs(0);
    fetchAllClinicalsFAQs(0);
    fetchAllProvidersFAQs(0);
    fetchAllUsersFAQs(0);
  }, []);

  const fetchAllUsersFAQs = async (page: number) => {
    setIsLoading(true);
    try {
      const response = (await getAllProviderFAQs({
        limit: rowsPerPage,
        page: page + 1,
        userType: 2, // user = 2
      })) as FAQApiResponse;
      if (response?.data?.success) {
        setUserFaqData(response?.data?.data?.items);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllCarersFAQs = async (page: number) => {
    setIsLoading(true);
    try {
      const response = (await getAllProviderFAQs({
        limit: rowsPerPage,
        page: page + 1,
        userType: 3, // carer = 3
      })) as FAQApiResponse;
      if (response?.data?.success) {
        setCarerFaqData(response?.data?.data?.items);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllClinicalsFAQs = async (page: number) => {
    setIsLoading(true);
    try {
      const response = (await getAllProviderFAQs({
        limit: rowsPerPage,
        page: page + 1,
        userType: 4, // clinical = 4
      })) as FAQApiResponse;
      if (response?.data?.success) {
        setClinicalFaqData(response?.data?.data?.items);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllProvidersFAQs = async (page: number) => {
    setIsLoading(true);
    try {
      const response = (await getAllProviderFAQs({
        limit: rowsPerPage,
        page: page + 1,
        userType: 5, // provider = 5
      })) as FAQApiResponse;
      if (response?.data?.success) {
        setProviderFaqData(response?.data?.data?.items);
      }
    } catch (e) {
      console.log(e);
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
      <Grid2 container spacing={2} mt={2}>
        <Grid2 size={{ md: 6, sm: 6, xs: 12, lg: 6, xl: 6 }}>
          <Box>
            <CommonCard>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="h6" fontWeight={500}>
                  Users
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <CommonButton
                    buttonText="View All"
                    sx={{
                      maxWidth: isMobile ? "100%" : "max-content",
                      backgroundColor: theme.palette.common.white,
                    }}
                    buttonTextStyle={{ fontSize: "14px !important" }}
                    onClick={() =>
                      navigateWithLoading("/support/resources/users-faqs")
                    }
                  />
                </Box>
              </Box>
              <Box mt={2}>
                {userFaqData && userFaqData.length > 0 ? (
                  userFaqData?.slice(0, 3).map((data, index) => (
                    <CommonAccordion
                      key={index}
                      title={`${data?.question}`}
                      defaultExpanded={false}
                      sx={{ paddingBottom: "10px", marginBottom: "10px" }}
                    >
                      <Typography
                        variant="body1"
                        dangerouslySetInnerHTML={{
                          __html: data?.answer || "",
                        }}
                      />
                    </CommonAccordion>
                  ))
                ) : (
                  <Typography
                    variant="body2"
                    sx={{ textAlign: "center", py: 2 }}
                  >
                    No FAQ found
                  </Typography>
                )}
              </Box>
            </CommonCard>
          </Box>

          <Box mt={3}>
            <CommonCard>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="h6" fontWeight={500}>
                  Providers
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <CommonButton
                    buttonText="View All"
                    sx={{
                      maxWidth: isMobile ? "100%" : "max-content",
                      backgroundColor: theme.palette.common.white,
                    }}
                    buttonTextStyle={{ fontSize: "14px !important" }}
                    onClick={() =>
                      navigateWithLoading("/support/resources/providers-faqs")
                    }
                  />
                </Box>
              </Box>
              <Box mt={2}>
                {providerFaqData && providerFaqData?.length > 0 ? (
                  providerFaqData?.slice(0, 3).map((data, index) => (
                    <CommonAccordion
                      key={index}
                      title={`${data?.question}`}
                      defaultExpanded={false}
                      sx={{ paddingBottom: "10px", marginBottom: "10px" }}
                    >
                      <Typography
                        variant="body1"
                        dangerouslySetInnerHTML={{
                          __html: data?.answer || "",
                        }}
                      />
                    </CommonAccordion>
                  ))
                ) : (
                  <Typography
                    variant="body2"
                    sx={{ textAlign: "center", py: 2 }}
                  >
                    No FAQ found
                  </Typography>
                )}
              </Box>
            </CommonCard>
          </Box>
        </Grid2>
        <Grid2 size={{ md: 6, sm: 6, xs: 12, lg: 6, xl: 6 }}>
          <Box>
            <CommonCard>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="h6" fontWeight={500}>
                  Carers
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <CommonButton
                    buttonText="View All"
                    sx={{
                      maxWidth: isMobile ? "100%" : "max-content",
                      backgroundColor: theme.palette.common.white,
                    }}
                    buttonTextStyle={{ fontSize: "14px !important" }}
                    onClick={() =>
                      navigateWithLoading("/support/resources/carers-faqs")
                    }
                  />
                </Box>
              </Box>
              <Box mt={2}>
                {carerFaqData && carerFaqData.length > 0 ? (
                  carerFaqData?.slice(0, 3).map((data, index) => (
                    <CommonAccordion
                      key={index}
                      title={`${data?.question}`}
                      defaultExpanded={false}
                      sx={{ paddingBottom: "10px", marginBottom: "10px" }}
                    >
                      <Typography
                        variant="body1"
                        dangerouslySetInnerHTML={{
                          __html: data?.answer || "",
                        }}
                      />
                    </CommonAccordion>
                  ))
                ) : (
                  <Typography
                    variant="body2"
                    sx={{ textAlign: "center", py: 2 }}
                  >
                    No FAQ found
                  </Typography>
                )}
              </Box>
            </CommonCard>
          </Box>

          <Box mt={3}>
            <CommonCard>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="h6" fontWeight={500}>
                  Clinicals
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <CommonButton
                    buttonText="View All"
                    sx={{
                      maxWidth: isMobile ? "100%" : "max-content",
                      backgroundColor: theme.palette.common.white,
                    }}
                    buttonTextStyle={{ fontSize: "14px !important" }}
                    onClick={() =>
                      navigateWithLoading("/support/resources/clinicals-faqs")
                    }
                  />
                </Box>
              </Box>
              <Box mt={2}>
                {clincalFaqData && clincalFaqData.length > 0 ? (
                  clincalFaqData?.slice(0, 3).map((data, index) => (
                    <CommonAccordion
                      key={index}
                      title={`${data?.question}`}
                      defaultExpanded={false}
                      sx={{ paddingBottom: "10px", marginBottom: "10px" }}
                    >
                      <Typography
                        variant="body1"
                        dangerouslySetInnerHTML={{
                          __html: data?.answer || "",
                        }}
                      />
                    </CommonAccordion>
                  ))
                ) : (
                  <Typography
                    variant="body2"
                    sx={{ textAlign: "center", py: 2 }}
                  >
                    No FAQ found
                  </Typography>
                )}
              </Box>
            </CommonCard>
          </Box>
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default AllFAQs;
