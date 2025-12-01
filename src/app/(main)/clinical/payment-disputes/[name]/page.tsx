"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { CircularProgress, useMediaQuery } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Grid2 from "@mui/material/Grid2";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
// relative path imports
import CommonCard from "@/components/Cards/Common";
import VisitLogsCard from "@/components/Cards/VisitLogsCard";
import KeyValueDetails from "@/components/Cards/KeyValueDetails";
import { useRouterLoading } from "@/hooks/useRouterLoading";
import RequestCard from "@/components/Cards/Request";
import {
  DisputeResponse,
  PassportItem,
  singleDisputeData,
} from "@/types/paymentDispute";
import { useParams } from "next/navigation";
import { getSinglePaymentDispute } from "@/services/api/carerApi";
import moment from "moment";

const AgreementStatus = styled(Box)(({ theme }) => ({
  border: `1px solid ${theme.pending.secondary}`,
  borderRadius: "10px",
  padding: "15px",
  cursor: "pointer",
}));

interface ParamsProps {
  name: string;
}

const ProfileRequest = () => {
  const { navigateWithLoading } = useRouterLoading();
  const theme = useTheme();
  const params = useParams() as unknown as ParamsProps;
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [passportListData, setPassportListData] = useState<PassportItem | null>(
    null
  );
  const [singlePassportData, setSinglePassportData] =
    useState<singleDisputeData>();

  useEffect(() => {
    setIsLoading(false);
    const CarerData = localStorage.getItem("selectClinicalPaymentDispute");
    if (CarerData) {
      try {
        const parsedData = JSON.parse(CarerData);
        if (parsedData) {
          setPassportListData(parsedData);
        }
      } catch (error) {
        console.error("Invalid JSON:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (params?.name && passportListData) {
      fetchSinglePassportDispute(params?.name, passportListData?.userId?._id);
    }
  }, [params?.name, passportListData]);

  const fetchSinglePassportDispute = async (id: string, userId: string) => {
    setIsLoading(true);
    try {
      const response = (await getSinglePaymentDispute(
        { userId: userId },
        id
      )) as DisputeResponse;
      if (response?.data?.success) {
        setIsLoading(false);
        setSinglePassportData(response?.data?.data);
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
      <Box>
        <CommonCard>
          <Box>
            <Typography variant="h6" fontWeight={500}>
              Service agreement
            </Typography>
            <Typography variant="caption" fontWeight={400}>
              This is the service agreement under which{" "}
              {singlePassportData?.dispute?.clientId?.firstName}{" "}
              {singlePassportData?.dispute?.clientId?.lastName} is requesting
              payment.
            </Typography>
          </Box>

          <Box mt={3}>
            <AgreementStatus
              onClick={() =>
                navigateWithLoading(
                  `/clinical/payment-disputes/${params?.name}/service-agreement/${singlePassportData?.dispute?.agreementId?._id}`
                )
              }
            >
              <Stack
                direction={"row"}
                alignItems={"center"}
                justifyContent={"space-between"}
              >
                <Stack
                  direction={"row"}
                  alignItems={"center"}
                  spacing={isMobile ? 1 : 4}
                >
                  {!isMobile && (
                    <Image
                      src={"/assets/svg/carers/profile/payment_request.svg"}
                      alt="payment-request"
                      height={50}
                      width={50}
                    />
                  )}
                  <Box>
                    <Typography variant="body1" fontWeight={500}>
                      Agreement #
                      {singlePassportData?.dispute?.agreementId?.agreementId}
                    </Typography>
                    <Typography
                      component={"p"}
                      variant="caption"
                      fontWeight={400}
                    >
                      Client:{" "}
                      {singlePassportData?.dispute?.agreementId?.clientDetail
                        ?.name || "N/A"}
                    </Typography>
                  </Box>
                  <Box sx={{ ...(isMobile && { mt: 1 }) }}>
                    <Typography variant="caption" fontWeight={400}>
                      Date approved
                    </Typography>
                    <Typography
                      component={"p"}
                      variant="caption"
                      fontWeight={500}
                    >
                      {singlePassportData?.dispute?.agreementId
                        ?.userSignatureDate
                        ? moment(
                            singlePassportData?.dispute?.agreementId
                              ?.userSignatureDate
                          ).format("Do MMMM YYYY")
                        : "N/A"}
                    </Typography>
                  </Box>
                  <Box sx={{ ...(isMobile && { mt: 1 }) }}>
                    <Typography variant="caption" fontWeight={400}>
                      Date cancelled
                    </Typography>
                    <Typography
                      component={"p"}
                      variant="caption"
                      fontWeight={500}
                    >
                      {(() => {
                        const extendRequest =
                          singlePassportData?.dispute?.agreementId?.requests?.find(
                            (req) => req.requestType === 1
                          );

                        return extendRequest?.updatedAt
                          ? moment(extendRequest.updatedAt).format(
                              "Do MMMM YYYY"
                            )
                          : "N/A";
                      })()}
                    </Typography>
                  </Box>
                </Stack>
                <ChevronRightIcon />
              </Stack>
            </AgreementStatus>
          </Box>
        </CommonCard>
        <Box mt={4}>
          <Box mt={4}>
            <Grid2 container spacing={2}>
              {/* Invoice Information */}
              <Grid2 size={{ md: 6, lg: 6, xl: 6, sm: 12, xs: 12 }}>
                <CommonCard>
                  <Typography variant="h6" fontWeight={500}>
                    Invoice information
                  </Typography>
                  <Typography
                    variant="caption"
                    component={"p"}
                    fontWeight={400}
                  >
                    This provides an overview of the invoice received by the
                    client.
                  </Typography>

                  <Box mt={3}>
                    <KeyValueDetails
                      items={[
                        {
                          label: "Client name",
                          value:
                            singlePassportData?.dispute?.invoiceId?.clientDetail
                              ?.name || "-",
                        },
                        {
                          label: "Invoice number",
                          value:
                            `#${singlePassportData?.dispute?.invoiceId?.invoiceId}` ||
                            "-",
                        },
                        {
                          label: "Date created",
                          value: singlePassportData?.dispute?.invoiceId
                            ?.createdAt
                            ? moment(
                                singlePassportData?.dispute?.invoiceId
                                  ?.createdAt
                              ).format("Do MMMM YYYY")
                            : "N/A",
                        },
                        {
                          label: "Total",
                          value: `£${singlePassportData?.dispute?.invoiceId?.totalAmount.toFixed(
                            2
                          )}`,
                        },
                      ]}
                    />
                  </Box>
                </CommonCard>
                {/* Notes */}
                <Box mt={3}>
                  <CommonCard>
                    <Typography variant="h6" fontWeight={500}>
                      Carer-logged notes
                    </Typography>
                    <Stack direction={"column"} gap={2} mt={2}>
                      {singlePassportData?.notes?.length ? (
                        singlePassportData?.notes.map((note, index) => (
                          <RequestCard
                            key={index}
                            path="/assets/svg/carers/verifications/carers_note.svg"
                            title={`Care note: ${note.noteId}`}
                            subtitle={`Carer: ${note.carerName}`}
                            onClickRightButton={() =>
                              navigateWithLoading(
                                `/clinical/payment-disputes/${params?.name}/care-notes/${note._id}`
                              )
                            }
                          />
                        ))
                      ) : (
                        <Box textAlign={"center"}>
                          <Typography variant="caption">
                            No notes found
                          </Typography>
                        </Box>
                      )}
                    </Stack>
                  </CommonCard>
                </Box>
              </Grid2>

              {/* Visit Logs */}
              <Grid2 size={{ md: 6, lg: 6, xl: 6, sm: 12, xs: 12 }}>
                <CommonCard>
                  <Typography variant="h6" fontWeight={500}>
                    Confirmed visit logs
                  </Typography>
                  <Stack direction={"column"} gap={2} mt={2}>
                    {singlePassportData?.visitLogs?.length ? (
                      singlePassportData?.visitLogs.map((visit) => (
                        <VisitLogsCard
                          key={visit._id}
                          title={`Visit #${visit.visitNumber}`}
                          date={
                            visit.visitDate
                              ? moment(visit.visitDate).format("Do MMMM YYYY")
                              : "N/A"
                          }
                          time={visit.visitTime}
                          onClick={() =>
                            navigateWithLoading(
                              `/clinical/payment-disputes/${params?.name}/visit-log/${visit._id}`
                            )
                          }
                        />
                      ))
                    ) : (
                      <Box textAlign={"center"}>
                        <Typography variant="caption">
                          No visit logs found
                        </Typography>
                      </Box>
                    )}
                  </Stack>
                </CommonCard>
              </Grid2>
            </Grid2>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ProfileRequest;
