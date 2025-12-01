"use client";
import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import moment from "moment";
import { useParams, useSearchParams } from "next/navigation";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Grid2 from "@mui/material/Grid2";
import { CircularProgress } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
//relative path imports
import CommonCard from "@/components/Cards/Common";
import KeyValueDetails from "@/components/Cards/KeyValueDetails";
import CommonChip from "@/components/CommonChip";
import { singleAgreementData } from "@/services/api/usersApi";
import { Frequency, ServiceType } from "@/constants/usersData";

interface ParamsProps {
  id: string;
  profile: string;
  agreement: string;
}

export interface ServiceAgreementResponse {
  data: {
    success: boolean;
    message: string;
    data: {
      agreement: Agreement;
    };
  };
}

export interface Agreement {
  _id: string;
  userId: string;
  clientId: string;
  clientDetail: ClientDetail;
  myDetail: MyDetail;
  serviceType: number;
  careSchedule: CareSchedule[];
  careService: string[];
  careHelp: string[];
  driver: boolean;
  prescription: boolean;
  otherRequirement: string;
  startDate: string;
  endDate: string;
  frequency: number;
  hoursPerVisit: number;
  status: number;
  signature: string;
  approval: Approval;
  cancelReason: string | null;
  isArchived: boolean | null;
  isTermAccepted: boolean;
  agreementId: string;
  file: string;
  isCollectFullFee: boolean | null;
  isAmended: boolean;
  isCancel: boolean | null;
  isServiceComplete: boolean;
  serviceCompleteDate: string | null;
  extendDate: string | null;
  terms: [];
  requests: [];
  createdAt: string;
  updatedAt: string;
  careNotes: CareNote[];
  invoices: Invoice[];
  totalNotes: number;
  totalInvoices: number;
  totalInvoiceAmount: number;
  pendingInvoices: number;
  unpaidInvoices: number;
  clientAdditionalInfo: AdditionalInfo;
  userAdditionalInfo: AdditionalInfo;
}

