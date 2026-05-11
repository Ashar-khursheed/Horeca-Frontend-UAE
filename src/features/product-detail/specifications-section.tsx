import React from "react";
import type { Spec } from "./types";

type SpecificationsSectionProps = {
  specifications: { left: Spec[]; right: Spec[] };
};

export const SpecificationsSection = ({
  specifications,
}: SpecificationsSectionProps) => {
  const allSpecs = [
    ...specifications.left,
    ...specifications.right,
  ];
  const rows: (typeof allSpecs)[] = [];
  for (let i = 0; i < allSpecs.length; i += 3) {
    rows.push(allSpecs.slice(i, i + 3));
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} className={ri % 2 === 0 ? "bg-white" : "bg-gray-100"}>
              {row.map((spec, ci) => (
                <React.Fragment key={ci}>
                  <td className="px-4 py-3 text-gray-800 font-semibold w-[16%] border border-gray-100 whitespace-nowrap">
                    {spec.attribute_name}
                  </td>
                  <td className="px-4 py-3 text-gray-500 font-medium w-[17%] border border-gray-100">
                    {spec.attribute_value}
                  </td>
                </React.Fragment>
              ))}
              {row.length < 3 &&
                Array.from({ length: 3 - row.length }).map((_, ei) => (
                  <React.Fragment key={ei}>
                    <td className="border border-gray-100" />
                    <td className="border border-gray-100" />
                  </React.Fragment>
                ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
