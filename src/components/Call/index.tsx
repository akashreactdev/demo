"use client";
import { useState, useEffect } from "react";
import type { IAgoraRTCClient } from "agora-rtc-react";
import AgoraRTC, {
  AgoraRTCProvider,
  LocalVideoTrack,
  RemoteUser,
  useJoin,
  useLocalCameraTrack,
  useLocalMicrophoneTrack,
  usePublish,
  useRTCClient,
  useRemoteAudioTracks,
  useRemoteUsers,
} from "agora-rtc-react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Image from "next/image";
import Avatar from "@mui/material/Avatar";

const MicIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
    <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
  </svg>
);

const MicOffIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 11h-1.7c0 .74-.16 1.43-.43 2.05l1.23 1.23c.56-.98.9-2.09.9-3.28zm-4.02.17c0-.06.02-.11.02-.17V5c0-1.66-1.34-3-3-3S9 3.34 9 5v.18l5.98 5.99zM4.27 3L3 4.27l6.01 6.01V11c0 1.66 1.33 3 2.99 3 .22 0 .44-.03.65-.08l1.66 1.66c-.71.33-1.5.52-2.31.52-2.76 0-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c.57-.08 1.12-.23 1.64-.46l3.09 3.09L19 19.73 4.27 3z" />
  </svg>
);

const VideocamIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
  </svg>
);

const VideocamOffIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M21 6.5l-4 4V7c0-.55-.45-1-1-1H9.82L21 17.18V6.5zM3.27 2L2 3.27 4.73 6H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.21 0 .39-.08.54-.18L19.73 21 21 19.73 3.27 2z" />
  </svg>
);

function Call(props: {
  appId: string;
  channelName: string;
  rtcToken: string;
  uid: number;
  onClose: () => void;
  participantName: string;
}) {
  const client = useRTCClient(
    AgoraRTC.createClient({ codec: "vp8", mode: "rtc" })
  );
  return (
    <AgoraRTCProvider client={client}>
      <Videos
        channelName={props.channelName}
        AppID={props.appId}
        rtcToken={props.rtcToken}
        uid={props.uid}
        client={client}
        onClose={props.onClose}
        participantName={props.participantName}
      />
    </AgoraRTCProvider>
  );
}