export interface ClientDetail {
  name: string;
  address: string;
  contactNo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MyDetail {
  name: string;
  contactNo: string;
  createdAt: string;
  updatedAt: string;
}

export interface CareSchedule {
  careDays: number;
  timeSlots: number[];
  _id: string;
}

export interface Approval {
  name: string;
  printedName: string;
  isTermAccepted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CareNote {
  _id: string;
  noteId: string;
  carerName: string;
  updatedAt: string;
}

export interface Invoice {
  _id: string;
  userId: string;
  clientId: string;
  agreementId: string;
  clientDetail: ClientDetail;
  invoiceId: string;
  additionalNote: string;
  amount: number;
  totalAmount: number;
  approvedAt: string | null;
  invoiceStatus: number;
  paymentStatus: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface AdditionalInfo {
  _id: string;
  firstName: string;
  lastName: string;
  gender: number[];
  role: number;
  dob: string;
  address: string;
  houseNo: string;
  country: string;
  contactNo?: string | null;
}

const StyledBox = styled(Box)(({}) => ({
  border: "1px solid #E2E6EB",
  padding: "10px 20px",
  borderRadius: "10px",
  display: "flex",
  alignItems: "center",
}));

const ActiveServiceAgreement = () => {
  const theme = useTheme();
  const params = useParams() as unknown as ParamsProps;
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [agreementdata, setAgreementData] = useState<Agreement>();
  const status = searchParams.get("status");
  const [isCheck, setIsCheck] = useState(false);

  const fetchSingleAgreement = async (id: string) => {
    setIsLoading(true);
    try {
      const response = (await singleAgreementData(
        id
      )) as ServiceAgreementResponse;
      if (response?.data?.success) {
        setIsLoading(false);
        setAgreementData(response?.data?.data?.agreement);
        setIsCheck(response?.data?.data?.agreement?.approval?.isTermAccepted);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (params?.agreement) {
      fetchSingleAgreement(params?.agreement);
    }
  }, [params?.agreement]);

  const client_information = useMemo(() => {
    if (!agreementdata) return [];

    return [
      {
        label: "Name",
        value: agreementdata?.clientDetail?.name || "N/A",
      },
      {
        label: "Address",
        value: agreementdata?.clientDetail?.address || "N/A",
      },
    ];
  }, [agreementdata]);

  const carer_information = useMemo(() => {
    if (!agreementdata) return [];
    return [
      {
        label: "Name",
        value: agreementdata?.myDetail?.name || "N/A",
      },
      {
        label: "Contact Number",
        value: agreementdata?.myDetail?.contactNo || "N/A",
      },
    ];
  }, [agreementdata]);

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
          flexWrap={"wrap"}
        >
          <Stack flexDirection={"row"} gap={2}>
            <Image
              src={"/assets/svg/carers/profile/payment_request.svg"}
              alt={"service_agreement"}
              height={80}
              width={80}
            />
            <Box>
              <Typography variant="h6" fontWeight={500} mb={0.5}>
                Service agreement
              </Typography>
              <CommonChip
                title={
                  status === "active"
                    ? "Active"
                    : status === "completed"
                    ? "Completed"
                    : agreementdata?.isServiceComplete === false &&
                      agreementdata?.status === 2
                    ? "Active"
                    : agreementdata?.isServiceComplete === true
                    ? "Completed"
                    : "Pending"
                }
                variant="primary"
                style={{
                  backgroundColor:
                    status === "active" ||
                    (agreementdata?.isServiceComplete === false &&
                      agreementdata?.status === 2)
                      ? theme?.accepted?.background?.primary
                      : status === "completed" ||
                        agreementdata?.isServiceComplete === true
                      ? theme?.inProgress?.background?.primary
                      : theme?.pending?.background?.primary,
                  border: `1px solid ${
                    status === "active" ||
                    (agreementdata?.isServiceComplete === false &&
                      agreementdata?.status === 2)
                      ? theme?.accepted?.main
                      : status === "completed" ||
                        agreementdata?.isServiceComplete === true
                      ? theme?.inProgress?.main
                      : theme?.pending?.main
                  }`,
                  borderRadius: "5px",
                }}
                textStyle={{
                  color:
                    status === "active" ||
                    (agreementdata?.isServiceComplete === false &&
                      agreementdata?.status === 2)
                      ? theme?.accepted?.main
                      : status === "completed" ||
                        agreementdata?.isServiceComplete === true
                      ? theme?.inProgress?.main
                      : theme?.pending?.main,
                  fontSize: "14px",
                }}
              />
            </Box>
          </Stack>
          <Box textAlign={"right"}>
            <Typography variant="body1" fontWeight={500} fontSize={"18px"}>
              ID : #{agreementdata?.agreementId}
            </Typography>
            <Typography variant="body1" fontWeight={400}>
              Created by{" "}
              {agreementdata?.clientAdditionalInfo?.firstName +
                " " +
                agreementdata?.clientAdditionalInfo?.lastName}
            </Typography>
          </Box>
        </Stack>
      </CommonCard>

      <Box>
        <Grid2 container spacing={2}>
          <Grid2 size={{ md: 6, lg: 6, xl: 6, sm: 12, xs: 12 }}>
            <Box mt={4}>
              <CommonCard>
                <Typography variant="h6" fontWeight={500}>
                  Client details
                </Typography>

                <Box mt={2}>
                  <KeyValueDetails items={client_information} />
                </Box>
              </CommonCard>
            </Box>

            <Box mt={4}>
              <CommonCard>
                <Typography variant="h6" fontWeight={500}>
                  Service datails
                </Typography>

                <Box mt={3}>
                  <Typography variant="body1" fontWeight={400}>
                    Service Type
                  </Typography>
                  <Box mt={1}>
                    <CommonChip
                      title={ServiceType[Number(agreementdata?.serviceType)]}
                      variant="primary"
                      style={{
                        backgroundColor: theme?.palette?.common?.white,
                        border: `1px solid ${theme.ShadowAndBorder.border2}`,
                      }}
                    />
                  </Box>
                </Box>

                <Box mt={3}>
                  <Typography variant="body1" fontWeight={400}>
                    Specific assistance needed
                  </Typography>
                  <Box
                    mt={1}
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 2,
                    }}
                  >
                    {agreementdata?.careHelp.map((ele, index) => {
                      return (
                        <CommonChip
                          title={ele}
                          variant="primary"
                          key={index}
                          style={{
                            backgroundColor: theme?.palette?.common?.white,
                            border: `1px solid ${theme.ShadowAndBorder.border2}`,
                          }}
                        />
                      );
                    })}
                  </Box>
                </Box>

