"use client";

import { apiUrls } from "@/apis/api-endpoint";
import { makeApiRequest } from "@/apis/axios-instance";
import { useAppSelector } from "@/store/hooks";
import { CornerDownRight, Lock, MessageCircle, Send, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface Comment {
  id: number;
  comment: string;
  parent_id: number | null;
  created_at: string;
  creator: { id: number; name: string } | null;
  replies?: Comment[];
}

interface CommentsResponse {
  status: string;
  data: {
    post: { id: number; title: string };
    comments: Comment[];
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatTimeAgo = (iso: string) => {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const getInitials = (name: string) =>
  name?.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2) || "U";

// ─── Single Comment ───────────────────────────────────────────────────────────
function CommentItem({
  comment,
  blogId,
  isLoggedIn,
  onReplySubmit,
}: {
  comment: Comment;
  blogId: number;
  isLoggedIn: boolean;
  onReplySubmit: (text: string, parentId: number) => Promise<void>;
}) {
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleReply = async () => {
    if (!replyText.trim()) return;
    setSubmitting(true);
    await onReplySubmit(replyText.trim(), comment.id);
    setReplyText("");
    setReplyOpen(false);
    setSubmitting(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-3">
        <div className="w-9 h-9 rounded-full bg-[#186737]/10 flex items-center justify-center shrink-0 text-[#186737] font-bold text-xs">
          {getInitials(comment.creator?.name ?? "User")}
        </div>
        <div className="flex-1 min-w-0">
          <div className="bg-white border border-gray-200 rounded-[10px] px-4 py-3">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-sm font-semibold text-gray-900">
                {comment.creator?.name ?? "Anonymous"}
              </span>
              <span className="text-xs text-gray-400">
                {mounted ? formatTimeAgo(comment.created_at) : ""}
              </span>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">{comment.comment}</p>
          </div>

          {/* {isLoggedIn && (
            <button
              onClick={() => setReplyOpen((p) => !p)}
              className="mt-1 ml-1 text-xs text-gray-400 hover:text-[#186737] font-medium transition-colors flex items-center gap-1"
            >
              <CornerDownRight size={11} /> Reply
            </button>
          )} */}

          {/* {replyOpen && (
            <div className="mt-2 flex gap-2">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a reply..."
                rows={2}
                className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-[8px] resize-none focus:outline-none focus:ring-2 focus:ring-[#186737]/30"
              />
              <button
                onClick={handleReply}
                disabled={submitting || !replyText.trim()}
                className="self-end px-4 py-2 bg-[#186737] text-white text-xs font-semibold rounded-[8px] hover:bg-[#145c2e] disabled:opacity-50 transition-colors"
              >
                {submitting ? "..." : "Reply"}
              </button>
            </div>
          )} */}
        </div>
      </div>

      {/* Nested replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-12 space-y-3 border-l-2 border-gray-100 pl-4">
          {comment.replies.map((reply) => (
            <div key={reply.id} className="flex gap-3">
              <div className="w-7 h-7 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 text-[#186737] font-bold text-[10px]">
                {getInitials(reply.creator?.name ?? "User")}
              </div>
              <div className="flex-1 bg-white border border-gray-100 rounded-[10px] px-3 py-2.5">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-gray-900">
                    {reply.creator?.name ?? "Anonymous"}
                  </span>
                  <span className="text-[11px] text-gray-400">
                    {mounted ? formatTimeAgo(reply.created_at) : ""}
                  </span>
                </div>
                <p className="text-xs text-gray-700 leading-relaxed">{reply.comment}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function BlogComments({
  blogId,
  initialComments,
}: {
  blogId: number;
  initialComments?: Comment[];
}) {
  const router = useRouter();
  const customer = useAppSelector((s) => s.profile.customer);
  const profileLoading = useAppSelector((s) => s.profile.loading);

  const [comments, setComments] = useState<Comment[]>(initialComments ?? []);
  const [loading, setLoading] = useState(initialComments === undefined);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isLoggedIn = !!customer;

  const fetchComments = async () => {
    try {
      const res = await makeApiRequest<CommentsResponse>(apiUrls.BLOG_COMMENTS(blogId));
      setComments(res?.data?.comments ?? []);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setIsMounted(true);
    if (initialComments === undefined) {
      fetchComments();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blogId]);

  const submitComment = async (commentText: string, parentId: number | null = null) => {
    await makeApiRequest(apiUrls.BLOG_COMMENTS(blogId), {
      method: "POST",
      data: { comment: commentText, parent_id: parentId ?? 0 },
    });
    await fetchComments();
  };

  const handleSubmit = async () => {
    if (!text.trim()) return;
    setError("");
    setSubmitting(true);
    try {
      await submitComment(text.trim(), null);
      setText("");
    } catch {
      setError("Failed to post comment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const totalCount = comments.reduce(
    (acc, c) => acc + 1 + (c.replies?.length ?? 0),
    0
  );

  return (
    <div>
      {/* Header */}
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-5 flex items-center gap-3">
        <MessageCircle size={22} className="text-[#186737]" />
        Comments
        {!loading && (
          <span className="text-sm font-normal text-gray-400">({totalCount})</span>
        )}
      </h2>

      {/* Comment form */}
      {!isMounted || profileLoading ? (
        <div className="mb-6 h-[160px] bg-white border border-gray-100 rounded-[12px] animate-pulse" />
      ) : isLoggedIn ? (
        <div className="mb-6 bg-white border border-gray-200 rounded-[12px] p-4">
          <div className="flex gap-3">
            <div className="w-9 h-9 rounded-full bg-[#186737]/10 flex items-center justify-center shrink-0 text-[#186737] font-bold text-xs">
              {getInitials(customer.name)}
            </div>
            <div className="flex-1">
              <textarea
                ref={textareaRef}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Share your thoughts..."
                rows={3}
                className="w-full px-4 py-3 text-sm border border-gray-200 rounded-[10px] resize-none focus:outline-none focus:ring-2 focus:ring-[#186737]/30 focus:border-[#186737]/50 transition-all"
              />
              {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-400">
                  Commenting as <strong className="text-gray-600">{customer.name}</strong>
                </span>
                <button
                  onClick={handleSubmit}
                  disabled={submitting || !text.trim()}
                  className="flex items-center gap-2 px-5 py-2 bg-[#186737] text-white text-sm font-semibold rounded-[8px] hover:bg-[#145c2e] disabled:opacity-50 transition-all active:scale-95"
                >
                  {submitting ? (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send size={14} />
                  )}
                  Post Comment
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-6 text-center p-8 bg-white rounded-[7px] border-2 border-dashed border-gray-200">
          <div className="w-12 h-12 bg-[#186737]/10 rounded-full flex items-center justify-center mx-auto mb-3">
            <Lock size={20} className="text-[#186737]" />
          </div>
          <h3 className="text-base font-bold text-gray-900 mb-1">Login to Comment</h3>
          <p className="text-gray-500 mb-4 text-sm">
            Join the conversation! Please log in to share your thoughts.
          </p>
          <button
            onClick={() => router.push("/login")}
            className="px-5 py-2.5 bg-[#186737] text-white rounded-[7px] hover:bg-[#145c2e] transition-colors inline-flex items-center gap-2 text-sm font-semibold"
          >
            <User size={15} /> Login Now
          </button>
        </div>
      )}

      {/* Comments list */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-3 animate-pulse">
              <div className="w-9 h-9 rounded-full bg-gray-200 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-gray-200 rounded w-1/4" />
                <div className="h-3 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-[7px] border border-gray-200">
          <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Send size={22} className="text-gray-400" />
          </div>
          <h4 className="text-sm font-semibold text-gray-900 mb-1">No comments yet</h4>
          <p className="text-gray-400 text-sm">Be the first to share your thoughts!</p>
        </div>
      ) : (
        <div className="space-y-5">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              blogId={blogId}
              isLoggedIn={isLoggedIn}
              onReplySubmit={submitComment}
            />
          ))}
        </div>
      )}
    </div>
  );
}
