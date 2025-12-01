"use client";

import AgoraRTC, {
  AgoraRTCProvider,
  RemoteUser,
  useJoin,
  useLocalCameraTrack,
  useLocalMicrophoneTrack,
  usePublish,
  useRTCClient,
  useRemoteAudioTracks,
  useRemoteUsers,
} from "agora-rtc-react";
import Link from "next/link";
import { useEffect, useRef } from "react";

function Call(props: {
  appId: string;
  channelName: string;
  uid: number;
  token: string;
}) {
  const { appId, channelName, uid, token } = props;

  const client = useRTCClient(
    AgoraRTC.createClient({ codec: "vp8", mode: "rtc" })
  );

  client.on("connection-state-change", (curState, revState, reason) => {
    console.log("Connection state changed:", curState, reason);
  });

  return (
    <AgoraRTCProvider client={client}>
      <Videos channelName={channelName} AppID={appId} token={token} uid={uid} />
      <div className="fixed z-10 bottom-0 left-0 right-0 flex justify-center pb-4">
        <Link
          className="px-5 py-3 text-base font-medium text-center text-white bg-red-400 rounded-lg hover:bg-red-500 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900 w-40"
          href="/"
        >
          End Call
        </Link>
      </div>
    </AgoraRTCProvider>
  );
}

function Videos(props: {
  channelName: string;
  AppID: string;
  token: string | null;
  uid: number;
}) {
  const { AppID, channelName, token, uid } = props;
  const { isLoading: isLoadingMic, localMicrophoneTrack } =
    useLocalMicrophoneTrack();
  const { isLoading: isLoadingCam, localCameraTrack } = useLocalCameraTrack();
  const remoteUsers = useRemoteUsers();
  const { audioTracks } = useRemoteAudioTracks(remoteUsers);


  usePublish([localMicrophoneTrack, localCameraTrack]);

  useJoin({
    appid: AppID,
    channel: channelName,
    token: token,
    uid: uid,
  });

  const localVideoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (localCameraTrack && localVideoRef.current) {
      localCameraTrack.play(localVideoRef.current);
    }
  }, [localCameraTrack]);

  audioTracks.map((track) => track.play());
  const deviceLoading = isLoadingMic || isLoadingCam;

  if (deviceLoading)
    return (
      <div className="flex flex-col items-center pt-40">Loading devices...</div>
    );

  const unit = "minmax(0, 1fr) ";

  return (
    <div className="flex flex-col justify-between w-full h-screen p-1">
      <div
        className="grid gap-1 flex-1"
        style={{
          gridTemplateColumns:
            remoteUsers.length > 9
              ? unit.repeat(4)
              : remoteUsers.length > 4
              ? unit.repeat(3)
              : remoteUsers.length > 1
              ? unit.repeat(2)
              : unit,
        }}
      >

        <div ref={localVideoRef} className="w-full h-full" />

        {remoteUsers.map((user) => (
          <RemoteUser key={user.uid} user={user} />
        ))}
      </div>
    </div>
  );
}

export default Call;
