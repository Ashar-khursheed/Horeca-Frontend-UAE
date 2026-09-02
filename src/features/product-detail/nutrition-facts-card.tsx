import type { NutritionFact } from "./types";

type NutritionFactsCardProps = {
  facts: NutritionFact[];
};

export const NutritionFactsCard = ({ facts }: NutritionFactsCardProps) => {
  if (!facts || facts.length === 0) return null;

  return (
    <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm p-4">
      <h3 className="text-lg font-extrabold text-gray-900">
        Nutrition Facts
      </h3>
      <div className="border-t-4 border-gray-900 mt-2" />
      <div className="divide-y divide-gray-200">
        {facts.map((fact, i) => (
          <div
            key={`${fact.name}-${i}`}
            className="flex items-center justify-between py-2"
          >
            <span className="text-sm font-semibold text-gray-800">
              {fact.name}
            </span>
            <span className="text-sm text-gray-600">{fact.value}</span>
          </div>
        ))}
      </div>
      <div className="border-t-4 border-gray-900" />
    </div>
  );
};