                <Box mt={3}>
                  <Typography variant="body1" fontWeight={400}>
                    Driving Required
                  </Typography>
                  <Box mt={1}>
                    <CommonChip
                      title={agreementdata?.driver ? "Yes" : "No"}
                      variant="primary"
                      style={{
                        backgroundColor: theme?.palette?.common?.white,
                        border: `1px solid ${theme.ShadowAndBorder.border2}`,
                      }}
                    />
                  </Box>
                </Box>
                <Box mt={3}>
                  <Typography variant="body1" fontWeight={400}>
                    Prescription collection needed?
                  </Typography>
                  <Box mt={1}>
                    <CommonChip
                      title={agreementdata?.prescription ? "Yes" : "No"}
                      variant="primary"
                      style={{
                        backgroundColor: theme?.palette?.common?.white,
                        border: `1px solid ${theme.ShadowAndBorder.border2}`,
                      }}
                    />
                  </Box>
                </Box>

                <Box mt={3}>
                  <Typography variant="body1" fontWeight={400}>
                    Other requirements
                  </Typography>
                  <StyledBox mt={2}>
                    <Typography variant="body1" fontWeight={400}>
                      {agreementdata?.otherRequirement || "N/A"}
                    </Typography>
                  </StyledBox>
                </Box>
              </CommonCard>
            </Box>

            <Box mt={4}>
              <CommonCard>
                <Typography variant="h6" fontWeight={500}>
                  Service Type
                </Typography>
                <StyledBox mt={2} padding={"20px !important"}>
                  <Image
                    src={"/assets/svg/carers/profile/service_type.svg"}
                    height={24}
                    width={24}
                    alt="signature"
                  />
                  <Typography variant="body1" fontWeight={400} ml={2}>
                    {ServiceType[Number(agreementdata?.serviceType)]}
                  </Typography>
                </StyledBox>
              </CommonCard>
            </Box>

            <Box mt={4}>
              <CommonCard>
                <Typography variant="h6" fontWeight={500}>
                  Schedule and duration
                </Typography>
                <Typography variant="h6" fontWeight={400} mt={2}>
                  By signing, you confirm that the details above have been
                  agreed upon with your carer and that you approve the terms of
                  this service agreement.
                </Typography>
              </CommonCard>
            </Box>
          </Grid2>
          <Grid2 size={{ md: 6, lg: 6, xl: 6, sm: 12, xs: 12 }}>
            <Box mt={4}>
              <CommonCard>
                <Typography variant="h6" fontWeight={500}>
                  Carer information
                </Typography>

                <Box mt={2}>
                  <KeyValueDetails items={carer_information} />
                </Box>
              </CommonCard>
            </Box>

            <Box mt={3}>
              <CommonCard>
                <Typography variant="h6" fontWeight={500}>
                  Schedule and duration
                </Typography>

                <Box mt={3}>
                  <Typography variant="body1" fontWeight={400}>
                    Start date
                  </Typography>
                  <StyledBox mt={1}>
                    <Typography variant="body1" fontWeight={400}>
                      {agreementdata?.startDate
                        ? moment(agreementdata?.startDate).format(
                            "DD MMMM YYYY"
                          )
                        : "N/A"}
                    </Typography>
                  </StyledBox>
                </Box>

