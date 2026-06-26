"use client";

import { useEffect, useState } from "react";
import { BlogsCard, type ApiBlog } from "@/components/blog-card";
import { makeApiRequest } from "@/apis/axios-instance";
import { apiUrls } from "@/apis/api-endpoint";

export function HomeBlogsSection() {
  const [blogs, setBlogs] = useState<ApiBlog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    makeApiRequest<{ data: ApiBlog[] }>(apiUrls.BLOGS, {
      params: { per_page: 10, lang: "en", page: 1 },
    })
      .then((res) => setBlogs(res?.data ?? []))
      .catch(() => setBlogs([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="w-full bg-white py-8">
        <div className="global-container">
          <div className="h-8 w-48 bg-slate-100 rounded animate-pulse mb-6" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-64 bg-slate-100 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return <BlogsCard showAll={false} blogs={blogs} />;
}
