import type { Metadata } from "next";
import VideoCall from "@/app/video-call/VideoCall";

export const metadata: Metadata = {
  title: "Join customer video call | HorecaStore",
  robots: { index: false, follow: false },
};

export default async function SalesJoinPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <main className="mx-auto w-full max-w-5xl px-4 py-8">
        <h1 className="text-2xl font-bold text-[#121212]">Join video call</h1>
        <p className="mt-3 text-sm text-[#b42318]">
          This join link is missing or no longer valid. Open the latest email
          from HorecaStore.
        </p>
      </main>
    );
  }

  return <VideoCall salesLink={token} />;
}
