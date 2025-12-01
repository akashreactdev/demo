"use client";
import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Box, CircularProgress, Grid2, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
//relative path imports
import KeyValueDetails from "@/components/Cards/KeyValueDetails";
import CommonNoteCard from "@/components/CommonNoteCard";
import CommonCard from "@/components/Cards/Common";
import { useParams } from "next/navigation";
import { singleCareNote } from "@/services/api/usersApi";
import moment from "moment";
import { Gender } from "@/constants/usersData";

interface ParamsProps {
  id: string;
  profile: string;
  noteId: string;
}

interface CarenoteResponse {
  data: {
    success: boolean;
    message: string;
    data: {
      notes: CareNoteData;
    };
  };
}

interface CareNoteData {
  _id: string;
  userId: string;
  clientUserId: string;
  noteId: string;
  dateOfVisit: string;
  carerName: string;
  taskCompleted: string;
  healthObservations: string;
  vitalSigns: string;
  dietHydration: string;
  followUpAction: string;
  updatesToCarerPlan: string;
  familyUpdate: string;
  specialRequest: string;
  carerSignature: string;
  dateOfSignature: string;
  bookingId: string;
  observations: string | null;
  challenges: string | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
  userAdditionalInfo: {
    _id: string;
    firstName: string;
    lastName: string;
    gender: number[];
    role: number;
    dob: string;
    address: string;
    houseNo: string;
    country: string;
  };
}

const StyledBox = styled(Box)(({}) => ({
  border: "1px solid #E2E6EB",
  padding: "10px 20px",
  borderRadius: "10px",
  display: "flex",
  alignItems: "center",
}));
const CareNote = () => {
  const params = useParams() as unknown as ParamsProps;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [careNote, setCarenote] = useState<CareNoteData>();

  const fetchSingleCareNote = async (id: string) => {
    setIsLoading(true);
    try {
      const response = (await singleCareNote(id)) as CarenoteResponse;
      if (response?.data?.success) {
        setIsLoading(false);
        setCarenote(response?.data?.data?.notes);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (params?.noteId) {
      fetchSingleCareNote(params?.noteId);
    }
  }, [params?.noteId]);

  const client_information = useMemo(() => {
    if (!careNote) return [];

    const addressParts = [
      careNote?.userAdditionalInfo?.houseNo,
      careNote?.userAdditionalInfo?.address,
      careNote?.userAdditionalInfo?.country,
    ].filter((part) => part && part.trim() !== "");

    const address = addressParts.length > 0 ? addressParts.join(", ") : "N/A";

    const name = [
      careNote?.userAdditionalInfo?.firstName,
      careNote?.userAdditionalInfo?.lastName,
    ].filter((part) => part && part.trim() !== "");
    const fullName = name.length > 0 ? name.join(" ") : "N/A";
    return [
      {
        label: "Title",
        value:
          careNote?.userAdditionalInfo?.gender?.[0] === 1
            ? "Mr"
            : careNote?.userAdditionalInfo?.gender?.[0] === 2
            ? "Ms / Mrs"
            : "N/A",
      },
      {
        label: "Name",
        value: fullName || "N/A",
      },
      {
        label: "Date of birth",
        value: moment(careNote?.userAdditionalInfo?.dob).format("DD MMMM YYYY"),
      },
      {
        label: "Gender",
        value: Gender[careNote?.userAdditionalInfo?.gender?.[0]] || 1,
      },
      {
        label: "Location",
        value: address || "N/A",
      },
    ];
  }, [careNote]);

  const note_details = useMemo(() => {
    return [
      {
        label: "Carer",
        value: careNote?.carerName || "N/A",
      },
      {
        label: "Date of visit",
        value: moment(careNote?.dateOfVisit).format("DD MMMM YYYY"),
      },
    ];
  }, [careNote]);

  const card_data = useMemo(() => {
    return [
      {
        title: "Tasks Completed",
        value: careNote?.taskCompleted || "",
      },
      {
        title: "Any issues or challenges",
        value: careNote?.challenges || "",
      },
      {
        title: "Vital signs",
        value: careNote?.vitalSigns || "",
      },
      {
        title: "Follow-up actions",
        value: careNote?.followUpAction || "",
      },
      {
        title: "Family or guardian updates",
        value: careNote?.familyUpdate || "",
      },
    ];
  }, [careNote]);

  const card_datas = useMemo(() => {
    return [
      {
        title: "Observations",
        value: careNote?.observations || "",
      },
      {
        title: "Health observations",
        value: careNote?.healthObservations || "",
      },
      {
        title: "Diet and hydration",
        value: careNote?.dietHydration || "",
      },
      {
        title: "Updates to care plan",
        value: careNote?.updatesToCarerPlan || "",
      },
      {
        title: "Special requests or notes from the client",
        value: careNote?.specialRequest || "",
      },
    ];
  }, [careNote]);

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
        <Typography variant="h6" fontWeight={500}>
          {careNote?.carerName} | Care note {careNote?.noteId}
        </Typography>
        <Typography variant="caption" fontWeight={400}>
          You are currently previewing a care note. Please find the details
          below.
        </Typography>
      </CommonCard>

      <Grid2 container spacing={2}>
        <Grid2 size={{ md: 6, lg: 6, xl: 6, sm: 12, xs: 12 }}>
          <Box mt={4}>
            <CommonCard>
              <Typography variant="h6" fontWeight={500}>
                Client information
              </Typography>

              <Box mt={4}>
                <KeyValueDetails items={client_information} />
              </Box>
            </CommonCard>
          </Box>

          {card_data.map((item, index) => (
            <Box mt={4} key={index}>
              <CommonCard>
                <CommonNoteCard
                  title={item.title}
                  rows={1}
                  value={item.value}
                />
              </CommonCard>
            </Box>
          ))}
        </Grid2>
        <Grid2 size={{ md: 6, lg: 6, xl: 6, sm: 12, xs: 12 }}>
          <Box mt={4}>
            <CommonCard>
              <Typography variant="h6" fontWeight={500}>
                Note details
              </Typography>

              <Box mt={4}>
                <KeyValueDetails items={note_details} />
              </Box>
              <Box mt={3}>
                <Typography variant="caption" fontWeight={400}>
                  Carers signature
                </Typography>
                <StyledBox mt={2}>
                  <Image
                    src={"/assets/svg/carers/verifications/signature.svg"}
                    height={40}
                    width={100}
                    alt="signature"
                  />
                </StyledBox>
                <Typography mt={3} variant="caption" fontWeight={400}>
                  Date of signature:{" "}
                  {moment(careNote?.dateOfSignature).format("DD MMMM YYYY")}
                </Typography>
              </Box>
            </CommonCard>
          </Box>

          {card_datas.map((item, index) => (
            <Box mt={4} key={index}>
              <CommonCard>
                <CommonNoteCard
                  title={item.title}
                  rows={1}
                  value={item.value}
                />
              </CommonCard>
            </Box>
          ))}
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default CareNote;
