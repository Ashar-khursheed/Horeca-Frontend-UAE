import type { Metadata } from "next";
import VideoCall from "./VideoCall";

export const metadata: Metadata = {
  title: "Video Call | HorecaStore",
  robots: { index: false, follow: false },
};

export default function VideoCallPage() {
  return <VideoCall />;
}
