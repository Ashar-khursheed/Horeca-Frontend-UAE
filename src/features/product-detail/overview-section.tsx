type OverviewSectionProps = {
  overview: string;
};

const isHtml = (s: string) => /<[a-z][\s\S]*>/i.test(s);

export const OverviewSection = ({ overview }: OverviewSectionProps) => {
  if (isHtml(overview)) {
    return (
      <div
        className="text-sm text-gray-600 leading-relaxed prose prose-sm max-w-none"
        dangerouslySetInnerHTML={{ __html: overview }}
      />
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
