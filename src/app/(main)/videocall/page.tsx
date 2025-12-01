import Call from "@/components/VideoCall/index";

export default function Page() {
  const channelName = "test";
  const uid = Math.floor(Math.random() * 100000);
  const token =
    "007eJxTYPhttfCczL7Wxzn7Lk0R2treMMHz5YpHLSV5NULWwsplX5YqMKSZGyabpFgYGxpbmJoYW1gkmlgYpySlpJkmG6UkmqWabFykm9EQyMgQMPMTEyMDBIL4LAwlqcUlDAwA1YohQA==";

  return (
    <main className="flex w-full flex-col">
      <p className="absolute z-10 mt-2 ml-12 text-2xl font-bold text-gray-900">
        {channelName}
      </p>
      <Call
        appId={process.env.NEXT_PUBLIC_AGORA_APP_ID!}
        channelName={channelName}
        uid={uid}
        token={token}
      />
    </main>
  );
}
