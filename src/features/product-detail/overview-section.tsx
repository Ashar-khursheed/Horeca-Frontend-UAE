type OverviewSectionProps = {
  overview: string;
};

const isHtml = (s: string) => /<[a-z][\s\S]*>/i.test(s);

export const OverviewSection = ({ overview }: OverviewSectionProps) => {
  if (isHtml(overview)) {
    return (
      <>
        <style>{`
          .overview-content h1 { font-size: 18px; font-weight: 700; color: #111827; margin-bottom: 8px; margin-top: 12px; }
          .overview-content h2 { font-size: 18px; font-weight: 700; color: #111827; margin-bottom: 8px; margin-top: 12px; }
          .overview-content h3 { font-size: 15px; font-weight: 600; color: #1f2937; margin-bottom: 6px; margin-top: 10px; }
          .overview-content ul { list-style: disc; padding-left: 20px; margin-bottom: 8px; }
          .overview-content ol { list-style: decimal; padding-left: 20px; margin-bottom: 8px; }
          .overview-content li { margin-bottom: 4px; }
          .overview-content p { margin-bottom: 8px; }
          .overview-content a { color: #186737; text-decoration: underline; }
          .overview-content strong { color: #374151; font-weight: 600; }
        `}</style>
        <div
          className="text-sm text-gray-600 leading-relaxed overview-content"
          dangerouslySetInnerHTML={{ __html: overview }}
        />
      </>
    );
  }
  return (
    <>
      {overview.split("\n\n").map((para, i) => (
        <p key={i} className="text-sm text-gray-600 leading-relaxed mb-4 last:mb-0">
          {para}
        </p>
      ))}
    </>
  );
};
