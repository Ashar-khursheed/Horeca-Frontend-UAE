"use client";

import type { DailyCall } from "@daily-co/daily-js";
import { useEffect, useRef, useState } from "react";

type Props = {
  salesLink?: string;
};

function readCustomerName() {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return "";
    const user = JSON.parse(raw) as { name?: unknown };
    return typeof user.name === "string" ? user.name : "";
  } catch {
    return "";
  }
}

function readError(err: unknown) {
  if (typeof err === "string") return err;
  if (err instanceof Error) return err.message;
  if (typeof err === "object" && err && "errorMsg" in err) {
    return String((err as { errorMsg?: unknown }).errorMsg ?? "");
  }
  return "";
}

function messageFor(raw: string) {
  if (raw.includes("account-missing-payment-method")) {
    return "Daily needs a credit card on this account before a call can start. The first 10,000 minutes each month stay free. Add a card in the Daily dashboard, then press Start call again.";
  }
  if (!raw || raw.includes("Unhandled error")) {
    return "The call could not start. Refresh the page and try again.";
  }
  return raw;
}

export default function VideoCall({ salesLink }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const callRef = useRef<DailyCall | null>(null);
  const reasonRef = useRef("");
  const startingRef = useRef(false);
  const [loading, setLoading] = useState(false);
  const [inCall, setInCall] = useState(false);
  const [error, setError] = useState("");
  const [needsCard, setNeedsCard] = useState(false);
  const [notified, setNotified] = useState(false);
  const [recording, setRecording] = useState(false);
  const [recordBusy, setRecordBusy] = useState(false);

  async function destroyCall() {
    const call = callRef.current;
    callRef.current = null;
    if (!call) return;
    try {
      await call.leave();
    } catch {
      // The meeting is already closed.
    }
    call.destroy();
    setInCall(false);
    setRecording(false);
  }

  async function toggleRecording() {
    const call = callRef.current;
    if (!call || recordBusy) return;
    setRecordBusy(true);
    setError("");
    try {
      if (recording) {
        await call.stopRecording();
      } else {
        await call.startRecording();
      }
    } catch (err) {
      setError(
        messageFor(readError(err) || "Recording could not be changed"),
      );
    } finally {
      setRecordBusy(false);
    }
  }

  async function startOrJoin() {
    if (!containerRef.current || callRef.current || startingRef.current) return;
    startingRef.current = true;
    setLoading(true);
    setError("");
    setNeedsCard(false);
    setNotified(false);
    reasonRef.current = "";

    try {
      const response = await fetch(
        salesLink ? "/api/calls/join" : "/api/calls",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(
            salesLink
              ? { link: salesLink }
              : { customerName: readCustomerName() },
          ),
        },
      );
      const data = (await response.json()) as {
        error?: string;
        roomUrl?: string;
        token?: string;
        notified?: boolean;
      };

      if (!response.ok || !data.roomUrl || !data.token) {
        throw new Error(data.error || "Unable to start the call");
      }

      const { default: DailyIframe } = await import("@daily-co/daily-js");
      const frame = DailyIframe.createFrame(containerRef.current, {
        showLeaveButton: true,
        iframeStyle: {
          width: "100%",
          height: "100%",
          border: "0",
        },
      });
      callRef.current = frame;
      frame.on("joined-meeting", () => setInCall(true));
      frame.on("recording-started", () => setRecording(true));
      frame.on("recording-stopped", () => setRecording(false));
      frame.on("recording-error", (event) => {
        setRecording(false);
        const raw = readError(event);
        setError(messageFor(raw || "Recording could not start"));
      });
      frame.on("error", (event) => {
        const raw = readError(event);
        if (raw) reasonRef.current = raw;
        setNeedsCard(raw.includes("account-missing-payment-method"));
        setError(messageFor(raw));
      });
      frame.on("left-meeting", () => {
        setInCall(false);
        frame.destroy();
        setRecording(false);
        if (callRef.current === frame) callRef.current = null;
      });

      if (!salesLink && data.notified) setNotified(true);
      await frame.join({ url: data.roomUrl, token: data.token });
    } catch (err) {
      const raw = reasonRef.current || readError(err);
      setNeedsCard(raw.includes("account-missing-payment-method"));
      setError(messageFor(raw));
      await destroyCall();
    } finally {
      startingRef.current = false;
      setLoading(false);
    }
  }

  useEffect(() => {
    return () => {
      const call = callRef.current;
      callRef.current = null;
      call?.destroy();
    };
  }, []);

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-bold text-[#121212]">
        {salesLink ? "Customer video call" : "Video call"}
      </h1>
      <p className="mt-1 text-sm text-[#4b5563]">
        {salesLink
          ? "Camera, microphone, recording, and end call. This link expires in one hour."
          : "Start the call and our sales team is emailed a private join link."}
      </p>

      <div
        ref={containerRef}
        className="mt-5 h-[70vh] min-h-[420px] overflow-hidden rounded-xl bg-black"
      />

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={startOrJoin}
          disabled={loading || inCall}
          className="rounded-lg bg-[#186737] px-5 py-3 font-semibold text-white disabled:opacity-50"
        >
          {loading ? "Connecting..." : salesLink ? "Join call" : "Start call"}
        </button>
        {salesLink && (
          <button
            type="button"
            onClick={toggleRecording}
            disabled={!inCall || recordBusy}
            className="rounded-lg bg-[#121212] px-5 py-3 font-semibold text-white disabled:opacity-50"
          >
            {recordBusy
              ? "Please wait..."
              : recording
                ? "Stop recording"
                : "Start recording"}
          </button>
        )}
        <button
          type="button"
          onClick={destroyCall}
          disabled={!inCall && !loading}
          className="rounded-lg bg-[#b42318] px-5 py-3 font-semibold text-white disabled:opacity-50"
        >
          End call
        </button>
      </div>

      {salesLink && recording && (
        <p className="mt-4 text-sm font-semibold text-[#b42318]">
          Recording. Everyone on the call can see that it is being recorded.
          The file is saved in your Daily dashboard.
        </p>
      )}

      {notified && !error && (
        <p className="mt-4 text-sm text-[#186737]">
          Waiting for a sales specialist. We emailed the sales team. Please keep
          this page open.
        </p>
      )}

      {error && (
        <p className="mt-3 text-sm text-[#b42318]">
          {error}{" "}
          {needsCard && (
            <a
              href="https://dashboard.daily.co"
              target="_blank"
              rel="noreferrer"
              className="font-semibold underline"
            >
              Open Daily dashboard
            </a>
          )}
        </p>
      )}
    </main>
  );
}
