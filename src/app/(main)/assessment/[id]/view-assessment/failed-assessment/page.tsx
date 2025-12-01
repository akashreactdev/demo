"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import moment from "moment";
import Box from "@mui/material/Box";
import Grid2 from "@mui/material/Grid2";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CommonCard from "@/components/Cards/Common";
import KeyValueDetails from "@/components/Cards/KeyValueDetails";
import CommonNoteCard from "@/components/CommonNoteCard";
import CommonButton from "@/components/CommonButton";
import { ApproveReject } from "@/services/api/assessmentApi";
import { useRouterLoading } from "@/hooks/useRouterLoading";

interface ParamsProps {
  id: string;
}

interface Answer {
  _id: string;
  question: string;
  answer: string;
}
interface Assessment {
  _id: string;
  testId: string;
  userId: string;
  answers: Answer[];
  status: string | null;
  isApproved: boolean | string | null;
  score: number | null;
  patientReport: string | null;
  infectionControl: string | null;
  feedBackMessage: string | null;
  taskCompletion: string | null;
  createdAt: string;
}
interface AssessmentUserData {
  firstName: string | null;
  lastName: string | null;
  email: string;
  role: number | null;
  createdAt: string | null;
}
interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  role: number;
  createdAt: string;
}
interface AssessmentData {
  assessment: Assessment[];
  userData: UserData;
}
interface ApproveRejectAssessmentResponse {
  data: {
    success: boolean;
    message: string;
    data: AssessmentData;
  };
}

const FailedAssessment: React.FC = () => {
  const params = useParams() as unknown as ParamsProps;
const { navigateWithLoading } = useRouterLoading();
  const [selectedAssessmentData, setSelectedAssessmentData] =
    useState<Assessment | null>(null);
  const [userData, setUserData] = useState<AssessmentUserData | null>(null);
  const [feedback, setFeedback] = useState<string>("");

  useEffect(() => {
    const storedData = localStorage.getItem("AssessmentUserData");
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setUserData(parsedData);
      } catch (error) {
        console.error("Invalid JSON in localStorage:", error);
      }
    }

    const selectedAssessmentData = localStorage.getItem("SelectedAssessment");
    if (selectedAssessmentData) {
      try {
        const parsedData = JSON.parse(selectedAssessmentData);
        setSelectedAssessmentData(parsedData);
      } catch (error) {
        console.error("Invalid JSON in localStorage:", error);
      }
    }
  }, []);

  const ApproveRejectAssessment = async (feedbackMessage: string) => {
    const payload = {
      feedBackMessage: feedbackMessage,
    };
    try {
      const response = (await ApproveReject(
        payload,
        selectedAssessmentData?._id ?? null
      )) as ApproveRejectAssessmentResponse;
      if (response?.data?.success) {
        navigateWithLoading(`/assessment/${params?.id}/view-assessment`);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const addFeedback = () => {
    ApproveRejectAssessment(feedback);
  };

  const account_informations = useMemo(() => {
    return [
      {
        label: "Title",
        value: "N/A",
      },
      {
        label: "Name",
        value: userData?.firstName + " " + userData?.lastName || "N/A",
      },
      {
        label: "Date",
        value: moment(userData?.createdAt).format("Do MMMM YYYY") || "N/A",
      },
      {
        label: "Email",
        value: userData?.email || "N/A",
      },
    ];
  }, [userData]);

  return (
    <Box>
      <CommonCard>
        <Typography variant="h6" fontWeight={500}>
          Failed assessment feedback
        </Typography>
      </CommonCard>

      <Grid2 container spacing={2}>
        <Grid2 size={{ md: 6, lg: 6, xl: 6, xs: 12, sm: 12 }}>
          <CommonCard sx={{ marginTop: "20px", height: "100%" }}>
            <Typography fontSize={"18px"} fontWeight={500}>
              User information
            </Typography>
            <Box sx={{ marginTop: "40px" }}>
              <KeyValueDetails items={account_informations} />
            </Box>
          </CommonCard>
        </Grid2>
        <Grid2 size={{ md: 6, sm: 12, xs: 12, lg: 6, xl: 6 }}>
          <CommonCard sx={{ marginTop: "20px", height: "100%" }}>
            <Typography variant="h6" fontWeight={500}>
              Feedback
            </Typography>
            <Box mt={3}>
              <CommonNoteCard
                title="Feedback message"
                rows={3}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />
            </Box>
          </CommonCard>
        </Grid2>
      </Grid2>
      <Stack mt={4} mr={2} flexDirection={"row"} justifyContent={"end"}>
        <Box mt={2} width={"max-content"}>
          <CommonButton buttonText="Add feedback" onClick={addFeedback} />
        </Box>
      </Stack>
    </Box>
  );
};

export default FailedAssessment;