                <Box mt={3}>
                  <Typography variant="body1" fontWeight={400}>
                    End date (if applicable)
                  </Typography>
                  <StyledBox mt={1}>
                    <Typography variant="body1" fontWeight={400}>
                      {agreementdata?.startDate
                        ? moment(agreementdata?.endDate).format("DD MMMM YYYY")
                        : "N/A"}
                    </Typography>
                  </StyledBox>
                </Box>
                <Box mt={3}>
                  <Typography variant="body1" fontWeight={400}>
                    Frequency of service
                  </Typography>
                  <StyledBox mt={1}>
                    <Typography variant="body1" fontWeight={400}>
                      {Frequency[Number(agreementdata?.frequency)]}
                    </Typography>
                  </StyledBox>
                </Box>
                <Box mt={3}>
                  <Typography>Hours per visit</Typography>
                  <StyledBox mt={1}>
                    <Typography variant="body1" fontWeight={400}>
                      {agreementdata?.hoursPerVisit} Hours
                    </Typography>
                  </StyledBox>
                </Box>
              </CommonCard>
            </Box>

            <Box mt={4}>
              <CommonCard>
                <Typography variant="h6" fontWeight={500}>
                  Approval
                </Typography>

                <Box mt={2}>
                  <Typography variant="body1" fontWeight={400}>
                    Type your name
                  </Typography>
                  <StyledBox mt={2}>
                    <Typography
                      variant="body1"
                      fontFamily={"cursive"}
                      fontStyle={"italic"}
                      letterSpacing={1}
                      fontSize={"22px"}
                      fontWeight={400}
                    >
                      {agreementdata?.approval?.name || "-"}
                    </Typography>
                  </StyledBox>
                </Box>

                <Box mt={2}>
                  <Typography variant="body1" fontWeight={400}>
                    Print name
                  </Typography>
                  <StyledBox mt={2}>
                    <Typography variant="body1" fontWeight={400}>
                      {agreementdata?.approval?.printedName || "-"}
                    </Typography>
                  </StyledBox>
                </Box>

                <Stack flexDirection={"row"} gap={2} mt={3}>
                  {!isCheck ? (
                    <Box
                      sx={{
                        height: "30px",
                        width: "30px",
                        border: "1px solid black",
                        borderRadius: "5px",
                        flexShrink: 0,
                      }}
                    />
                  ) : (
                    <Box
                      sx={{
                        height: "30px",
                        width: "30px",
                        border: `1px solid ${theme.inProgress.main}`,
                        background: theme.pending.secondary,
                        borderRadius: "5px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <CheckIcon
                        sx={{ color: theme.inProgress.main, fontSize: 24 }}
                      />
                    </Box>
                  )}
                  <Typography
                    variant="body1"
                    sx={{
                      lineHeight: "20px",
                      textAlign: "justify",
                    }}
                  >
                    I agree to electronically sign this agreement document,
                    understand this a legal representation of my signature, and
                    agree to the{" "}
                    <Box
                      component="span"
                      sx={{ textDecoration: "underline", fontWeight: 500 }}
                    >
                      electronic signature terms
                    </Box>
                    .
                  </Typography>
                </Stack>

                <Box mt={2}>
                  <Typography variant="body1" fontWeight={400}>
                    Carers signature
                  </Typography>
                  <StyledBox mt={1}>
                    {agreementdata?.signature &&
                    agreementdata?.signature.match(
                      /\.(jpeg|jpg|png|gif|svg)$/i
                    ) ? (
                      <Image
                        src={
                          agreementdata?.signature != null
                            ? `${process.env.NEXT_PUBLIC_ASSETS_URL}/${agreementdata?.signature}`
                            : "/assets/svg/carers/verifications/signature.svg"
                        }
                        height={30}
                        width={100}
                        alt="signature"
                      />
                    ) : (
                      <Typography
                        variant="body1"
                        fontFamily={"cursive"}
                        fontStyle={"italic"}
                        letterSpacing={1}
                        fontSize={"22px"}
                        fontWeight={400}
                      >
                        {agreementdata?.signature || "-"}
                      </Typography>
                    )}
                  </StyledBox>
                  <Typography mt={2} variant="caption" fontWeight={400}>
                    Date of signature:{" "}
                    {moment(agreementdata?.createdAt).format("DD MMMM YYYY")}
                  </Typography>
                </Box>
              </CommonCard>
            </Box>
          </Grid2>
        </Grid2>
      </Box>
    </Box>
  );
};

export default ActiveServiceAgreement;
