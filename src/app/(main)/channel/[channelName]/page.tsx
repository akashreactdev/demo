"use client";
import React, { use, useEffect, useState } from "react";
// import Call from "@/components/Call";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
interface ChannelPageProps {
  params: Promise<{ channelName: string }>;
}
const Channel: React.FC<ChannelPageProps> = ({ params }) => {
  const resolvedParams = use(params);
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
  }, [resolvedParams.channelName]);
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
      <Box p={4}>
        <Alert severity="error">
          <Typography variant="h6">Unable to join call</Typography>
          <Typography>
            Missing RTC token or UID. Please go back and request a new call.
          </Typography>
          <Box mt={2}>
            <Typography variant="body2">
              Debug Info:
              <br />
              Token: {rtcToken ? ":white_check_mark: Available" : ":x: Missing"}
              <br />
              UID:{" "}
              {uid !== undefined ? `:white_check_mark: ${uid}` : ":x: Missing"}
              <br />
              Channel: {resolvedParams.channelName}
            </Typography>
          </Box>
        </Alert>
      </Box>
    );
  }
  return (
    <Box>
      {/* <Call
        appId={process.env.NEXT_PUBLIC_AGORA_APP_ID!}
        channelName={resolvedParams.channelName}
        rtcToken={rtcToken}
        uid={uid}
      /> */}
    </Box>
  );
};
export default Channel;
