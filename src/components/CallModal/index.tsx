"use client";
import React, { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Call from "@/components/Call";

interface CallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRemove?: () => void;
  channelName: string;
}

const CallModal: React.FC<CallModalProps> = ({
  isOpen,
  onClose,
  channelName,
}) => {
  const [rtcToken, setRtcToken] = useState<string>("");
  const [uid, setUid] = useState<number>();
  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    const getRtcToken = async () => {
      try {
        const token = localStorage.getItem("rtcToken");
        const id = localStorage.getItem("uid");
        setUid(id !== null ? Number(id) : undefined);
        setRtcToken(token || "");
        setIsReady(true);
      } catch (error) {
        console.error("Error getting RTC token from localStorage:", error);
        setRtcToken("");
        setIsReady(true);
      }
    };
    getRtcToken();
  }, [channelName]);
  if (!isReady) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Typography>Loading...</Typography>
      </Box>
    );
  }
  if (!rtcToken || uid === undefined) {
    return (
      <></>
    );
  }

  const handleClose = (event: object, reason: string) => {
    if (reason === "backdropClick" || reason === "escapeKeyDown") {
      return;
    }
    onClose();
  };

  const AssessmentUserDetails = JSON.parse(
    localStorage.getItem("AssessmentUserData") || "{}"
  );
  const participantName =
    (AssessmentUserDetails?.firstName || "") +
    " " +
    (AssessmentUserDetails?.lastName || "");

  return (
    <Dialog
      fullWidth
      maxWidth="xl"
      open={isOpen}
      onClose={handleClose}
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: 3,
          p: 0,
        },
      }}
    >
      <DialogContent sx={{ p: 2 }}>
        <Box>
          <Call
            appId={process.env.NEXT_PUBLIC_AGORA_APP_ID!}
            channelName={channelName}
            rtcToken={rtcToken}
            uid={uid}
            onClose={onClose}
            participantName={participantName}
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default CallModal;