function Videos(props: {
  channelName: string;
  AppID: string;
  rtcToken: string;
  uid: number;
  client?: IAgoraRTCClient;
  onClose: () => void;
  participantName: string;
}) {
  const { AppID, channelName, uid, rtcToken, participantName } = props;
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [callStartTime, setCallStartTime] = useState<Date | null>(null);
  const [callDuration, setCallDuration] = useState("00:00");
  const [isCallEnded, setIsCallEnded] = useState(false);

  const { isLoading: isLoadingMic, localMicrophoneTrack } =
    useLocalMicrophoneTrack(micOn);
  const { isLoading: isLoadingCam, localCameraTrack } =
    useLocalCameraTrack(cameraOn);
  const remoteUsers = useRemoteUsers();
  const { audioTracks } = useRemoteAudioTracks(remoteUsers);

  const tracksToPublish = [];
  if (localMicrophoneTrack && micOn) tracksToPublish.push(localMicrophoneTrack);
  if (localCameraTrack && cameraOn) tracksToPublish.push(localCameraTrack);
  usePublish(tracksToPublish);
  const { isConnected } = useJoin({
    appid: AppID,
    channel: channelName,
    token: rtcToken,
    uid: uid,
  });

  useEffect(() => {
    if (remoteUsers.length > 0 && !callStartTime) {
      setCallStartTime(new Date());
    }
  }, [remoteUsers.length, callStartTime]);

  useEffect(() => {
    if (isCallEnded || callStartTime) return;
    const timeoutId = setTimeout(() => {
      if (remoteUsers.length === 0 && !isCallEnded && !callStartTime) {
        console.log("No remote user joined within 45 seconds, ending call");
        onClickEndCall();
      }
    }, 45000);

    return () => clearTimeout(timeoutId);
  }, [remoteUsers.length, callStartTime, isCallEnded]);

  useEffect(() => {
    if (
      callStartTime &&
      remoteUsers.length === 0 &&
      isConnected &&
      !isCallEnded
    ) {
      const timer = setTimeout(() => {
        if (remoteUsers.length === 0 && !isCallEnded) {
          onClickEndCall();
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [remoteUsers.length, callStartTime, isConnected, isCallEnded]);


  useEffect(() => {
    if (!callStartTime) return;

    const timer = setInterval(() => {
      const now = new Date();
      const diff = Math.floor((now.getTime() - callStartTime.getTime()) / 1000);
      const minutes = Math.floor(diff / 60);
      const seconds = diff % 60;
      setCallDuration(
        `${minutes.toString().padStart(2, "0")}:${seconds
          .toString()
          .padStart(2, "0")}`
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [callStartTime]);

  useEffect(() => {
    audioTracks.forEach((track) => {
      if (track) {
        track.play();
      }
    });
  }, [audioTracks]);

  const getAvatarColor = (name: string) => {
    const colors = [
      "#FF6B6B",
      "#4ECDC4",
      "#45B7D1",
      "#96CEB4",
      "#FFEAA7",
      "#DDA0DD",
      "#98D8C8",
      "#F7DC6F",
    ];
    const index = name.length % colors.length;
    return colors[index];
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const deviceLoading = isLoadingMic || isLoadingCam;
  if (deviceLoading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="70vh"
      >
        <CircularProgress />
        <Typography mt={2}>Loading devices...</Typography>
      </Box>
    );
  }

  const toggleMic = async () => {
    if (localMicrophoneTrack) {
      await localMicrophoneTrack.setEnabled(!micOn);
    }
    setMicOn(!micOn);
  };

  const toggleCamera = async () => {
    if (localCameraTrack) {
      await localCameraTrack.setEnabled(!cameraOn);
    }
    setCameraOn(!cameraOn);
  };

  const onClickEndCall = () => {
    setIsCallEnded(true);
    localStorage.removeItem("rtcToken");
    localStorage.removeItem("uid");
    props.onClose();
  };

  return (
    <Box
      sx={{
        position: "relative",
        height: "85vh",
        display: "flex",
        flexDirection: "column",
        borderRadius: "16px",
      }}
    >
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          padding: "16px",
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: "100%",
            border: "3px solid #F9D835",
            borderRadius: "24px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {remoteUsers.length > 0 ? (
            <RemoteUser
              user={remoteUsers[0]}
              playVideo={true}
              playAudio={true}
              style={{ width: "100%", height: "100%" }}
            />
          ) : (
            <Box
              sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Avatar
                  sx={{
                    width: { xs: 120, sm: 150, md: 180 },
                    height: { xs: 120, sm: 150, md: 180 },
                    backgroundColor: getAvatarColor(participantName),
                    fontSize: { xs: "2.5rem", sm: "3rem", md: "3rem" },
                    fontWeight: "bold",
                    border: "4px solid #F9D835",
                    boxShadow: "0 0px 32px #F9D835",
                  }}
                >
                  {getInitials(participantName)}
                </Avatar>
                <Typography
                  variant="body1"
                  sx={{
                    mt: 3,
                    backgroundColor: "#ECF2FB",
                    padding: "8px 15px 8px 15px",
                    border: "1px solid #518ADD",
                    borderRadius: "5px",
                    fontSize: "24px",
                    position: "absolute",
                    top: "10px",
                  }}
                >
                  {participantName}
                </Typography>
              </Box>
            </Box>
          )}

          {localCameraTrack && remoteUsers.length > 0 && (
            <Box
              sx={{
                position: "absolute",
                bottom: 16,
                right: 16,
                width: "200px",
                height: "150px",
                borderRadius: "12px",
                overflow: "hidden",
                border: "2px solid #FFFFFF",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: !cameraOn ? "#FFFFFF" : "",
              }}
            >
              {cameraOn ? (
                <LocalVideoTrack
                  track={localCameraTrack}
                  play={true}
                  style={{ width: "100%", height: "100%" }}
                />
              ) : (
                <Box
                  sx={{
                    backgroundColor: "#FFFFF",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <Image
                    src={"/assets/svg/assessment/Camera_Off.svg"}
                    alt={"camera off"}
                    height={64}
                    width={64}
                  />
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: "500",
                      textAlign: "center",
                    }}
                  >
                    Your camera is <br /> turned off
                  </Typography>
                </Box>
              )}
            </Box>
          )}

          {/* {remoteUsers.length > 0 && (
            <Box
              sx={{
                position: "absolute",
                bottom: localCameraTrack && cameraOn ? 180 : 16,
                right: 16,
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                color: "white",
                padding: "8px 12px",
                borderRadius: "16px",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              {participantName}
              {!remoteUsers[0].hasAudio && " (Muted)"}
              {!remoteUsers[0].hasVideo && " (Camera Off)"}
            </Box>
          )} */}
        </Box>
      </Box>

      <Box
        sx={{
          bottom: 20,
          zIndex: 1000,
          display: "flex",
          justifyContent: remoteUsers.length > 0 ? "space-between" : "center",
          alignItems: "center",
          paddingInline: "20px",
          paddingBlock: "8px",
        }}
      >
        {remoteUsers.length > 0 && (
          <Box
            sx={{
              backgroundColor: "#ECF2FB",
              padding: "8px 15px 8px 15px",
              border: "1px solid #518ADD",
              borderRadius: "5px",
              fontSize: "24px",
            }}
          >
            {callDuration}
          </Box>
        )}
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={"20px"}
        >
          <IconButton
            onClick={toggleCamera}
            sx={{
              width: 50,
              height: 50,
              backgroundColor: cameraOn ? "#ECF2FB" : "#518ADD",
              color: cameraOn ? "#518ADD" : "#FFFFFF",
              border: "2px solid #518ADD",
              "&:hover": {
                backgroundColor: cameraOn ? "#E3EFFA" : "#4169E1",
              },
            }}
          >
            {cameraOn ? <VideocamIcon /> : <VideocamOffIcon />}
          </IconButton>

          <IconButton
            onClick={onClickEndCall}
            sx={{
              width: 60,
              height: 60,
              color: "#9C3C3C",
              backgroundColor: "#F4A6A6",
              border: "2px solid #9C3C3C",
              "&:hover": {
                backgroundColor: "#F19A9A",
              },
            }}
          >
            <Image
              src={"/assets/svg/assessment/End_Call.svg"}
              alt={"end_call"}
              height={40}
              width={40}
            />
          </IconButton>

          <IconButton
            onClick={toggleMic}
            sx={{
              width: 50,
              height: 50,
              backgroundColor: micOn ? "#ECF2FB" : "#518ADD",
              color: micOn ? "#518ADD" : "#FFFFFF",
              border: "2px solid #518ADD",
              "&:hover": {
                backgroundColor: micOn ? "#E3EFFA" : "#4169E1",
              },
            }}
          >
            {micOn ? <MicIcon /> : <MicOffIcon />}
          </IconButton>
        </Stack>
        {remoteUsers.length > 0 && (
          <Typography
            variant="subtitle1"
            sx={{
              backgroundColor: "#F7F6F9",
              padding: "8px 15px 8px 15px",
              border: "1px solid #E3E2E3",
              borderRadius: "5px",
              fontSize: "24px",
            }}
          >
            {participantName}
          </Typography>
        )}
      </Box>
      {!micOn && (
        <Box
          sx={{
            position: "absolute",
            top: "0px",
            left: 0,
            right: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography
            variant="body1"
            sx={{
              backgroundColor: "#FFFFFF",
              padding: "8px 15px 8px 15px",
              width: "max-content",
              border: "2px solid #F9D835",
              borderRadius: "5px",
              fontWeight: "500",
            }}
          >
            You are currently muted!
          </Typography>
        </Box>
      )}
    </Box>
  );
}

export default Call;
