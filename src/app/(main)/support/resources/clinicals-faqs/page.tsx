"use client";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import {
  CircularProgress,
  Divider,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import Box from "@mui/material/Box";
import CloseIcon from "@mui/icons-material/Close";
import CommonCard from "@/components/Cards/Common";
import CommonButton from "@/components/CommonButton";
import { RemoveFAQResponse } from "../carers-faqs/page";
import {
  deleteProviderFAQ,
  getAllProviderFAQs,
} from "@/services/api/supportApi";
import { FAQApiResponse, FAQItem } from "../page";

const ClinicalsFAQs: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [rowsPerPage] = useState<number>(10);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [carerFaqData, setCarerFaqData] = useState<FAQItem[]>([]);

  useEffect(() => {
    fetchAllCarersFAQs(0);
  }, []);

  const fetchAllCarersFAQs = async (page: number) => {
    setIsLoading(true);
    try {
      const response = (await getAllProviderFAQs({
        limit: rowsPerPage,
        page: page + 1,
        userType: 4,
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

  const deleteFAQData = async (faqId: string) => {
    try {
      const payload = {
        role: 4,
      };
      const response = (await deleteProviderFAQ(
        faqId,
        payload
      )) as RemoveFAQResponse;
      if (response?.data?.success) {
        toast.success(response?.data?.message);
        fetchAllCarersFAQs(0);
        setIsEditing(true);
      }
    } catch (e) {
      console.log(e);
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
      <CommonCard>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" fontWeight={500}>
            Clinicals FAQ&apos;s
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
            {!isEditing && (
              <CommonButton
                buttonText="Edit"
                sx={{
                  maxWidth: isMobile ? "100%" : "max-content",
                  backgroundColor: theme.palette.common.white,
                  border: `1px solid #00000033`,
                  borderRadius: "10px",
                  height: "45px",
                }}
                buttonTextStyle={{ fontSize: "15px !important" }}
                onClick={() => setIsEditing(true)}
              />
            )}
            {isEditing && (
              <CommonButton
                buttonText="Save"
                sx={{
                  maxWidth: isMobile ? "100%" : "max-content",
                  backgroundColor: theme.pending.main,
                  borderRadius: "10px",
                  height: "45px",
                }}
                buttonTextStyle={{ fontSize: "15px !important" }}
                onClick={() => setIsEditing(false)}
              />
            )}
          </Box>
        </Box>

        <Box mt={3}>
          {carerFaqData && carerFaqData.length > 0 ? (
            carerFaqData?.map((data, index) => (
              <Box key={index} mb={3}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    mb: 2,
                  }}
                >
                  <Typography fontSize={"15px"} fontWeight={400}>
                    {data?.question || "N/A"}
                  </Typography>

                  {isEditing && (
                    <IconButton
                      size="small"
                      sx={{
                        padding: "1px",
                        ml: 1,
                        backgroundColor: theme.pending.background.secondary,
                        borderRadius: "5px",
                        "&:hover": {
                          backgroundColor: theme.pending.background.secondary,
                        },
                        "&.Mui-focusVisible": {
                          backgroundColor: theme.pending.background.secondary,
                        },
                        "&:active": {
                          backgroundColor: theme.pending.background.secondary,
                        },
                      }}
                      onClick={() => deleteFAQData(data._id)}
                    >
                      <CloseIcon sx={{ fontSize: "25px", color: "#666" }} />
                    </IconButton>
                  )}
                </Box>
                <Typography
                  variant="body1"
                  dangerouslySetInnerHTML={{
                    __html: data?.answer || "",
                  }}
                />
                <Divider sx={{ mt: 2 }} />
              </Box>
            ))
          ) : (
            <Typography variant="body2" sx={{ textAlign: "center", py: 2 }}>
              No FAQ found
            </Typography>
          )}
        </Box>
      </CommonCard>
    </Box>
  );
};

export default ClinicalsFAQs;
