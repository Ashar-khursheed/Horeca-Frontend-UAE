type OverviewSectionProps = {
  overview: string;
};

export const OverviewSection = ({ overview }: OverviewSectionProps) => (
  <>
    {overview.split("\n\n").map((para, i) => (
      <p
        key={i}
        className="text-sm text-gray-600 leading-relaxed mb-4 last:mb-0"
      >
        {para}
      </p>
    ))}
  </>
);
